// frontend/src/components/board/BoardHuddleModal.jsx
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { getDiceBearAvatar } from '../../utils/avatars'

/**
 * Calculates optimal standard 16:9 tile dimensions to fit N tiles inside a container (width x height)
 * without any overflow, overlap, or aspect ratio distortion.
 * Follows the layout standards of Zoom and Google Meet.
 *
 * @param {number} containerWidth Available width of stage in px
 * @param {number} containerHeight Available height of stage in px
 * @param {number} count Total number of participant tiles
 * @param {number} gap Gap between tiles in px (default 16)
 */
function calculateOptimalGrid(containerWidth, containerHeight, count, gap = 10) {
  if (!containerWidth || !containerHeight || count <= 0) {
    return { cols: 1, rows: 1, tileWidth: 320, tileHeight: 180, gridWidth: 320, gridHeight: 180 }
  }

  let cols = 1
  let rows = 1

  if (count === 1) {
    cols = 1
    rows = 1
  } else if (count === 2) {
    // 2 tiles side-by-side on landscape screens, stacked on portrait
    cols = containerWidth > containerHeight * 1.2 ? 2 : 1
    rows = containerWidth > containerHeight * 1.2 ? 1 : 2
  } else if (count <= 4) {
    // 3 or 4 users: standard 2x2 grid
    cols = 2
    rows = 2
  } else if (count <= 6) {
    // 5 or 6 users: 3x2 grid
    cols = 3
    rows = 2
  } else if (count <= 8) {
    // 7 or 8 users: 4x2 grid
    cols = 4
    rows = 2
  } else {
    // > 8 users
    cols = Math.ceil(Math.sqrt(count))
    rows = Math.ceil(count / cols)
  }

  const availableW = Math.max(0, containerWidth - (cols - 1) * gap)
  const availableH = Math.max(0, containerHeight - (rows - 1) * gap)

  // Standard 16:9 webcam aspect ratio (Zoom / Meet standard)
  const ASPECT_RATIO = 16 / 9

  // Calculate width-constrained candidate
  const maxTileW = availableW / cols
  const maxTileH = availableH / rows

  let tileW = maxTileW
  let tileH = tileW / ASPECT_RATIO

  // If height derived from width exceeds available height, switch to height-constrained
  if (tileH > maxTileH) {
    tileH = maxTileH
    tileW = tileH * ASPECT_RATIO
  }

  tileW = Math.max(120, Math.floor(tileW))
  tileH = Math.max(68, Math.floor(tileH))

  // Strict clamp to guarantee the grid never exceeds available space or creates overflow
  if (tileW * cols + (cols - 1) * gap > containerWidth) {
    tileW = Math.max(120, Math.floor((containerWidth - (cols - 1) * gap) / cols))
    tileH = Math.max(68, Math.floor(tileW / ASPECT_RATIO))
  }
  if (tileH * rows + (rows - 1) * gap > containerHeight) {
    tileH = Math.max(68, Math.floor((containerHeight - (rows - 1) * gap) / rows))
    tileW = Math.max(120, Math.floor(tileH * ASPECT_RATIO))
  }

  const gridWidth = tileW * cols + (cols - 1) * gap
  const gridHeight = tileH * rows + (rows - 1) * gap

  return { cols, rows, tileWidth: tileW, tileHeight: tileH, gridWidth, gridHeight }
}

/**
 * Individual Video Tile Component
 * Strictly adheres to standard 16:9 webcam aspect ratio and adapts based on tile size.
 */
function VideoTile({
  stream,
  isLocal = false,
  user = {},
  isAudioMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  isSpotlight = false,
  isSmall = false,
  onClick,
  canEnlarge = false,
  style = {}
}) {
  const videoRef = useRef(null)
  const [hasVideoTrack, setHasVideoTrack] = useState(false)

  // Attach MediaStream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      const checkTracks = () => {
        const videoTracks = stream.getVideoTracks()
        setHasVideoTrack(videoTracks.length > 0 && videoTracks[0].enabled)
      }
      checkTracks()
      stream.onaddtrack = checkTracks
      stream.onremovetrack = checkTracks
    }
  }, [stream])

  const displayName = isLocal ? 'You' : user?.name || user?.username || 'Member'
  const avatarSeed = user?.avatar || user?.username || displayName
  const avatarUri = getDiceBearAvatar(avatarSeed)
  const showAvatar = isVideoOff || (!hasVideoTrack && !isScreenSharing)

  const hasExplicitSize = Boolean(style.width && style.height)

  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative rounded-2xl overflow-hidden bg-[#13131A] border border-white/10 shadow-xl flex items-center justify-center transition-all group shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:border-purple-500/70 hover:shadow-purple-950/40' : ''
      } ${
        hasExplicitSize
          ? ''
          : isSpotlight
          ? 'w-full h-full max-h-full max-w-full aspect-video mx-auto'
          : isSmall
          ? 'w-full h-full aspect-video'
          : 'w-full h-full max-h-full max-w-full aspect-video mx-auto'
      }`}
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // CRITICAL: Local must be muted to avoid feedback loop
        className={`w-full h-full ${
          isScreenSharing ? 'object-contain bg-black' : 'object-cover'
        } transition-opacity duration-300 ${
          showAvatar ? 'opacity-0 absolute pointer-events-none' : 'opacity-100'
        } ${isLocal && !isScreenSharing ? 'scale-x-[-1]' : ''}`}
      />

      {/* Fallback Avatar Screen when camera is disabled */}
      {showAvatar && (
        <div className={`flex flex-col items-center justify-center select-none animate-fadeIn ${
          isSmall ? 'p-1 pb-3' : 'gap-3 p-4'
        }`}>
          <div className={`relative rounded-full p-0.5 bg-gradient-to-tr from-purple-600/50 to-indigo-500/50 border border-purple-500/40 shadow-lg shadow-purple-950/40 flex items-center justify-center ${
            isSmall ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-16 h-16 sm:w-20 sm:h-20'
          }`}>
            {avatarUri ? (
              <img src={avatarUri} alt={displayName} className="w-full h-full object-contain rounded-full" />
            ) : (
              <span className={`font-bold text-white ${isSmall ? 'text-xs' : 'text-xl sm:text-2xl'}`}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Only render text below avatar in normal/spotlight mode; NEVER in small thumbnails */}
          {!isSmall && (
            <span className="text-xs sm:text-sm font-semibold text-gray-200">{displayName}</span>
          )}
        </div>
      )}

      {/* Top badges: Screen Sharing tag or Click to Enlarge hint */}
      <div className={`absolute flex items-center gap-1.5 z-10 ${
        isSmall ? 'top-1.5 left-1.5' : 'top-2.5 left-2.5'
      }`}>
        {isScreenSharing && (
          <span className={`flex items-center gap-1 rounded-md bg-purple-600/90 backdrop-blur-md font-bold text-white shadow ${
            isSmall ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
          }`}>
            <svg className={isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Screen
          </span>
        )}

        {canEnlarge && !isSmall && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-purple-300 border border-purple-500/30 shadow">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Click to spotlight
          </span>
        )}
      </div>

      {/* Bottom Info Bar: Name & Mic status */}
      <div className={`absolute flex items-center justify-between pointer-events-none z-10 ${
        isSmall ? 'bottom-1.5 left-1.5 right-1.5' : 'bottom-2.5 left-2.5 right-2.5'
      }`}>
        <div className={`flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/10 text-white shadow max-w-[70%] truncate ${
          isSmall ? 'px-1.5 py-0.5 rounded text-[10px] font-medium' : 'px-2.5 py-1 rounded-lg text-[11px] font-medium'
        }`}>
          <span className="truncate">{displayName}</span>
        </div>

        <div
          className={`flex items-center justify-center backdrop-blur-md border ${
            isSmall ? 'w-5 h-5 rounded' : 'w-6 h-6 rounded-lg'
          } ${
            isAudioMuted
              ? 'bg-red-500/80 border-red-400/50 text-white'
              : 'bg-black/60 border-white/10 text-emerald-400'
          }`}
          title={isAudioMuted ? 'Muted' : 'Microphone Active'}
        >
          {isAudioMuted ? (
            <svg className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Draggable Floating PIP Tile
 * Can be dragged anywhere across the stage. Clicking triggers view swap.
 */
function DraggablePipTile({ children, onClick, title = 'Drag to reposition • Click to swap view' }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const initialPos = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  const handleMouseDown = (e) => {
    isDragging.current = true
    hasMoved.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    initialPos.current = { ...position }

    const handleMouseMove = (moveEvent) => {
      if (!isDragging.current) return
      const dx = moveEvent.clientX - dragStart.current.x
      const dy = moveEvent.clientY - dragStart.current.y
      if (Math.hypot(dx, dy) > 5) {
        hasMoved.current = true
      }
      setPosition({
        x: initialPos.current.x + dx,
        y: initialPos.current.y + dy
      })
    }

    const handleMouseUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    isDragging.current = true
    hasMoved.current = false
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    initialPos.current = { ...position }

    const handleTouchMove = (moveEvent) => {
      if (!isDragging.current) return
      const touchMove = moveEvent.touches[0]
      const dx = touchMove.clientX - dragStart.current.x
      const dy = touchMove.clientY - dragStart.current.y
      if (Math.hypot(dx, dy) > 5) {
        hasMoved.current = true
      }
      setPosition({
        x: initialPos.current.x + dx,
        y: initialPos.current.y + dy
      })
    }

    const handleTouchEnd = () => {
      isDragging.current = false
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }

    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
  }

  const handleClick = (e) => {
    if (!hasMoved.current && onClick) {
      onClick(e)
    }
  }

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className="absolute bottom-5 right-5 z-20 w-48 sm:w-60 aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/70 hover:border-purple-400 cursor-grab active:cursor-grabbing transition-all hover:shadow-purple-950/60 group animate-scaleUp"
      title={title}
    >
      {children}
      {/* Subtle Swap Hint on Hover */}
      {onClick && (
        <div className="absolute inset-0 bg-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5 border border-purple-500/40 shadow">
            <svg className="w-3.5 h-3.5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Click to Swap
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Main Board V-Chat Modal Component
 */
export default function BoardHuddleModal({
  isOpen,
  onClose,
  localStream,
  peers = [],
  activeParticipants = [],
  currentUser,
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  isHuddleActive,
  joinHuddle,
  leaveHuddle,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  connectionStatus
}) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  // 1-on-1 swap state: when true, local user is full screen and remote peer is draggable PIP
  const [isSwapped1on1, setIsSwapped1on1] = useState(false)

  // 4+ users spotlight/pinned state (pinnedUserId: 'local' | socketId | null)
  const [pinnedUserId, setPinnedUserId] = useState(null)

  // Auto-hiding controls after 2 seconds of mouse inactivity (Zoom/Meet standard)
  const [areControlsVisible, setAreControlsVisible] = useState(true)
  const hideControlsTimer = useRef(null)

  const resetControlsTimer = useCallback(() => {
    setAreControlsVisible(true)
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current)
    }
    hideControlsTimer.current = setTimeout(() => {
      // Only hide controls if in active call and leave modal is not showing
      if (isHuddleActive && !showLeaveConfirm) {
        setAreControlsVisible(false)
      }
    }, 2000)
  }, [isHuddleActive, showLeaveConfirm])

  useEffect(() => {
    resetControlsTimer()
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    }
  }, [resetControlsTimer])

  // Responsive stage measurement
  const stageRef = useRef(null)
  const [stageDimensions, setStageDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? Math.max(400, window.innerHeight - 200) : 700
  }))

  useLayoutEffect(() => {
    if (!stageRef.current) return

    const updateDimensions = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          setStageDimensions({
            width: Math.floor(rect.width),
            height: Math.floor(rect.height)
          })
        }
      }
    }

    updateDimensions()
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(stageRef.current)
    window.addEventListener('resize', updateDimensions)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [isFullScreen, isMinimized, isOpen, isHuddleActive])

  // Screen share priority check
  const spotlightPeer = peers.find((p) => p.isScreenSharing)
  const isLocalScreenSharing = isScreenSharing

  // Reset 1-on-1 swap if peers count changes
  useEffect(() => {
    if (peers.length !== 1) {
      setIsSwapped1on1(false)
    }
  }, [peers.length])

  // Reset pinned user if that peer disconnected
  useEffect(() => {
    if (pinnedUserId && pinnedUserId !== 'local' && pinnedUserId !== 'grid' && !peers.some((p) => p.socketId === pinnedUserId)) {
      setPinnedUserId(null)
    }
  }, [peers, pinnedUserId])

  if (!isOpen) return null

  // -------------------------------------------------------------
  // 1. MINIMIZED FLOATING PILL (Allows full board interaction)
  // -------------------------------------------------------------
  if (isMinimized) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#14141C]/90 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-950/50 text-white animate-slideUp select-none">
          {/* Live Call Indicator */}
          <div className="flex items-center gap-2 pr-2 border-r border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wide text-purple-200">
              V-Chat ({peers.length + 1})
            </span>
          </div>

          {/* Mic Control */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer bg-transparent ${
              isAudioMuted
                ? 'border-red-500/80 text-red-300 hover:bg-red-500/20'
                : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
            }`}
            title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isAudioMuted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          {/* Camera Control */}
          <button
            onClick={toggleVideo}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer bg-transparent ${
              isVideoOff
                ? 'border-red-500/80 text-red-300 hover:bg-red-500/20'
                : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Expand button */}
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all cursor-pointer font-bold text-xs"
            title="Expand V-Chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Leave button (triggers confirm) */}
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="p-2 rounded-xl bg-transparent border-2 border-red-500/80 text-red-300 hover:bg-red-500/20 hover:text-white transition-all cursor-pointer"
            title="Leave V-Chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>
        </div>

        {/* Leave Confirmation Modal (from minimized pill) */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
            <div className="bg-[#151520] border border-[#35354D] rounded-3xl w-full max-w-sm p-6 shadow-2xl text-white flex flex-col items-center text-center animate-scaleUp">
              <div className="w-14 h-14 rounded-2xl bg-transparent border-2 border-red-500/60 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-950/30">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">Leave V-Chat?</h4>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to leave this video call? You can rejoin anytime from the board.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-transparent border border-white/20 text-gray-300 hover:border-white/40 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLeaveConfirm(false)
                    leaveHuddle()
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-transparent border-2 border-red-500 text-red-300 hover:bg-red-500/20 hover:text-white font-bold text-xs transition-all shadow-lg shadow-red-900/40 cursor-pointer"
                >
                  Leave Call
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Determine modal container sizing
  const containerClasses = isFullScreen
    ? 'fixed inset-0 z-50 w-screen h-screen bg-[#0E0E14] flex flex-col overflow-hidden text-white'
    : 'bg-[#12121A] border border-[#2B2B3D] rounded-3xl w-full max-w-5xl h-[88vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden text-white relative'

  // Stage dimensions from stageRef
  const stageW = stageDimensions.width || 1200
  const stageH = stageDimensions.height || 700

  // Symmetrical padding reserved around the stage (8-10px each side) to keep margins equal and maximize webcam screen sizes
  const stagePadX = 16
  const stagePadY = 24
  const netGridW = Math.max(200, stageW - stagePadX)
  const netGridH = Math.max(150, stageH - stagePadY)

  // 1. Full Screen 1-on-1 Sizing (Max possible standard 16:9 fitting stage with balanced margin)
  const soloMax = calculateOptimalGrid(Math.max(200, stageW - 16), Math.max(150, stageH - 16), 1, 0)

  // 2. Sidecar Sizing: Spotlight on Left, Vertical Strip on Right
  // Sidebar takes approx 200px - 260px depending on screen width
  const sidebarWidth = Math.min(260, Math.max(190, Math.floor(stageW * 0.22)))
  const spotlightMainW = Math.max(200, stageW - sidebarWidth - 24)
  const spotlightMainH = Math.max(150, stageH - 24)
  const sidecarSpotlightMax = calculateOptimalGrid(spotlightMainW, spotlightMainH, 1, 0)

  // Sidebar thumbnail width and height (standard 16:9)
  const sidebarThumbW = sidebarWidth - 16
  const sidebarThumbH = Math.floor(sidebarThumbW * 9 / 16)

  // 3. Grid Mode Sizing (4+ users equal grid with guaranteed symmetrical margins and larger tiles)
  const gridMax = calculateOptimalGrid(netGridW, netGridH, peers.length + 1, 10)

  // 4. 3-User Split Mode (2 joinees side by side with guaranteed symmetrical margins and larger tiles)
  const splitMax = calculateOptimalGrid(netGridW, netGridH, 2, 10)

  // Determine spotlight peer / screen share
  const isGridForced = pinnedUserId === 'grid'
  const hasActiveSpotlight = !isGridForced && Boolean((pinnedUserId && pinnedUserId !== 'grid') || spotlightPeer || isLocalScreenSharing)
  const activeSpotlightTarget = (pinnedUserId && pinnedUserId !== 'grid') ? pinnedUserId : (spotlightPeer ? spotlightPeer.socketId : isLocalScreenSharing ? 'local' : null)

  // -------------------------------------------------------------
  // 2. MAIN MODAL (Standard or Fullscreen)
  // -------------------------------------------------------------
  return (
    <div
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      onClick={resetControlsTimer}
      className={
        isFullScreen
          ? 'fixed inset-0 z-50'
          : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none'
      }
    >
      <div className={containerClasses}>
        {/* Sleek, Thinned Top Navbar (Auto-hiding on 2s inactivity) */}
        <div
          onMouseEnter={() => {
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
            setAreControlsVisible(true)
          }}
          onMouseLeave={resetControlsTimer}
          className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2 bg-[#12121A]/85 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
            areControlsVisible || !isHuddleActive
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
        >
          {/* Top-Left: Title & Live Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="text-xs font-bold text-white tracking-wide">V-Chat</span>
            <span className="text-[10px] text-gray-400 border-l border-white/10 pl-2">
              {isHuddleActive ? `${peers.length + 1} in call` : 'Encrypted P2P'}
            </span>
          </div>

          {/* Top-Right: Grid View Button & Window Controls (Minimize, Maximize, Close) */}
          <div className="flex items-center gap-1.5">
            {/* Grid View button on top-right: shown when in spotlight view with 2+ peers */}
            {hasActiveSpotlight && peers.length >= 2 && (
              <button
                onClick={() => setPinnedUserId('grid')}
                className="px-2.5 py-1 rounded-lg bg-transparent border border-purple-500/60 hover:border-purple-400 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer mr-1 shadow-sm hover:bg-purple-500/10"
                title="Switch to equal Grid View"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Grid View</span>
              </button>
            )}

            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-transparent text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Minimize V-Chat to floating pill"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
              </svg>
            </button>

            {/* Maximize / Fullscreen Button */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg bg-transparent text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={isFullScreen ? 'Restore Normal Window' : 'Maximize Full Screen'}
            >
              {isFullScreen ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-transparent text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Hide window (call remains active in background)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Stage (Occupies 100% of Modal for Maximum Aspect Ratio) */}
        <div
          ref={stageRef}
          className="relative w-full h-full min-h-0 min-w-0 flex items-center justify-center overflow-hidden"
        >
          {!isHuddleActive ? (
            // Pre-join Lobby State
            <div className="flex flex-col items-center justify-center gap-4 text-center my-auto max-w-md mx-auto p-4 select-none">
              <div className="w-20 h-20 rounded-full bg-transparent border-2 border-purple-500/60 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-950/50 animate-pulse">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              {activeParticipants.length > 0 ? (
                <>
                  <h3 className="text-lg font-bold text-white">V-Chat in Progress</h3>
                  <div className="flex items-center justify-center -space-x-2 py-1">
                    {activeParticipants.map((p) => (
                      <img
                        key={p.socketId}
                        src={getDiceBearAvatar(p.user?.avatar || p.user?.username || 'User')}
                        alt={p.user?.name || 'User'}
                        className="w-10 h-10 rounded-full border-2 border-[#12121A] bg-zinc-800 object-contain shadow"
                        title={p.user?.name || 'Member'}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold text-purple-300">
                      {activeParticipants.map((p) => p.user?.name || 'Member').join(', ')}
                    </span>{' '}
                    {activeParticipants.length === 1 ? 'is' : 'are'} currently on this call.
                  </p>
                  <button
                    onClick={joinHuddle}
                    disabled={connectionStatus === 'connecting'}
                    className="mt-3 px-8 py-2.5 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-bold text-xs transition-all shadow-lg shadow-purple-900/30 cursor-pointer disabled:opacity-50"
                  >
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Join V-Chat'}
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white">Start V-Chat</h3>
                  <p className="text-xs text-gray-400">
                    Anyone from this board can join.
                  </p>
                  <button
                    onClick={joinHuddle}
                    disabled={connectionStatus === 'connecting'}
                    className="mt-3 px-8 py-2.5 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-bold text-xs transition-all shadow-lg shadow-purple-900/30 cursor-pointer disabled:opacity-50"
                  >
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Start V-Chat'}
                  </button>
                </>
              )}
            </div>
          ) : peers.length === 1 ? (
            // -------------------------------------------------------------
            // A. EXACTLY 2 USERS (Joinee Screen FULL with Max Aspect Ratio + Mine in Corner PIP)
            // -------------------------------------------------------------
            <div className="relative w-full h-full min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
              {/* Joinee Full Stage Screen (Max Possible 16:9 Aspect Ratio) */}
              <div className="flex items-center justify-center w-full h-full">
                {!isSwapped1on1 ? (
                  // Remote peer has the main full stage
                  <VideoTile
                    stream={peers[0].stream}
                    isLocal={false}
                    user={peers[0].user}
                    isAudioMuted={peers[0].isAudioMuted}
                    isVideoOff={peers[0].isVideoOff}
                    isScreenSharing={peers[0].isScreenSharing}
                    isSpotlight={true}
                    style={{
                      width: `${soloMax.tileWidth}px`,
                      height: `${soloMax.tileHeight}px`,
                      margin: 'auto'
                    }}
                  />
                ) : (
                  // Local user has the main full stage
                  <VideoTile
                    stream={localStream}
                    isLocal={true}
                    user={currentUser}
                    isAudioMuted={isAudioMuted}
                    isVideoOff={isVideoOff}
                    isScreenSharing={isScreenSharing}
                    isSpotlight={true}
                    style={{
                      width: `${soloMax.tileWidth}px`,
                      height: `${soloMax.tileHeight}px`,
                      margin: 'auto'
                    }}
                  />
                )}
              </div>

              {/* Local user draggable PIP tile in the corner ("mine screen in corner") */}
              <DraggablePipTile onClick={() => setIsSwapped1on1(!isSwapped1on1)}>
                {!isSwapped1on1 ? (
                  <VideoTile
                    stream={localStream}
                    isLocal={true}
                    user={currentUser}
                    isAudioMuted={isAudioMuted}
                    isVideoOff={isVideoOff}
                    isScreenSharing={isScreenSharing}
                    isSmall={true}
                  />
                ) : (
                  <VideoTile
                    stream={peers[0].stream}
                    isLocal={false}
                    user={peers[0].user}
                    isAudioMuted={peers[0].isAudioMuted}
                    isVideoOff={peers[0].isVideoOff}
                    isScreenSharing={peers[0].isScreenSharing}
                    isSmall={true}
                  />
                )}
              </DraggablePipTile>
            </div>
          ) : (peers.length >= 3 && hasActiveSpotlight) || (peers.length === 2 && hasActiveSpotlight) ? (
            // -------------------------------------------------------------
            // B. SPOTLIGHT VIEW: Speaker on Left (Max 16:9), Other Members on Right (Top to Bottom)
            // -------------------------------------------------------------
            <div className="relative w-full h-full min-h-0 min-w-0 flex items-center justify-between overflow-hidden p-2">
              {/* LEFT SIDE: Big Screen with Maximum Possible Aspect Ratio */}
              <div className="flex-1 h-full min-h-0 min-w-0 flex items-center justify-center p-2">
                {activeSpotlightTarget === 'local' ? (
                  <VideoTile
                    stream={localStream}
                    isLocal={true}
                    user={currentUser}
                    isAudioMuted={isAudioMuted}
                    isVideoOff={isVideoOff}
                    isScreenSharing={isScreenSharing}
                    isSpotlight={true}
                    onClick={() => setPinnedUserId(null)}
                    style={{
                      width: `${sidecarSpotlightMax.tileWidth}px`,
                      height: `${sidecarSpotlightMax.tileHeight}px`
                    }}
                  />
                ) : (() => {
                  const targetPeer = peers.find((p) => p.socketId === activeSpotlightTarget) || peers[0]
                  if (!targetPeer) return null
                  return (
                    <VideoTile
                      stream={targetPeer.stream}
                      isLocal={false}
                      user={targetPeer.user}
                      isAudioMuted={targetPeer.isAudioMuted}
                      isVideoOff={targetPeer.isVideoOff}
                      isScreenSharing={targetPeer.isScreenSharing}
                      isSpotlight={true}
                      onClick={() => setPinnedUserId(null)}
                      style={{
                        width: `${sidecarSpotlightMax.tileWidth}px`,
                        height: `${sidecarSpotlightMax.tileHeight}px`
                      }}
                    />
                  )
                })()}
              </div>

              {/* RIGHT SIDE: Vertical Column with other members stacked Top to Bottom */}
              <div
                style={{ width: `${sidebarWidth}px` }}
                className="h-full flex flex-col items-center justify-center gap-3 overflow-y-auto px-1.5 py-2 shrink-0 select-none z-10"
              >
                {/* Local user in sidebar if not spotlighted */}
                {activeSpotlightTarget !== 'local' && (
                  <div
                    style={{ width: `${sidebarThumbW}px`, height: `${sidebarThumbH}px` }}
                    className="shrink-0 flex items-center justify-center"
                  >
                    <VideoTile
                      stream={localStream}
                      isLocal={true}
                      user={currentUser}
                      isAudioMuted={isAudioMuted}
                      isVideoOff={isVideoOff}
                      isScreenSharing={isScreenSharing}
                      isSmall={true}
                      onClick={() => setPinnedUserId('local')}
                      canEnlarge={true}
                    />
                  </div>
                )}

                {/* Other peers in sidebar */}
                {peers.map((peer) => {
                  if (peer.socketId === activeSpotlightTarget) return null
                  return (
                    <div
                      key={peer.socketId}
                      style={{ width: `${sidebarThumbW}px`, height: `${sidebarThumbH}px` }}
                      className="shrink-0 flex items-center justify-center"
                    >
                      <VideoTile
                        stream={peer.stream}
                        isLocal={false}
                        user={peer.user}
                        isAudioMuted={peer.isAudioMuted}
                        isVideoOff={peer.isVideoOff}
                        isScreenSharing={peer.isScreenSharing}
                        isSmall={true}
                        onClick={() => setPinnedUserId(peer.socketId)}
                        canEnlarge={true}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : peers.length === 2 ? (
            // -------------------------------------------------------------
            // C. EXACTLY 3 USERS (Two Joinees Split Screen + Draggable Local PIP)
            // -------------------------------------------------------------
            <div className="relative w-full h-full min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
              <div
                style={{
                  width: `${splitMax.gridWidth}px`,
                  height: `${splitMax.gridHeight}px`,
                  gridTemplateColumns: `repeat(${splitMax.cols}, ${splitMax.tileWidth}px)`,
                  gridTemplateRows: `repeat(${splitMax.rows}, ${splitMax.tileHeight}px)`,
                  gap: '10px',
                  margin: 'auto'
                }}
                className="grid items-center justify-center transition-all duration-200"
              >
                <VideoTile
                  stream={peers[0].stream}
                  isLocal={false}
                  user={peers[0].user}
                  isAudioMuted={peers[0].isAudioMuted}
                  isVideoOff={peers[0].isVideoOff}
                  isScreenSharing={peers[0].isScreenSharing}
                  onClick={() => setPinnedUserId(peers[0].socketId)}
                  canEnlarge={true}
                  style={{
                    width: `${splitMax.tileWidth}px`,
                    height: `${splitMax.tileHeight}px`
                  }}
                />
                <VideoTile
                  stream={peers[1].stream}
                  isLocal={false}
                  user={peers[1].user}
                  isAudioMuted={peers[1].isAudioMuted}
                  isVideoOff={peers[1].isVideoOff}
                  isScreenSharing={peers[1].isScreenSharing}
                  onClick={() => setPinnedUserId(peers[1].socketId)}
                  canEnlarge={true}
                  style={{
                    width: `${splitMax.tileWidth}px`,
                    height: `${splitMax.tileHeight}px`
                  }}
                />
              </div>

              {/* Local user has the small draggable PIP in the corner */}
              <DraggablePipTile title="Your Camera • Drag to reposition">
                <VideoTile
                  stream={localStream}
                  isLocal={true}
                  user={currentUser}
                  isAudioMuted={isAudioMuted}
                  isVideoOff={isVideoOff}
                  isSmall={true}
                />
              </DraggablePipTile>
            </div>
          ) : (
            // -------------------------------------------------------------
            // D. 4 OR MORE USERS: Equal 2x2 Grid View (Standard 16:9, Perfectly Symmetrical Margins)
            // -------------------------------------------------------------
            <div className="w-full h-full min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
              <div
                style={{
                  width: `${gridMax.gridWidth}px`,
                  height: `${gridMax.gridHeight}px`,
                  gridTemplateColumns: `repeat(${gridMax.cols}, ${gridMax.tileWidth}px)`,
                  gridTemplateRows: `repeat(${gridMax.rows}, ${gridMax.tileHeight}px)`,
                  gap: '10px',
                  margin: 'auto'
                }}
                className="grid items-center justify-center transition-all duration-200"
              >
                {/* Local User */}
                <VideoTile
                  key="local"
                  stream={localStream}
                  isLocal={true}
                  user={currentUser}
                  isAudioMuted={isAudioMuted}
                  isVideoOff={isVideoOff}
                  isScreenSharing={isScreenSharing}
                  onClick={() => setPinnedUserId('local')}
                  canEnlarge={true}
                  style={{
                    width: `${gridMax.tileWidth}px`,
                    height: `${gridMax.tileHeight}px`
                  }}
                />

                {/* Remote Peers */}
                {peers.map((peer) => (
                  <VideoTile
                    key={peer.socketId}
                    stream={peer.stream}
                    isLocal={false}
                    user={peer.user}
                    isAudioMuted={peer.isAudioMuted}
                    isVideoOff={peer.isVideoOff}
                    isScreenSharing={peer.isScreenSharing}
                    onClick={() => setPinnedUserId(peer.socketId)}
                    canEnlarge={true}
                    style={{
                      width: `${gridMax.tileWidth}px`,
                      height: `${gridMax.tileHeight}px`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sleek Floating Bottom Controls Bar (Auto-hiding on 3s inactivity) */}
        {isHuddleActive && (
          <div
            onMouseEnter={() => {
              if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
              setAreControlsVisible(true)
            }}
            onMouseLeave={resetControlsTimer}
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-2 rounded-2xl bg-[#14141E]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-950/60 transition-all duration-300 select-none ${
              areControlsVisible
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {/* Mic Button */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all font-semibold text-xs cursor-pointer bg-transparent ${
                isAudioMuted
                  ? 'border-red-500 text-red-300 hover:bg-red-500/20'
                  : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
              }`}
              title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isAudioMuted ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Mute</span>
                </>
              )}
            </button>

            {/* Camera Button */}
            <button
              onClick={toggleVideo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all font-semibold text-xs cursor-pointer bg-transparent ${
                isVideoOff
                  ? 'border-red-500 text-red-300 hover:bg-red-500/20'
                  : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                  </svg>
                  <span>Start Video</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Stop Video</span>
                </>
              )}
            </button>

            {/* Screen Share Button */}
            <button
              onClick={toggleScreenShare}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all font-semibold text-xs cursor-pointer bg-transparent ${
                isScreenSharing
                  ? 'border-purple-400 text-purple-200 shadow-md shadow-purple-900/40 hover:bg-purple-500/20'
                  : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
              }`}
              title={isScreenSharing ? 'Stop Sharing Screen' : 'Share Screen'}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
            </button>

            {/* Leave Button */}
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-transparent border-2 border-red-500 text-red-300 hover:bg-red-500/20 hover:text-white transition-all font-semibold text-xs cursor-pointer"
              title="Leave Call"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              <span>Leave</span>
            </button>
          </div>
        )}
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
          <div className="bg-[#151520] border border-[#35354D] rounded-3xl w-full max-w-sm p-6 shadow-2xl text-white flex flex-col items-center text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-transparent border-2 border-red-500/60 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-950/30">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Leave V-Chat?</h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to leave this video call? You can rejoin anytime from the board.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-transparent border border-white/20 text-gray-300 hover:border-white/40 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false)
                  leaveHuddle()
                }}
                className="flex-1 py-2.5 rounded-xl bg-transparent border-2 border-red-500 text-red-300 hover:bg-red-500/20 hover:text-white font-bold text-xs transition-all shadow-lg shadow-red-900/40 cursor-pointer"
              >
                Leave Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
