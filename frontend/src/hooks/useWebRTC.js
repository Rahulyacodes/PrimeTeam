// frontend/src/hooks/useWebRTC.js
import { useState, useRef, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

// Public STUN servers for NAT Traversal
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
}

/**
 * useWebRTC Hook for V-Chat (In-Board Video Call)
 */
export function useWebRTC({ boardId, user }) {
  const [localStream, setLocalStream] = useState(null)
  const [peers, setPeers] = useState({}) // { [socketId]: { socketId, user, stream, isAudioMuted, isVideoOff, isScreenSharing } }
  const [isHuddleActive, setIsHuddleActive] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [activeParticipants, setActiveParticipants] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('idle') // 'idle' | 'connecting' | 'connected'

  // Persistent references
  const socketRef = useRef(null)
  const peersRef = useRef({}) // { [socketId]: { pc: RTCPeerConnection, user: Object, pendingCandidates: Array } }
  const localStreamRef = useRef(null)
  const rawCameraTrackRef = useRef(null)
  const screenTrackRef = useRef(null)
  const userRef = useRef(user)
  userRef.current = user

  /**
   * 1. Adaptive Quality Scaling
   */
  const applyAdaptiveQuality = useCallback(async (participantCount) => {
    if (!localStreamRef.current || screenTrackRef.current) return
    const videoTrack = rawCameraTrackRef.current || localStreamRef.current.getVideoTracks()[0]
    if (!videoTrack || !videoTrack.enabled) return

    let constraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24 } }
    if (participantCount <= 2) {
      constraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24 } }
    } else if (participantCount === 3) {
      constraints = { width: { ideal: 960 }, height: { ideal: 540 }, frameRate: { ideal: 24 } }
    } else if (participantCount === 4) {
      constraints = { width: { ideal: 854 }, height: { ideal: 480 }, frameRate: { ideal: 24 } }
    } else {
      constraints = { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 20 } }
    }

    try {
      await videoTrack.applyConstraints(constraints)
      console.log(`[V-Chat] Adaptive resolution applied for ${participantCount} members:`, constraints)
    } catch (err) {
      console.warn('[V-Chat] applyConstraints failed:', err)
    }
  }, [])

  /**
   * 2. Start Local Camera and Microphone
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
      rawCameraTrackRef.current = stream.getVideoTracks()[0]
      setLocalStream(stream)
      setIsAudioMuted(false)
      setIsVideoOff(false)
      return stream
    } catch (err) {
      console.error('[V-Chat] Webcam capture failed, trying audio fallback:', err)
      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        })
        localStreamRef.current = audioOnlyStream
        rawCameraTrackRef.current = null
        setLocalStream(audioOnlyStream)
        setIsVideoOff(true)
        return audioOnlyStream
      } catch (audioErr) {
        console.error('[V-Chat] Audio capture also failed:', audioErr)
        throw audioErr
      }
    }
  }, [])

  /**
   * 3. Create an RTCPeerConnection for a target peer
   */
  const createPeerConnection = useCallback((targetSocketId, targetUser, isInitiator = false) => {
    if (peersRef.current[targetSocketId]?.pc) {
      return peersRef.current[targetSocketId].pc
    }

    console.log(`[V-Chat] Initializing RTCPeerConnection to ${targetSocketId} (isInitiator: ${isInitiator})`)
    const pc = new RTCPeerConnection(ICE_SERVERS)

    peersRef.current[targetSocketId] = {
      pc,
      user: targetUser,
      pendingCandidates: []
    }

    // Attach all local tracks to this peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })
    }

    // Forward ICE candidates to target peer
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('huddle:signal', {
          to: targetSocketId,
          signal: { type: 'ice-candidate', candidate: event.candidate },
          fromUser: userRef.current
        })
      }
    }

    // Receive remote tracks and store in stream
    pc.ontrack = (event) => {
      console.log(`[V-Chat] Received remote track (${event.track.kind}) from ${targetSocketId}`)
      let remoteStream = event.streams?.[0]
      if (!remoteStream) {
        remoteStream = new MediaStream([event.track])
      }

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

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      console.log(`[V-Chat] Connection state with ${targetSocketId}:`, pc.connectionState)
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected')
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        handlePeerDisconnect(targetSocketId)
      }
    }

    // If initiator, generate Offer and send to target peer
    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (socketRef.current) {
            socketRef.current.emit('huddle:signal', {
              to: targetSocketId,
              signal: pc.localDescription,
              fromUser: userRef.current
            })
          }
        })
        .catch((err) => console.error(`[V-Chat] createOffer error for ${targetSocketId}:`, err))
    }

    return pc
  }, [])

  /**
   * 4. Remove a peer cleanly
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
   * 5. Join V-Chat Call
   */
  const joinHuddle = useCallback(async () => {
    if (isHuddleActive) return
    setConnectionStatus('connecting')

    try {
      // Step A: Grab webcam & mic
      await startLocalMedia()

      setIsHuddleActive(true)

      // Step B: Tell server we joined
      if (socketRef.current) {
        socketRef.current.emit('huddle:join', {
          boardId,
          user: {
            _id: userRef.current?._id || socketRef.current.id,
            name: userRef.current?.name || userRef.current?.username || 'Team Member',
            avatar: userRef.current?.avatar || '',
            email: userRef.current?.email || ''
          }
        })
      }
    } catch (err) {
      console.error('[V-Chat] Failed to join call:', err)
      setConnectionStatus('idle')
      setIsHuddleActive(false)
    }
  }, [boardId, isHuddleActive, startLocalMedia])

  /**
   * 6. Leave V-Chat Call
   */
  const leaveHuddle = useCallback(() => {
    console.log('[V-Chat] Leaving call...')

    if (socketRef.current) {
      socketRef.current.emit('huddle:leave')
    }

    // Stop and release camera and mic sensors
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
    rawCameraTrackRef.current = null

    // Stop screen share
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

    // Reset states
    setLocalStream(null)
    setPeers({})
    setIsHuddleActive(false)
    setIsAudioMuted(false)
    setIsVideoOff(false)
    setIsScreenSharing(false)
    setConnectionStatus('idle')
  }, [])

  /**
   * 7. Toggle Mic Mute
   */
  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    if (!audioTrack) return

    const newMuted = audioTrack.enabled
    audioTrack.enabled = !audioTrack.enabled
    setIsAudioMuted(newMuted)

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
   * 8. Toggle Camera On/Off
   */
  const toggleVideo = useCallback(() => {
    const videoTrack = rawCameraTrackRef.current || localStreamRef.current?.getVideoTracks()[0]
    if (!videoTrack) return

    const newVideoOff = videoTrack.enabled
    videoTrack.enabled = !videoTrack.enabled
    setIsVideoOff(newVideoOff)

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
   * 9. Screen Sharing (Live screen feed + replaceTrack)
   */
  const toggleScreenShare = useCallback(async () => {
    if (!isHuddleActive || !localStreamRef.current) return

    if (isScreenSharing) {
      // STOP SCREEN SHARING -> Revert back to webcam
      if (screenTrackRef.current) {
        screenTrackRef.current.stop()
        screenTrackRef.current = null
      }

      const cameraTrack = rawCameraTrackRef.current || localStreamRef.current.getVideoTracks()[0]
      if (cameraTrack) {
        cameraTrack.enabled = true

        // Swap back to camera track on all peer connections
        Object.values(peersRef.current).forEach(({ pc }) => {
          const senders = pc.getSenders()
          const videoSender = senders.find((s) => s.track && s.track.kind === 'video') || senders.find((s) => s.track === null)
          if (videoSender) {
            videoSender.replaceTrack(cameraTrack)
          }
        })

        // Restore localStream for local view
        const cameraStream = new MediaStream([
          cameraTrack,
          ...localStreamRef.current.getAudioTracks()
        ])
        localStreamRef.current = cameraStream
        setLocalStream(cameraStream)
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
          video: true,
          audio: false
        })

        const screenTrack = screenStream.getVideoTracks()[0]
        if (!screenTrack) return
        screenTrackRef.current = screenTrack

        // Handle native browser "Stop sharing" button click
        screenTrack.onended = () => {
          toggleScreenShare()
        }

        // Pause camera track
        const cameraTrack = rawCameraTrackRef.current || localStreamRef.current.getVideoTracks()[0]
        if (cameraTrack) cameraTrack.enabled = false

        // Replace track on all peer connections
        Object.values(peersRef.current).forEach(({ pc }) => {
          const senders = pc.getSenders()
          const videoSender = senders.find((s) => s.track && s.track.kind === 'video') || senders.find((s) => s.track === null)
          if (videoSender) {
            videoSender.replaceTrack(screenTrack)
          }
        })

        // Update localStream with the screen track so presenter's tile shows the screen!
        const screenLocalStream = new MediaStream([
          screenTrack,
          ...localStreamRef.current.getAudioTracks()
        ])
        localStreamRef.current = screenLocalStream
        setLocalStream(screenLocalStream)
        setIsScreenSharing(true)
        setIsVideoOff(false)

        if (socketRef.current) {
          socketRef.current.emit('huddle:toggle-media', {
            boardId,
            isAudioMuted,
            isVideoOff: false,
            isScreenSharing: true
          })
        }
      } catch (err) {
        console.warn('[V-Chat] Screen share was canceled or failed:', err)
      }
    }
  }, [isHuddleActive, isScreenSharing, boardId, isAudioMuted])

  /**
   * 10. Persistent Socket Lifecycle
   * Bound solely to boardId. NEVER disconnects on call join/leave!
   */
  useEffect(() => {
    if (!boardId) return

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[V-Chat] Connected to signaling socket:', socket.id)
      socket.emit('join_board', boardId)
      socket.emit('huddle:get-status', boardId)
    })

    // Active presence in board
    socket.on('huddle:status', ({ boardId: eventBoardId, participants }) => {
      if (eventBoardId === boardId) {
        setActiveParticipants(participants || [])
        applyAdaptiveQuality((participants || []).length)
      }
    })

    // Newcomer gets existing peers -> initiates call to each
    socket.on('huddle:all-users', (existingUsers) => {
      console.log('[V-Chat] Received existing room callers:', existingUsers)
      existingUsers.forEach((peer) => {
        createPeerConnection(peer.socketId, peer.user, true)
      })
      applyAdaptiveQuality(existingUsers.length + 1)
    })

    // Existing callers learn a newcomer joined -> register placeholder
    socket.on('huddle:user-joined', (newParticipant) => {
      console.log('[V-Chat] New member joined room:', newParticipant)
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

    // WebRTC Signaling Relay (Offers, Answers, ICE candidates)
    socket.on('huddle:signal', async ({ from, signal, fromUser }) => {
      let peerData = peersRef.current[from]
      let pc = peerData?.pc

      if (!pc) {
        // Create as receiver (non-initiator)
        pc = createPeerConnection(from, fromUser, false)
        peerData = peersRef.current[from]
      }

      if (signal.type === 'offer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal))

          // Process any buffered ICE candidates
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
            fromUser: userRef.current
          })
        } catch (err) {
          console.error(`[V-Chat] Error processing offer from ${from}:`, err)
        }
      } else if (signal.type === 'answer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal))

          if (peerData?.pendingCandidates?.length > 0) {
            for (const candidate of peerData.pendingCandidates) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate))
            }
            peerData.pendingCandidates = []
          }
        } catch (err) {
          console.error(`[V-Chat] Error processing answer from ${from}:`, err)
        }
      } else if (signal.type === 'ice-candidate') {
        try {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate))
          } else {
            if (!peerData.pendingCandidates) peerData.pendingCandidates = []
            peerData.pendingCandidates.push(signal.candidate)
          }
        } catch (err) {
          console.warn('[V-Chat] addIceCandidate failed:', err)
        }
      }
    })

    // Remote peer media toggle
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

    // Remote peer left
    socket.on('huddle:user-left', ({ socketId }) => {
      console.log('[V-Chat] Peer departed:', socketId)
      handlePeerDisconnect(socketId)
    })

    return () => {
      socket.emit('leave_board', boardId)
      socket.disconnect()
      socketRef.current = null
    }
  }, [boardId, createPeerConnection, handlePeerDisconnect, applyAdaptiveQuality])

  // Cleanup on component unmount
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
