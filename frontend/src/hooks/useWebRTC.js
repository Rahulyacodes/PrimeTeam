// frontend/src/hooks/useWebRTC.js
import { useState, useRef, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

// Free public Google STUN servers for NAT Traversal (discovering public IP/ports)
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
}

/**
 * useWebRTC Hook
 * Core real-time media and WebRTC peer connection manager for in-board Huddles.
 *
 * @param {Object} params
 * @param {string} params.boardId - The ID of the current board
 * @param {Object} params.user - The authenticated user profile
 * @param {Object} [params.existingSocket] - Optional existing socket instance to reuse
 */
export function useWebRTC({ boardId, user, existingSocket = null }) {
  // Local Media & Control States
  const [localStream, setLocalStream] = useState(null)
  const [peers, setPeers] = useState({}) // { [socketId]: { socketId, user, stream, isAudioMuted, isVideoOff, isScreenSharing } }
  const [isHuddleActive, setIsHuddleActive] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [activeParticipants, setActiveParticipants] = useState([]) // For navbar presence
  const [connectionStatus, setConnectionStatus] = useState('idle') // 'idle' | 'connecting' | 'connected'

  // Persistent references that do not trigger re-renders or get wiped in async closures
  const socketRef = useRef(null)
  const peersRef = useRef({}) // { [socketId]: { pc: RTCPeerConnection, user: Object, pendingCandidates: Array } }
  const localStreamRef = useRef(null)
  const screenTrackRef = useRef(null)
  const isInitiatorRef = useRef({})

  /**
   * 1. Adaptive Quality Scaling
   * Dynamically adjusts the camera's resolution constraints based on total room size.
   * Keeps total upload safely under ~1.6 Mbps regardless of participant count.
   */
  const applyAdaptiveQuality = useCallback(async (participantCount) => {
    if (!localStreamRef.current || screenTrackRef.current) return // Don't alter screen share
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    if (!videoTrack || !videoTrack.enabled) return

    let constraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24 } }

    if (participantCount <= 2) {
      // 1-on-1: 720p HD
      constraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24 } }
    } else if (participantCount === 3) {
      // 3 members: 540p qHD (saves 40% bandwidth, visually HD)
      constraints = { width: { ideal: 960 }, height: { ideal: 540 }, frameRate: { ideal: 24 } }
    } else if (participantCount === 4) {
      // 4 members: 480p SD
      constraints = { width: { ideal: 854 }, height: { ideal: 480 }, frameRate: { ideal: 24 } }
    } else {
      // 5+ members: 360p @ 20fps (ultra-light, maintains smooth audio)
      constraints = { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 20 } }
    }

    try {
      await videoTrack.applyConstraints(constraints)
      console.log(`[WebRTC] Adaptive Quality Applied for ${participantCount} members:`, constraints)
    } catch (err) {
      console.warn('[WebRTC] applyConstraints failed (camera may not support constraint):', err)
    }
  }, [])

  /**
   * 2. Initialize Local Camera and Microphone
   * Requests media with hardware audio processing (echo cancellation & noise suppression)
   */
  const startLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: {
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          frameRate: { ideal: 24, max: 30 }
        }
      })

      localStreamRef.current = stream
      setLocalStream(stream)
      setIsAudioMuted(false)
      setIsVideoOff(false)
      return stream
    } catch (err) {
      console.error('[WebRTC] Failed to capture camera/mic:', err)
      // Fallback to audio only if webcam is unavailable or blocked
      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        })
        localStreamRef.current = audioOnlyStream
        setLocalStream(audioOnlyStream)
        setIsVideoOff(true)
        return audioOnlyStream
      } catch (audioErr) {
        console.error('[WebRTC] Audio fallback also failed:', audioErr)
        throw audioErr
      }
    }
  }, [])

  /**
   * 3. Create or Retrieve an RTCPeerConnection for a specific target peer
   */
  const createPeerConnection = useCallback((targetSocketId, targetUser, isInitiator = false) => {
    if (peersRef.current[targetSocketId]?.pc) {
      return peersRef.current[targetSocketId].pc
    }

    console.log(`[WebRTC] Creating RTCPeerConnection to ${targetSocketId} (isInitiator: ${isInitiator})`)
    const pc = new RTCPeerConnection(ICE_SERVERS)

    peersRef.current[targetSocketId] = {
      pc,
      user: targetUser,
      pendingCandidates: []
    }

    // Attach our local media tracks (Audio & Video) to this peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })
    }

    // ICE Candidate Discovery Handler
    // As the browser pings Google STUN and discovers candidate paths, forward them
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('huddle:signal', {
          to: targetSocketId,
          signal: { type: 'ice-candidate', candidate: event.candidate },
          fromUser: user
        })
      }
    }

    // Remote Stream Track Handler
    // When audio/video packets start flowing in from the other peer, attach to state
    pc.ontrack = (event) => {
      console.log(`[WebRTC] Received remote track (${event.track.kind}) from ${targetSocketId}`)
      const [remoteStream] = event.streams
      if (remoteStream) {
        setPeers((prev) => ({
          ...prev,
          [targetSocketId]: {
            ...(prev[targetSocketId] || {}),
            socketId: targetSocketId,
            user: targetUser,
            stream: remoteStream
          }
        }))
      }
    }

    // Connection Lifecycle Monitoring
    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] Peer ${targetSocketId} state:`, pc.connectionState)
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected')
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        // Peer disconnected or dropped
        handlePeerDisconnect(targetSocketId)
      }
    }

    // If we are the initiator (e.g. newcomer calling existing member), create and send Offer
    if (isInitiator) {
      isInitiatorRef.current[targetSocketId] = true
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit('huddle:signal', {
            to: targetSocketId,
            signal: pc.localDescription,
            fromUser: user
          })
        })
        .catch((err) => console.error(`[WebRTC] createOffer error for ${targetSocketId}:`, err))
    }

    return pc
  }, [user])

  /**
   * 4. Helper to cleanly remove a disconnected peer
   */
  const handlePeerDisconnect = useCallback((targetSocketId) => {
    if (peersRef.current[targetSocketId]) {
      try {
        peersRef.current[targetSocketId].pc.close()
      } catch (err) {}
      delete peersRef.current[targetSocketId]
    }

    setPeers((prev) => {
      const updated = { ...prev }
      delete updated[targetSocketId]
      return updated
    })
  }, [])

  /**
   * 5. Join Huddle (Entry point for user clicking "Join Call")
   */
  const joinHuddle = useCallback(async () => {
    if (isHuddleActive) return
    setConnectionStatus('connecting')

    try {
      // Step A: Grab webcam & mic
      const stream = await startLocalMedia()

      // Step B: Connect socket if not already open
      if (!socketRef.current) {
        socketRef.current = existingSocket || io(SOCKET_URL, { transports: ['websocket', 'polling'] })
      }

      setIsHuddleActive(true)

      // Step C: Tell the server we are joining this board's huddle
      socketRef.current.emit('huddle:join', {
        boardId,
        user: {
          _id: user?._id || socketRef.current.id,
          name: user?.name || 'Team Member',
          avatar: user?.avatar || '',
          email: user?.email || ''
        }
      })
    } catch (err) {
      console.error('[WebRTC] Could not join huddle:', err)
      setConnectionStatus('idle')
      setIsHuddleActive(false)
    }
  }, [boardId, user, isHuddleActive, existingSocket, startLocalMedia])

  /**
   * 6. Leave Huddle (Clean exit and resource disposal)
   */
  const leaveHuddle = useCallback(() => {
    console.log('[WebRTC] Leaving huddle...')

    // Tell server we left
    if (socketRef.current) {
      socketRef.current.emit('huddle:leave')
    }

    // Stop and release camera and mic hardware sensors
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    // Stop screen share if active
    if (screenTrackRef.current) {
      screenTrackRef.current.stop()
      screenTrackRef.current = null
    }

    // Close all peer connections
    Object.values(peersRef.current).forEach(({ pc }) => {
      try {
        pc.close()
      } catch (err) {}
    })
    peersRef.current = {}

    // Reset all states
    setLocalStream(null)
    setPeers({})
    setIsHuddleActive(false)
    setIsAudioMuted(false)
    setIsVideoOff(false)
    setIsScreenSharing(false)
    setConnectionStatus('idle')
  }, [])

  /**
   * 7. Toggle Microphone (Mute / Unmute)
   */
  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    if (!audioTrack) return

    const newMuted = audioTrack.enabled // if enabled, toggling means muting
    audioTrack.enabled = !audioTrack.enabled
    setIsAudioMuted(newMuted)

    // Notify peers so they see 🔇 icon
    if (socketRef.current && isHuddleActive) {
      socketRef.current.emit('huddle:toggle-media', {
        boardId,
        isAudioMuted: newMuted,
        isVideoOff,
        isScreenSharing
      })
    }
  }, [boardId, isHuddleActive, isVideoOff, isScreenSharing])

  /**
   * 8. Toggle Camera (On / Off)
   */
  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    if (!videoTrack) return

    const newVideoOff = videoTrack.enabled // if enabled, toggling means turning off
    videoTrack.enabled = !videoTrack.enabled
    setIsVideoOff(newVideoOff)

    // Notify peers
    if (socketRef.current && isHuddleActive) {
      socketRef.current.emit('huddle:toggle-media', {
        boardId,
        isAudioMuted,
        isVideoOff: newVideoOff,
        isScreenSharing
      })
    }
  }, [boardId, isHuddleActive, isAudioMuted, isScreenSharing])

  /**
   * 9. Toggle Screen Share (720p @ 15fps with Camera auto-off via replaceTrack)
   */
  const toggleScreenShare = useCallback(async () => {
    if (!isHuddleActive || !localStreamRef.current) return

    if (isScreenSharing) {
      // STOP SCREEN SHARING -> Revert back to webcam
      if (screenTrackRef.current) {
        screenTrackRef.current.stop()
        screenTrackRef.current = null
      }

      const cameraTrack = localStreamRef.current.getVideoTracks()[0]
      if (cameraTrack) {
        cameraTrack.enabled = true
        // Swap back to camera on all active peer connections
        Object.values(peersRef.current).forEach(({ pc }) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video')
          if (sender) sender.replaceTrack(cameraTrack)
        })
      }

      setIsScreenSharing(false)
      setIsVideoOff(false)

      if (socketRef.current) {
        socketRef.current.emit('huddle:toggle-media', {
          boardId,
          isAudioMuted,
          isVideoOff: false,
          isScreenSharing: false
        })
      }
    } else {
      // START SCREEN SHARING
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: { ideal: 15, max: 15 },
            width: { ideal: 1280, max: 1280 },
            height: { ideal: 720, max: 720 }
          },
          audio: false
        })

        const screenTrack = screenStream.getVideoTracks()[0]
        screenTrackRef.current = screenTrack

        // Handle native browser "Stop Sharing" button click
        screenTrack.onended = () => {
          toggleScreenShare()
        }

        // Auto-pause webcam and replace track on all peer connections
        const cameraTrack = localStreamRef.current.getVideoTracks()[0]
        if (cameraTrack) cameraTrack.enabled = false

        Object.values(peersRef.current).forEach(({ pc }) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video')
          if (sender) sender.replaceTrack(screenTrack)
        })

        setIsScreenSharing(true)
        setIsVideoOff(true) // Turn off face camera indicator during screen share

        if (socketRef.current) {
          socketRef.current.emit('huddle:toggle-media', {
            boardId,
            isAudioMuted,
            isVideoOff: true,
            isScreenSharing: true
          })
        }
      } catch (err) {
        console.warn('[WebRTC] User canceled screen sharing dialog:', err)
      }
    }
  }, [isHuddleActive, isScreenSharing, boardId, isAudioMuted])

  /**
   * 10. Core Socket Event Listeners Lifecycle
   */
  useEffect(() => {
    if (!boardId) return

    const socket = existingSocket || io(SOCKET_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    // Always query active huddle status on mount (for navbar badge presence)
    socket.emit('huddle:get-status', boardId)

    // Broadcasted presence updates (who is in the call)
    socket.on('huddle:status', ({ boardId: eventBoardId, participants }) => {
      if (eventBoardId === boardId) {
        setActiveParticipants(participants || [])
        // Apply adaptive quality scaling if we are in the call
        if (isHuddleActive) {
          applyAdaptiveQuality(participants.length)
        }
      }
    })

    // Newcomer receives the list of existing peers -> initiates calls to all of them
    socket.on('huddle:all-users', (existingUsers) => {
      console.log('[WebRTC] Received all active peers:', existingUsers)
      existingUsers.forEach((peer) => {
        createPeerConnection(peer.socketId, peer.user, true)
      })
      applyAdaptiveQuality(existingUsers.length + 1)
    })

    // Existing peers learn a new peer joined -> register placeholder, wait for their Offer
    socket.on('huddle:user-joined', (newParticipant) => {
      console.log('[WebRTC] Peer joined room:', newParticipant)
      setPeers((prev) => ({
        ...prev,
        [newParticipant.socketId]: {
          socketId: newParticipant.socketId,
          user: newParticipant.user,
          stream: null,
          isAudioMuted: newParticipant.isAudioMuted,
          isVideoOff: newParticipant.isVideoOff,
          isScreenSharing: newParticipant.isScreenSharing
        }
      }))
    })

    // Signaling Relay Receiver (Offers, Answers, ICE candidates)
    socket.on('huddle:signal', async ({ from, signal, fromUser }) => {
      let peerData = peersRef.current[from]
      let pc = peerData?.pc

      if (!pc) {
        // If we received an Offer from a peer we don't have yet, create the RTCPeerConnection as receiver
        pc = createPeerConnection(from, fromUser, false)
      }

      if (signal.type === 'offer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal))

          // Process any buffered ICE candidates that arrived before the Offer was set
          if (peerData?.pendingCandidates?.length > 0) {
            for (const candidate of peerData.pendingCandidates) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate))
            }
            peerData.pendingCandidates = []
          }

          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)

          socket.emit('huddle:signal', {
            to: from,
            signal: pc.localDescription,
            fromUser: user
          })
        } catch (err) {
          console.error(`[WebRTC] Failed to handle offer from ${from}:`, err)
        }
      } else if (signal.type === 'answer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal))

          // Process any buffered candidates
          if (peerData?.pendingCandidates?.length > 0) {
            for (const candidate of peerData.pendingCandidates) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate))
            }
            peerData.pendingCandidates = []
          }
        } catch (err) {
          console.error(`[WebRTC] Failed to handle answer from ${from}:`, err)
        }
      } else if (signal.type === 'ice-candidate') {
        try {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate))
          } else {
            // Buffer candidate if remoteDescription hasn't been set yet
            if (!peerData.pendingCandidates) peerData.pendingCandidates = []
            peerData.pendingCandidates.push(signal.candidate)
          }
        } catch (err) {
          console.warn('[WebRTC] addIceCandidate failed:', err)
        }
      }
    })

    // Peer toggled media (mic, camera, or screen share)
    socket.on('huddle:user-toggled-media', ({ socketId, isAudioMuted, isVideoOff, isScreenSharing }) => {
      setPeers((prev) => {
        if (!prev[socketId]) return prev
        return {
          ...prev,
          [socketId]: {
            ...prev[socketId],
            isAudioMuted,
            isVideoOff,
            isScreenSharing
          }
        }
      })
    })

    // Peer disconnected / left call
    socket.on('huddle:user-left', ({ socketId }) => {
      console.log('[WebRTC] Peer left call:', socketId)
      handlePeerDisconnect(socketId)
    })

    return () => {
      if (!existingSocket) {
        socket.disconnect()
      }
    }
  }, [boardId, user, existingSocket, createPeerConnection, handlePeerDisconnect, applyAdaptiveQuality, isHuddleActive])

  // Cleanup on unmount (leaving the page closes hardware and connections)
  useEffect(() => {
    return () => {
      leaveHuddle()
    }
  }, [leaveHuddle])

  return {
    localStream,
    peers: Object.values(peers),
    activeParticipants,
    isHuddleActive,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    connectionStatus,
    joinHuddle,
    leaveHuddle,
    toggleAudio,
    toggleVideo,
    toggleScreenShare
  }
}
