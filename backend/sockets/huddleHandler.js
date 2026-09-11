// backend/sockets/huddleHandler.js
/**
 * In-memory registry of active huddles per board.
 * Structure:
 * boardHuddles: Map<boardId, Map<socketId, Participant>>
 *
 * Participant: {
 *   socketId: string,
 *   user: { _id, name, avatar, email },
 *   isAudioMuted: boolean,
 *   isVideoOff: boolean,
 *   isScreenSharing: boolean
 * }
 */
const boardHuddles = new Map()

/**
 * Returns a summary of all boards with an ongoing/active V-Chat call.
 * Format: { [boardId]: { boardId, count, participants: [{ socketId, user }] } }
 */
function getActiveHuddlesSummary() {
  const result = {}
  for (const [boardId, roomParticipants] of boardHuddles.entries()) {
    if (roomParticipants && roomParticipants.size > 0) {
      result[boardId] = {
        boardId,
        count: roomParticipants.size,
        participants: Array.from(roomParticipants.values()).map(p => ({
          socketId: p.socketId,
          user: p.user
        }))
      }
    }
  }
  return result
}

function registerHuddleHandlers(io, socket) {
  /**
   * 0. GET ALL ACTIVE HUDDLE BOARDS
   * Used by Dashboard "Your Boards" to render active V-Chat badges on board cards.
   */
  socket.on('huddle:get-active-boards', () => {
    socket.emit('huddle:active-boards', getActiveHuddlesSummary())
  })

  /**
   * 1. GET HUDDLE STATUS
   * When a user loads a board, they ask: "Is there an active call happening right now?"
   * We reply with the current list of participants so the Navbar can display a live badge.
   */
  socket.on('huddle:get-status', (boardId) => {
    if (!boardId) return
    const participants = boardHuddles.has(boardId)
      ? Array.from(boardHuddles.get(boardId).values())
      : []
    socket.emit('huddle:status', { boardId, participants })
  })
 
  /**
   * 2. JOIN HUDDLE
   * When a user clicks "Join Huddle":
   * 1. They join the `huddle:${boardId}` socket room.
   * 2. The server sends them `huddle:all-users` (the list of existing callers).
   * 3. The server broadcasts `huddle:user-joined` to everyone already in the call.
   * 4. The server broadcasts updated participant count to the board for the navbar.
   * 5. The server broadcasts updated active huddle boards to all connected clients.
   */
  socket.on('huddle:join', ({ boardId, user }) => {
    if (!boardId) return

    socket.join(`board:${boardId}`)
    socket.join(`huddle:${boardId}`)
    socket.currentHuddleBoardId = boardId

    if (!boardHuddles.has(boardId)) {
      boardHuddles.set(boardId, new Map())
    }

    const roomParticipants = boardHuddles.get(boardId)

    // Existing peers currently in this call (excluding the newcomer)
    const existingPeers = Array.from(roomParticipants.values())

    // Store the newcomer's info
    const participantInfo = {
      socketId: socket.id,
      user: user || { _id: socket.id, name: 'Anonymous' },
      isAudioMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      joinedAt: Date.now()
    }
    roomParticipants.set(socket.id, participantInfo)

    // A. Send the list of existing peers to the newcomer so they know who to call
    socket.emit('huddle:all-users', existingPeers)

    // B. Tell the existing peers that a new peer has joined
    socket.to(`huddle:${boardId}`).emit('huddle:user-joined', participantInfo)

    // C. Broadcast active status to all board viewers (for navbar pulsing badge)
    io.to(`board:${boardId}`).emit('huddle:status', {
      boardId,
      participants: Array.from(roomParticipants.values())
    })

    // D. Global broadcast to all connected clients (for "Your Boards" live badge)
    io.emit('huddle:active-boards', getActiveHuddlesSummary())
  })

  /**
   * 3. SIGNALING RELAY (The Matchmaker)
   * This is the core WebRTC signaling channel.
   * Peer A sends an SDP Offer, SDP Answer, or ICE Candidate intended for Peer B.
   * The server simply forwards it directly to Peer B's socketId.
   */
  socket.on('huddle:signal', ({ to, signal, fromUser }) => {
    if (!to || !signal) return
    io.to(to).emit('huddle:signal', {
      from: socket.id,
      signal,
      fromUser
    })
  })

  /**
   * 4. MEDIA TOGGLE (Mic / Camera / Screen Share state sync)
   * When a user mutes their mic or turns off camera, we broadcast it
   * so other clients can render the "Muted" icon or avatar placeholder.
   */
  socket.on('huddle:toggle-media', ({ boardId, isAudioMuted, isVideoOff, isScreenSharing }) => {
    if (!boardId || !boardHuddles.has(boardId)) return
    const roomParticipants = boardHuddles.get(boardId)
    if (roomParticipants.has(socket.id)) {
      const p = roomParticipants.get(socket.id)
      if (typeof isAudioMuted === 'boolean') p.isAudioMuted = isAudioMuted
      if (typeof isVideoOff === 'boolean') p.isVideoOff = isVideoOff
      if (typeof isScreenSharing === 'boolean') p.isScreenSharing = isScreenSharing

      socket.to(`huddle:${boardId}`).emit('huddle:user-toggled-media', {
        socketId: socket.id,
        isAudioMuted: p.isAudioMuted,
        isVideoOff: p.isVideoOff,
        isScreenSharing: p.isScreenSharing
      })
    }
  })

  /**
   * Helper function to cleanly remove a socket from a huddle
   */
  const handleLeaveHuddle = () => {
    const boardId = socket.currentHuddleBoardId
    if (!boardId || !boardHuddles.has(boardId)) return

    const roomParticipants = boardHuddles.get(boardId)
    roomParticipants.delete(socket.id)
    socket.leave(`huddle:${boardId}`)
    socket.currentHuddleBoardId = null

    // Notify peers in the call so they can close RTCPeerConnection and remove the video tile
    socket.to(`huddle:${boardId}`).emit('huddle:user-left', { socketId: socket.id })

    // Clean up empty room memory
    if (roomParticipants.size === 0) {
      boardHuddles.delete(boardId)
    }

    // Broadcast updated participant list to board room
    io.to(`board:${boardId}`).emit('huddle:status', {
      boardId,
      participants: roomParticipants.size > 0 ? Array.from(roomParticipants.values()) : []
    })

    // Global broadcast to all connected clients (for "Your Boards" live badge)
    io.emit('huddle:active-boards', getActiveHuddlesSummary())
  }

  /**
   * 5. LEAVE HUDDLE
   * Triggered when the user clicks the "Leave" button or closes the call widget.
   */
  socket.on('huddle:leave', handleLeaveHuddle)

  /**
   * 6. DISCONNECT
   * If the user abruptly closes the tab or loses internet, clean up automatically.
   */
  socket.on('disconnect', handleLeaveHuddle)
}

registerHuddleHandlers.getActiveHuddlesSummary = getActiveHuddlesSummary
module.exports = registerHuddleHandlers
