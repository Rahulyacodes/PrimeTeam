import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { StatusBarsLogo } from '../components/common/StatusBarsLogo'

function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 🔄 4-Step Drag & Drop Animation Sequence:
  // Step 0: "Landing page copy" drags from Review -> Done & drops in Done
  // Step 1: "Write API docs" drags from In Progress -> Review & drops in Review
  // Step 2: "Write API docs" drags BACK from Review -> In Progress & drops in In Progress
  // Step 3: "Landing page copy" drags BACK from Done -> Review & drops in Review
  const [step, setStep] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [isFlying, setIsFlying] = useState(false)

  // V-Chat & Board Chat Showcase state
  const [micMuted, setMicMuted] = useState(false)
  const [camOff, setCamOff] = useState(false)
  const [activeCodeFile, setActiveCodeFile] = useState(0)
  const codeScrollRef = useRef(null)

  // Auto file cycling & slow scrolling:
  // 1st file scrolls slowly to the last line, pauses, then 2nd file scrolls to end, then 3rd file, and repeats
  useEffect(() => {
    let animFrame = null
    let switchTimer = null

    // Reset scroll to top upon file switch
    if (codeScrollRef.current) {
      codeScrollRef.current.scrollTop = 0
    }

    // Pause 1.2s at top so initial code can be read, then scroll slowly to end
    const scrollStartTimer = setTimeout(() => {
      if (!codeScrollRef.current) return
      const container = codeScrollRef.current
      const maxScroll = container.scrollHeight - container.clientHeight
      if (maxScroll <= 0) return

      const scrollDuration = 4800 // 4.8 seconds smooth slow downward scroll to bottom
      const startTime = performance.now()
      const startScrollTop = container.scrollTop

      const stepScroll = (timestamp) => {
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / scrollDuration, 1)
        container.scrollTop = startScrollTop + maxScroll * progress

        if (progress < 1) {
          animFrame = requestAnimationFrame(stepScroll)
        }
      }

      animFrame = requestAnimationFrame(stepScroll)
    }, 1200)

    // Switch to next file after reading and scrolling: 1.2s pause + 4.8s scroll + 2.2s pause at bottom = 8.2s
    switchTimer = setTimeout(() => {
      setActiveCodeFile((prev) => (prev + 1) % 3)
    }, 8200)

    return () => {
      clearTimeout(scrollStartTimer)
      clearTimeout(switchTimer)
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  }, [activeCodeFile])

  // Auto Chat typing & multi-message ongoing sequence:
  // Dynamically types and replies across 5-6 messages so the conversation visibly keeps going
  const [chatMessages, setChatMessages] = useState([])
  const [chatTypedText, setChatTypedText] = useState('')
  const [isSendActive, setIsSendActive] = useState(false)
  const chatScrollRef = useRef(null)

  // Auto-scroll chat feed to bottom as new messages arrive (ONLY inside chat box, never scrolling window)
  useEffect(() => {
    if (!chatScrollRef.current) return

    if (chatMessages.length === 0) {
      chatScrollRef.current.scrollTop = 0
      return
    }

    const container = chatScrollRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
  }, [chatMessages])

  useEffect(() => {
    const MSG_1 = "Verified the mutex TTL lock on Redis. Zero double charges! 🚀"
    const MSG_2 = "Also configured DB pool timeout to 5000ms for connection failovers 👍"
    const MSG_3 = "Clean! Ready for staging deployment then? 👀"

    const SENT_1 = {
      id: 'sent-1',
      sender: 'Rahulya (You)',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      text: MSG_1,
      isMe: true,
      badge: '🚀 2'
    }

    const REPLY_1 = {
      id: 'reply-1',
      sender: 'Joey Tribbiani',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Awesome! Moving the QA ticket to Done on the board! 💯',
      isMe: false
    }

    const SENT_2 = {
      id: 'sent-2',
      sender: 'Rahulya (You)',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      text: MSG_2,
      isMe: true,
      badge: '⚡ 1'
    }

    const REPLY_2 = {
      id: 'reply-2',
      sender: 'Sarah Lin',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Just ran the load test. Handled 2,500 req/s with zero dropped connections! ⚡',
      isMe: false,
      badge: '🙌 3'
    }

    const SENT_3 = {
      id: 'sent-3',
      sender: 'Rahulya (You)',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      text: MSG_3,
      isMe: true
    }

    const REPLY_3 = {
      id: 'reply-3',
      sender: 'Joey Tribbiani',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Deploy pipeline triggered. Great sprint work everyone! 🚀🎉',
      isMe: false
    }

    let elapsed = 0
    const interval = setInterval(() => {
      elapsed += 100
      if (elapsed > 35000) {
        elapsed = 0
      }

      // 0 - 1.0s: Reset baseline
      if (elapsed < 1000) {
        setChatMessages([])
        setChatTypedText('')
        setIsSendActive(false)
      }
      // 1.0s - 5.2s: Typing Message 1 slowly (~100ms per char)
      else if (elapsed < 5200) {
        const progress = (elapsed - 1000) / 4200
        const charCount = Math.min(MSG_1.length, Math.floor(progress * MSG_1.length))
        setChatTypedText(MSG_1.slice(0, charCount))
        setIsSendActive(false)
        setChatMessages([])
      }
      // 5.2s - 5.6s: Trigger Send Button click
      else if (elapsed < 5600) {
        setChatTypedText(MSG_1)
        setIsSendActive(true)
        setChatMessages([])
      }
      // 5.6s - 7.6s (2.0s delay): Sent on right!
      else if (elapsed < 7600) {
        setChatTypedText('')
        setIsSendActive(false)
        setChatMessages([SENT_1])
      }
      // 7.6s - 9.0s: Joey's reply appears (exactly 2s after msg 1)
      else if (elapsed < 9000) {
        setChatTypedText('')
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1])
      }
      // 9.0s - 13.5s: Typing Message 2 slowly
      else if (elapsed < 13500) {
        const progress = (elapsed - 9000) / 4500
        const charCount = Math.min(MSG_2.length, Math.floor(progress * MSG_2.length))
        setChatTypedText(MSG_2.slice(0, charCount))
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1])
      }
      // 13.5s - 14.0s: Trigger Send Button click
      else if (elapsed < 14000) {
        setChatTypedText(MSG_2)
        setIsSendActive(true)
        setChatMessages([SENT_1, REPLY_1])
      }
      // 14.0s - 16.0s (2.0s delay): Sent on right!
      else if (elapsed < 16000) {
        setChatTypedText('')
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1, SENT_2])
      }
      // 16.0s - 17.5s: Sarah's reply appears (exactly 2s after msg 2)
      else if (elapsed < 17500) {
        setChatTypedText('')
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1, SENT_2, REPLY_2])
      }
      // 17.5s - 21.0s: Typing Message 3 slowly
      else if (elapsed < 21000) {
        const progress = (elapsed - 17500) / 3500
        const charCount = Math.min(MSG_3.length, Math.floor(progress * MSG_3.length))
        setChatTypedText(MSG_3.slice(0, charCount))
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1, SENT_2, REPLY_2])
      }
      // 21.0s - 21.5s: Trigger Send Button click
      else if (elapsed < 21500) {
        setChatTypedText(MSG_3)
        setIsSendActive(true)
        setChatMessages([SENT_1, REPLY_1, SENT_2, REPLY_2])
      }
      // 21.5s - 23.5s (2.0s delay): Sent on right!
      else if (elapsed < 23500) {
        setChatTypedText('')
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1, SENT_2, REPLY_2, SENT_3])
      }
      // 23.5s - 35.0s: Joey's reply appears (exactly 2s after msg 3), and all 6 messages remain active!
      else {
        setChatTypedText('')
        setIsSendActive(false)
        setChatMessages([SENT_1, REPLY_1, SENT_2, REPLY_2, SENT_3, REPLY_3])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])



  useEffect(() => {
    // 1. Mount overlay at origin position
    setIsMoving(true)
    setIsFlying(false)

    // 2. Trigger physical smooth flight to target position
    const flyTimer = setTimeout(() => {
      setIsFlying(true)
    }, 60)

    // 3. Complete physical flight, unmount overlay & place card in list
    const landTimer = setTimeout(() => {
      setIsMoving(false)
      setIsFlying(false)
    }, 1250)

    // 4. Rest in placed list state, then advance step
    const stepTimer = setTimeout(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 3300)

    return () => {
      clearTimeout(flyTimer)
      clearTimeout(landTimer)
      clearTimeout(stepTimer)
    }
  }, [step])

  // Placed card state logic (when card is resting in destination list)
  const isLandingCopyPlacedInDone = (step === 0 && !isMoving) || step === 1 || step === 2
  const isApiDocsPlacedInReview = (step === 1 && !isMoving) || (step === 2 && isMoving)

  // Floating Overlay Helper Configs
  const getOverlayConfig = () => {
    switch (step) {
      case 0: // Landing page copy: Review (Col 3) -> Done (Col 4)
        return {
          title: 'Landing page copy',
          startLeft: '476px',
          startTop: '68px',
          deltaX: isFlying ? 226 : 0,
          deltaY: isFlying ? 0 : 0,
          badgeText: 'Low',
          badgeStyle: 'bg-[#7C6FF7]/15 text-[#7C6FF7] border border-[#7C6FF7]/30'
        }
      case 1: // Write API docs: In Progress (Col 2) -> Review (Col 3)
        return {
          title: 'Write API docs',
          startLeft: '250px',
          startTop: '136px',
          deltaX: isFlying ? 226 : 0,
          deltaY: isFlying ? -68 : 0,
          badgeText: 'Medium',
          badgeStyle: 'bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30'
        }
      case 2: // Write API docs: Review (Col 3) -> In Progress (Col 2)
        return {
          title: 'Write API docs',
          startLeft: '476px',
          startTop: '68px',
          deltaX: isFlying ? -226 : 0,
          deltaY: isFlying ? 68 : 0,
          badgeText: 'Medium',
          badgeStyle: 'bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30'
        }
      case 3: // Landing page copy: Done (Col 4) -> Review (Col 3)
        return {
          title: 'Landing page copy',
          startLeft: '702px',
          startTop: '68px',
          deltaX: isFlying ? -226 : 0,
          deltaY: isFlying ? 0 : 0,
          badgeText: 'Done',
          badgeStyle: 'bg-[#69DB7C]/15 text-[#69DB7C] border border-[#69DB7C]/30 font-semibold'
        }
      default:
        return {}
    }
  }

  const overlayConfig = getOverlayConfig()

  return (
    <div className="min-h-screen bg-[#09090D] text-white flex flex-col font-sans selection:bg-[#7C6FF7]/30 selection:text-purple-200 relative overflow-x-clip">

      {/* Left and right side purple gradients at 30% */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 65% at 0% 35%, rgba(124, 111, 247, 0.30), transparent 70%),
            radial-gradient(ellipse 55% 65% at 100% 45%, rgba(124, 111, 247, 0.30), transparent 70%)
          `
        }}
      />

      {/* 2. Transparent Top Navigation */}
      <nav className="w-full bg-transparent relative z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 sm:px-10 py-6">
          <Link to="/" className="text-lg font-semibold text-[#7C6FF7] tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2.5">
            <StatusBarsLogo size={30} />
            <span className="text-white font-bold tracking-tight text-xl">PrimeTeam</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <button
                onClick={() => navigate('/')}
                className="text-xs sm:text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Go to Dashboard</span>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-[#8B8B9E] hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 px-5 py-2.5 rounded-lg transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 3. Left-Aligned Hero Section */}
      <main className="flex-1 flex flex-col items-center relative z-10">
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-10 pt-16 pb-12 text-left">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-[-0.03em] text-white mb-6 text-left">
            It's just a board.<br />
            <span className="text-[#7C6FF7]">A really good one.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8B8B9E] leading-[1.7] max-w-xl mb-10 text-left">
            A minimal workspace for teams who'd rather ship than configure.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
            <Link
              to={user ? '/' : '/register'}
              className="inline-flex items-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 hover:border-white/35 px-6.5 py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all cursor-pointer backdrop-blur-sm shadow-sm"
            >
              <span>{user ? 'Open Dashboard' : 'Start building.'}</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <div className="text-xs text-[#8B8B9E] leading-tight">
              <span className="block font-medium text-gray-300">Free Forever.</span>
              <span>Save money.</span>
            </div>
          </div>
        </section>

        {/* 4. Product Board Preview Mockup with Visible Physical Drag & Drop */}
        <section className="w-full max-w-5xl px-6 sm:px-10 mb-8">
          <div className="rounded-2xl bg-[#1C1C24]/90 border border-[#2A2A35] overflow-hidden shadow-2xl backdrop-blur-md">

            {/* Window Bar */}
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[#2A2A35] bg-[#171720]">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
              <div className="w-3 h-3 rounded-full bg-[#FFA500]" />
              <div className="w-3 h-3 rounded-full bg-[#69DB7C]" />
              <span className="text-xs text-[#8B8B9E] font-medium ml-2">Product launch · 3 members</span>
            </div>

            {/* Board Mockup Content */}
            <div className="flex gap-4 p-6 overflow-x-auto select-none scrollbar-thin relative min-h-[340px]">

              {/* 🖐️ Floating Physical Drag Overlay Card with Cursor */}
              {isMoving && (
                <div
                  className="absolute z-50 pointer-events-none transition-all duration-[1150ms] ease-in-out w-[210px] bg-[#1C1C24] rounded-lg p-3 border border-[#7C6FF7] shadow-2xl shadow-[#7C6FF7]/40 scale-[1.05] rotate-2 ring-1 ring-[#7C6FF7]/60"
                  style={{
                    left: overlayConfig.startLeft,
                    top: overlayConfig.startTop,
                    transform: `translate3d(${overlayConfig.deltaX}px, ${overlayConfig.deltaY}px, 0)`
                  }}
                >
                  <div className="absolute -top-3 -right-3 z-50 bg-[#7C6FF7] p-1.5 rounded-full shadow-xl text-white">
                    <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.078 2.498a.75.75 0 011.007-.384l16.5 7.5a.75.75 0 010 1.372l-6.5 2.955-2.955 6.5a.75.75 0 01-1.372 0l-7.5-16.5a.75.75 0 01.82-1.943z" />
                    </svg>
                  </div>
                  <div className="text-xs text-white font-medium flex items-center justify-between">
                    <span>{overlayConfig.title}</span>
                  </div>
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mt-2 ${overlayConfig.badgeStyle}`}>
                    {overlayConfig.badgeText}
                  </span>
                </div>
              )}

              {/* Col 1: Backlog */}
              <div className="bg-[#0F0F13] rounded-xl p-3.5 w-[210px] shrink-0 border border-[#2A2A35] flex flex-col gap-2.5">
                <div className="text-xs font-medium text-[#8B8B9E] flex items-center justify-between">
                  <span>Backlog</span>
                  <span className="text-[#3A3A4D] font-mono text-[11px]">2</span>
                </div>

                <div className="bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] space-y-2">
                  <div className="text-xs text-white font-medium">Research competitors</div>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#7C6FF7]/15 text-[#7C6FF7] border border-[#7C6FF7]/30 font-medium">
                    Low
                  </span>
                </div>

                <div className="bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] space-y-2">
                  <div className="text-xs text-white font-medium">Set up design system</div>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 font-medium">
                    Medium
                  </span>
                  <div className="text-[10px] text-[#8B8B9E] pt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3 text-[#8B8B9E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                    </svg>
                    <span>Aug 20</span>
                  </div>
                </div>

                <div className="text-xs text-[#8B8B9E] py-2 border border-dashed border-[#2A2A35] rounded-lg text-center cursor-pointer hover:border-gray-500 hover:text-white transition-all">
                  + Add card
                </div>
              </div>

              {/* Col 2: In progress */}
              <div className="bg-[#0F0F13] rounded-xl p-3.5 w-[210px] shrink-0 border border-[#2A2A35] flex flex-col gap-2.5">
                <div className="text-xs font-medium text-[#8B8B9E] flex items-center justify-between">
                  <span>In progress</span>
                  <span className="text-[#3A3A4D] font-mono text-[11px]">
                    {isApiDocsPlacedInReview ? 1 : 2}
                  </span>
                </div>

                {/* Overdue Card */}
                <div className="bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] space-y-2">
                  <div className="text-xs text-white font-medium">Build auth flow</div>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30 font-medium">
                    High
                  </span>
                  <div className="text-[10px] text-[#FF6B6B] font-semibold pt-0.5 flex items-center gap-1.5 animate-pulse">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B6B] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B6B]"></span>
                    </span>
                    <svg className="w-3 h-3 text-[#FF6B6B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                    </svg>
                    <span>Aug 12 · Overdue</span>
                  </div>
                </div>

                {/* Card B: "Write API docs" placed in In Progress list */}
                {!isApiDocsPlacedInReview && (
                  <div className={`bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] space-y-2 transition-all ${step === 1 && isMoving ? 'opacity-30 border-dashed border-[#7C6FF7]' : 'opacity-100'
                    }`}>
                    <div className="text-xs text-white font-medium">Write API docs</div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 font-medium">
                      Medium
                    </span>
                  </div>
                )}

                <div className="text-xs text-[#8B8B9E] py-2 border border-dashed border-[#2A2A35] rounded-lg text-center cursor-pointer hover:border-gray-500 hover:text-white transition-all">
                  + Add card
                </div>
              </div>

              {/* Col 3: Review */}
              <div className="bg-[#0F0F13] rounded-xl p-3.5 w-[210px] shrink-0 border border-[#2A2A35] flex flex-col gap-2.5">
                <div className="text-xs font-medium text-[#8B8B9E] flex items-center justify-between">
                  <span>Review</span>
                  <span className="text-[#3A3A4D] font-mono text-[11px]">
                    {(!isLandingCopyPlacedInDone ? 1 : 0) + (isApiDocsPlacedInReview ? 1 : 0)}
                  </span>
                </div>

                {/* Card A: "Landing page copy" placed in Review list */}
                {!isLandingCopyPlacedInDone && (
                  <div className={`bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] space-y-2 transition-all ${step === 0 && isMoving ? 'opacity-30 border-dashed border-[#7C6FF7]' : 'opacity-100'
                    }`}>
                    <div className="text-xs text-white font-medium">Landing page copy</div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#7C6FF7]/15 text-[#7C6FF7] border border-[#7C6FF7]/30 font-medium">
                      Low
                    </span>
                  </div>
                )}

                {/* Card B: Placed in Review list after moving */}
                {isApiDocsPlacedInReview && (
                  <div className={`bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] space-y-2 transition-all ${step === 2 && isMoving ? 'opacity-30 border-dashed border-[#7C6FF7]' : 'opacity-100'
                    }`}>
                    <div className="text-xs text-white font-medium">Write API docs</div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 font-medium">
                      Medium
                    </span>
                  </div>
                )}

                <div className="text-xs text-[#8B8B9E] py-2 border border-dashed border-[#2A2A35] rounded-lg text-center cursor-pointer hover:border-gray-500 hover:text-white transition-all">
                  + Add card
                </div>
              </div>

              {/* Col 4: Done */}
              <div className="bg-[#0F0F13] rounded-xl p-3.5 w-[210px] shrink-0 border border-[#2A2A35] flex flex-col gap-2.5">
                <div className="text-xs font-medium text-[#8B8B9E] flex items-center justify-between">
                  <span>Done</span>
                  <span className="text-[#3A3A4D] font-mono text-[11px]">
                    {isLandingCopyPlacedInDone ? 3 : 2}
                  </span>
                </div>

                {/* Card A: Placed in Done list after moving & marked Done */}
                {isLandingCopyPlacedInDone && (
                  <div className={`bg-[#1C1C24] rounded-lg p-3 border border-[#69DB7C]/40 space-y-1.5 transition-all opacity-85 ${step === 3 && isMoving ? 'opacity-30 border-dashed border-[#7C6FF7]' : ''
                    }`}>
                    <div className="text-xs text-white font-medium flex items-center justify-between">
                      <span className="line-through text-gray-300">Landing page copy</span>
                      <svg className="w-3.5 h-3.5 text-[#69DB7C]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#69DB7C]/15 text-[#69DB7C] border border-[#69DB7C]/30 font-semibold">
                      Done
                    </span>
                  </div>
                )}

                <div className="bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] opacity-50 space-y-1">
                  <div className="text-xs text-white font-medium line-through">Wireframes</div>
                </div>

                <div className="bg-[#1C1C24] rounded-lg p-3 border border-[#2A2A35] opacity-50 space-y-1">
                  <div className="text-xs text-white font-medium line-through">Set up repo</div>
                </div>

                <div className="text-xs text-[#8B8B9E] py-2 border border-dashed border-[#2A2A35] rounded-lg text-center cursor-pointer hover:border-gray-500 hover:text-white transition-all">
                  + Add card
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section Divider: Board Preview -> V-Chat */}
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 my-16 sm:my-20">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        </div>

        {/* 5. Built-in V-Chat & Real-time Messaging Section */}
        <section className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-8">

          {/* Section Heading & Subtitle */}
          <div className="mb-12 text-center flex flex-col items-center">
            <p className="text-[#7C6FF7] text-xs sm:text-sm font-semibold mb-3">
              Built-in V-Chat & Real-time Messaging
            </p>

            <h2 className="text-[34px] sm:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-white mb-4 max-w-3xl mx-auto text-center">
              Video chat, screen-share, and ship.<br />
              <span className="text-[#7C6FF7]">Right inside your board.</span>
            </h2>

            <p className="text-[#8B8B9E] text-base sm:text-lg leading-[1.7] max-w-2xl mx-auto text-center">
              Zero external meeting links. Zero bouncing between Slack, Zoom, and your kanban cards. Launch instant peer-to-peer V-Chat video calls with live screen sharing, or discuss tasks right alongside your board in real time.
            </p>
          </div>

          {/* Authentic V-Chat Modal & Board Chat Mockup Window */}
          <div className="rounded-2xl bg-[#0F0F17]/95 border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-950/40 backdrop-blur-xl">

            {/* Top Bar of the Mockup Window (Matches BoardHuddleModal.jsx) */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#14141F]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-wide text-purple-200">
                    V-Chat (3)
                  </span>
                  <span className="text-xs text-gray-400 hidden md:inline">
                    · Sprint Launch Board
                  </span>
                </div>
              </div>

              {/* Window Action Icons */}
              <div className="flex items-center gap-1 text-gray-400">
                <div className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors" title="Minimize">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </div>
                <div className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors" title="Full Screen">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stage Body - Balanced, Spacious & Uncompressed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px] lg:h-[650px] lg:max-h-[650px] overflow-hidden">

              {/* Left Side: V-Chat Video Call Stage */}
              <div className="lg:col-span-7 xl:col-span-8 p-3.5 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0A0A10] relative min-h-0">

                {/* 1. Main Stage Screen Share: Spacious, Uncompressed Live Code Editor Session */}
                <div className="relative bg-[#12121E] border-2 border-emerald-500/80 rounded-xl overflow-hidden ring-2 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col mb-2.5 sm:mb-3">

                  {/* Top Bar inside Screen Share Window - Clickable & Cycling Tabs */}
                  <div className="bg-[#181826] border-b border-white/10 px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* File Tabs in IDE: Switchable automatically and clickable */}
                      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => setActiveCodeFile(0)}
                          className={`flex items-center gap-1.5 rounded-t px-2 py-1 text-[11px] font-mono transition-all cursor-pointer ${
                            activeCodeFile === 0
                              ? 'bg-[#12121E] border-t-2 border-l border-r border-purple-500 text-purple-200 font-semibold shadow-sm'
                              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${activeCodeFile === 0 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></span>
                          <span>stripe.webhook.ts</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveCodeFile(1)}
                          className={`flex items-center gap-1.5 rounded-t px-2 py-1 text-[11px] font-mono transition-all cursor-pointer ${
                            activeCodeFile === 1
                              ? 'bg-[#12121E] border-t-2 border-l border-r border-purple-500 text-purple-200 font-semibold shadow-sm'
                              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${activeCodeFile === 1 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></span>
                          <span>database.pool.ts</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveCodeFile(2)}
                          className={`hidden sm:flex items-center gap-1.5 rounded-t px-2 py-1 text-[11px] font-mono transition-all cursor-pointer ${
                            activeCodeFile === 2
                              ? 'bg-[#12121E] border-t-2 border-l border-r border-purple-500 text-purple-200 font-semibold shadow-sm'
                              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${activeCodeFile === 2 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></span>
                          <span>redis.cache.ts</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backend Code Editor Body - Spacious, uncompressed with slow scrolling */}
                  <div
                    ref={codeScrollRef}
                    className="p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs leading-relaxed text-gray-300 select-none bg-[#0D0D15] overflow-x-auto text-left h-[320px] sm:h-[350px] min-h-[320px] overflow-y-auto scroll-smooth"
                  >

                    {/* File 1: stripe.webhook.controller.ts */}
                    {activeCodeFile === 0 && (
                      <div className="space-y-0.5">
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">1</span>
                          <span className="text-gray-500">// 1. Stripe Webhook Controller: Signature verification & idempotency</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">2</span>
                          <span>
                            <span className="text-purple-400 font-semibold">import</span> {'{'} Request, Response {'}'}{' '}
                            <span className="text-purple-400 font-semibold">from</span> <span className="text-emerald-300">'express'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">3</span>
                          <span>
                            <span className="text-purple-400 font-semibold">import</span> {'{'} stripe {'}'}{' '}
                            <span className="text-purple-400 font-semibold">from</span> <span className="text-emerald-300">'../config/stripe'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">4</span>
                          <span>
                            <span className="text-purple-400 font-semibold">import</span> {'{'} redisClient {'}'}{' '}
                            <span className="text-purple-400 font-semibold">from</span> <span className="text-emerald-300">'./redis.cache'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">5</span>
                          <span>
                            <span className="text-purple-400 font-semibold">import</span> {'{'} withTransaction {'}'}{' '}
                            <span className="text-purple-400 font-semibold">from</span> <span className="text-emerald-300">'./database.pool'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">6</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">7</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export async function</span>{' '}
                            <span className="text-blue-400">handleStripeWebhook</span>
                            <span className="text-yellow-300">(</span>
                            <span className="text-orange-300">req</span>: <span className="text-teal-300">Request</span>,{' '}
                            <span className="text-orange-300">res</span>: <span className="text-teal-300">Response</span>
                            <span className="text-yellow-300">)</span> {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">8</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> sig = req.headers[<span className="text-emerald-300">'stripe-signature'</span>] <span className="text-purple-400 font-semibold">as</span> <span className="text-teal-300">string</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">9</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> event = stripe.webhooks.<span className="text-blue-400">constructEvent</span>(req.body, sig, process.env.<span className="text-blue-300">STRIPE_SIGNING_SECRET</span>!);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">10</span>
                          <span className="pl-4">
                            <span className="text-gray-500">// Prevent duplicate billing if Stripe retries webhook delivery</span>
                          </span>
                        </div>
                        <div className="flex items-start bg-purple-500/15 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 border-l-2 border-purple-500">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">11</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> acquired = <span className="text-purple-400 font-semibold">await</span> redisClient.<span className="text-blue-400">set</span>(<span className="text-emerald-300">`lock:${'{'}event.id{'}'}`</span>, <span className="text-emerald-300">'1'</span>, <span className="text-emerald-300">'EX'</span>, 86400, <span className="text-emerald-300">'NX'</span>);
                            <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-bold ml-2 shadow">
                              Sarah Lin editing
                            </span>
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">12</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">if</span> (!acquired) <span className="text-purple-400 font-semibold">return</span> res.<span className="text-blue-400">status</span>(200).<span className="text-blue-400">json</span>({'{'} status: <span className="text-emerald-300">'already_processed'</span> {'}'});
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">13</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">await</span> <span className="text-blue-400">withTransaction</span>(<span className="text-purple-400 font-semibold">async</span> (client) =&gt; {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">14</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">await</span> client.<span className="text-blue-400">query</span>(<span className="text-emerald-300">'UPDATE subscriptions SET status = $1 WHERE customer_id = $2'</span>, [<span className="text-emerald-300">'active'</span>, event.data.object.customer]);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">15</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">await</span> client.<span className="text-blue-400">query</span>(<span className="text-emerald-300">'INSERT INTO audit_logs (event_id, event_type, payload) VALUES ($1, $2, $3)'</span>, [event.id, event.type, JSON.<span className="text-blue-400">stringify</span>(event.data.object)]);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">16</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">await</span> redisClient.<span className="text-blue-400">publish</span>(<span className="text-emerald-300">'events:subscription_activated'</span>, event.data.object.customer);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">17</span>
                          <span className="pl-4">{'}'});</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">18</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> metric = {'{'} event: event.type, latencyMs: Date.<span className="text-blue-400">now</span>() - startTime {'}'};
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">19</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">await</span> redisClient.<span className="text-blue-400">lpush</span>(<span className="text-emerald-300">'metrics:webhook_latency'</span>, JSON.<span className="text-blue-400">stringify</span>(metric));
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">20</span>
                          <span className="pl-4">
                            <span className="text-gray-500">// Acknowledge 200 OK back to Stripe cluster with idempotency receipt</span>
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">21</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">return</span> res.<span className="text-blue-400">status</span>(200).<span className="text-blue-400">json</span>({'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">22</span>
                          <span className="pl-8">
                            received: <span className="text-purple-400 font-bold">true</span>,
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">23</span>
                          <span className="pl-8">
                            eventId: event.id,
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">24</span>
                          <span className="pl-8">
                            processedAt: <span className="text-purple-400 font-semibold">new</span> <span className="text-blue-400">Date</span>().<span className="text-blue-400">toISOString</span>()
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">25</span>
                          <span className="pl-4">{'}'});</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">26</span>
                          <span>{'}'}</span>
                        </div>
                      </div>
                    )}

                    {/* File 2: database.pool.ts */}
                    {activeCodeFile === 1 && (
                      <div className="space-y-0.5">
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">1</span>
                          <span className="text-gray-500">// 2. PostgreSQL Connection Pool & Atomic Transaction Wrapper</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">2</span>
                          <span>
                            <span className="text-purple-400 font-semibold">import</span> {'{'} Pool, PoolClient {'}'}{' '}
                            <span className="text-purple-400 font-semibold">from</span> <span className="text-emerald-300">'pg'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">3</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">4</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export const</span> pool = <span className="text-purple-400 font-semibold">new</span> <span className="text-blue-400">Pool</span>({'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">5</span>
                          <span className="pl-4">
                            connectionString: process.env.<span className="text-blue-300">DATABASE_URL</span>,
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">6</span>
                          <span className="pl-4">
                            max: <span className="text-yellow-300">25</span>, idleTimeoutMillis: <span className="text-yellow-300">30000</span>, connectionTimeoutMillis: <span className="text-yellow-300">5000</span>,
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">7</span>
                          <span>{'}'});</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">8</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">9</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export async function</span>{' '}
                            <span className="text-blue-400">withTransaction</span>
                            <span className="text-yellow-300">&lt;</span><span className="text-teal-300">T</span><span className="text-yellow-300">&gt;</span>
                            <span className="text-yellow-300">(</span>
                            <span className="text-orange-300">fn</span>: (<span className="text-orange-300">client</span>: <span className="text-teal-300">PoolClient</span>) =&gt; <span className="text-teal-300">Promise&lt;T&gt;</span>
                            <span className="text-yellow-300">)</span>: <span className="text-teal-300">Promise&lt;T&gt;</span> {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">10</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> client = <span className="text-purple-400 font-semibold">await</span> pool.<span className="text-blue-400">connect</span>();
                          </span>
                        </div>
                        <div className="flex items-start bg-purple-500/15 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 border-l-2 border-purple-500">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">11</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">try</span> {'{'} <span className="text-purple-400 font-semibold">await</span> client.<span className="text-blue-400">query</span>(<span className="text-emerald-300">'BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE'</span>);
                            <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-bold ml-2 shadow">
                              Sarah Lin explaining
                            </span>
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">12</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">const</span> result = <span className="text-purple-400 font-semibold">await</span> <span className="text-blue-400">fn</span>(client);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">13</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">await</span> client.<span className="text-blue-400">query</span>(<span className="text-emerald-300">'COMMIT'</span>);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">14</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">return</span> result;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">15</span>
                          <span className="pl-4">
                            {'}'} <span className="text-purple-400 font-semibold">catch</span> (err) {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">16</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">await</span> client.<span className="text-blue-400">query</span>(<span className="text-emerald-300">'ROLLBACK'</span>);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">17</span>
                          <span className="pl-8">
                            console.<span className="text-blue-400">error</span>(<span className="text-emerald-300">'[DB_TX_ERROR] Transaction aborted:'</span>, err);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">18</span>
                          <span className="pl-8">
                            <span className="text-purple-400 font-semibold">throw</span> err;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">19</span>
                          <span className="pl-4">
                            {'}'} <span className="text-purple-400 font-semibold">finally</span> {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">20</span>
                          <span className="pl-8">
                            client.<span className="text-blue-400">release</span>();
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">21</span>
                          <span className="pl-4">{'}'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">22</span>
                          <span>{'}'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">23</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">24</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export async function</span>{' '}
                            <span className="text-blue-400">checkPoolHealth</span>(): <span className="text-teal-300">Promise&lt;boolean&gt;</span> {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">25</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> res = <span className="text-purple-400 font-semibold">await</span> pool.<span className="text-blue-400">query</span>(<span className="text-emerald-300">'SELECT 1 as heartbeat'</span>);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">26</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">return</span> res.rows[<span className="text-yellow-300">0</span>].heartbeat === <span className="text-yellow-300">1</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">27</span>
                          <span>{'}'}</span>
                        </div>
                      </div>
                    )}

                    {/* File 3: redis.cache.ts */}
                    {activeCodeFile === 2 && (
                      <div className="space-y-0.5">
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">1</span>
                          <span className="text-gray-500">// 3. Distributed Redis Cache & Cluster Mutex Synchronization</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">2</span>
                          <span>
                            <span className="text-purple-400 font-semibold">import</span> Redis <span className="text-purple-400 font-semibold">from</span> <span className="text-emerald-300">'ioredis'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">3</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">4</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export const</span> redisClient = <span className="text-purple-400 font-semibold">new</span> <span className="text-blue-400">Redis</span>(process.env.<span className="text-blue-300">REDIS_URL</span>, {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">5</span>
                          <span className="pl-4">
                            maxRetriesPerRequest: <span className="text-yellow-300">3</span>, retryStrategy: (t) =&gt; Math.<span className="text-blue-400">min</span>(t * <span className="text-yellow-300">100</span>, <span className="text-yellow-300">3000</span>),
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">6</span>
                          <span>{'}'});</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">7</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start bg-purple-500/15 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 border-l-2 border-purple-500">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">8</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export async function</span>{' '}
                            <span className="text-blue-400">acquireMutex</span>
                            <span className="text-yellow-300">(</span>
                            <span className="text-orange-300">key</span>: <span className="text-teal-300">string</span>, <span className="text-orange-300">ttlMs</span> = <span className="text-yellow-300">15000</span>
                            <span className="text-yellow-300">)</span>: <span className="text-teal-300">Promise&lt;boolean&gt;</span> {'{'}
                            <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-bold ml-2 shadow">
                              Sarah Lin explaining
                            </span>
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">9</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> res = <span className="text-purple-400 font-semibold">await</span> redisClient.<span className="text-blue-400">set</span>(<span className="text-emerald-300">`mutex:${'{'}key{'}'}`</span>, <span className="text-emerald-300">'locked'</span>, <span className="text-emerald-300">'PX'</span>, ttlMs, <span className="text-emerald-300">'NX'</span>);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">10</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">return</span> res === <span className="text-emerald-300">'OK'</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">11</span>
                          <span>{'}'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">12</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">13</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export async function</span>{' '}
                            <span className="text-blue-400">releaseMutex</span>
                            <span className="text-yellow-300">(</span>
                            <span className="text-orange-300">key</span>: <span className="text-teal-300">string</span>
                            <span className="text-yellow-300">)</span>: <span className="text-teal-300">Promise&lt;void&gt;</span> {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">14</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> script = <span className="text-emerald-300">`if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">15</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">await</span> redisClient.<span className="text-blue-400">eval</span>(script, 1, <span className="text-emerald-300">`mutex:${'{'}key{'}'}`</span>, <span className="text-emerald-300">'locked'</span>);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">16</span>
                          <span className="pl-4">
                            console.<span className="text-blue-400">log</span>(<span className="text-emerald-300">`[REDIS_LOCK] Mutex released for ${'{'}key{'}'}`</span>);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">17</span>
                          <span>{'}'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">18</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">19</span>
                          <span>
                            <span className="text-purple-400 font-semibold">export async function</span>{' '}
                            <span className="text-blue-400">renewMutexTtl</span>
                            <span className="text-yellow-300">(</span>
                            <span className="text-orange-300">key</span>: <span className="text-teal-300">string</span>, <span className="text-orange-300">extraMs</span>: <span className="text-teal-300">number</span>
                            <span className="text-yellow-300">)</span>: <span className="text-teal-300">Promise&lt;boolean&gt;</span> {'{'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">20</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">const</span> renewed = <span className="text-purple-400 font-semibold">await</span> redisClient.<span className="text-blue-400">pexpire</span>(<span className="text-emerald-300">`mutex:${'{'}key{'}'}`</span>, extraMs);
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">21</span>
                          <span className="pl-4">
                            <span className="text-purple-400 font-semibold">return</span> renewed === <span className="text-yellow-300">1</span>;
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-6 text-gray-600 select-none text-right pr-3">22</span>
                          <span>{'}'}</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Bottom Info Badges on Screen Share */}
                  <div className="bg-[#151522] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium">
                      <span>Sarah Lin (Sharing Screen)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Speaking...
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 text-emerald-400 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Three User Screens Below: Centered Profile Pictures with Camera-Off Icon (Compact Height) */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">

                  {/* User 1: Sarah Lin (Speaking, Camera Off) */}
                  <div className="relative bg-[#13131F] border-2 border-emerald-500/70 rounded-xl p-2 sm:p-2.5 flex items-center justify-center h-[90px] sm:h-[98px] min-h-[90px] sm:min-h-[98px] shadow-lg shadow-emerald-950/25 overflow-hidden">
                    {/* Centered Avatar */}
                    <div className="relative flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                        alt="Sarah Lin"
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-400 shadow ring-2 ring-emerald-500/20"
                      />
                      {/* Video Off Icon Badge */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1C1C28] border border-white/40 flex items-center justify-center text-gray-200 shadow" title="Camera off">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Label Overlay */}
                    <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between pointer-events-none px-0.5">
                      <span className="text-[10px] sm:text-[11px] font-medium text-white/95 truncate bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded shadow">
                        Sarah Lin
                      </span>
                      <div className="w-4 h-4 rounded bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 backdrop-blur-sm shadow" title="Microphone Active">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* User 2: Joey Tribbiani (Camera Off, Mic Muted) */}
                  <div className="relative bg-[#13131F] border border-white/10 rounded-xl p-2 sm:p-2.5 flex items-center justify-center h-[90px] sm:h-[98px] min-h-[90px] sm:min-h-[98px] shadow-lg overflow-hidden">
                    {/* Centered Avatar */}
                    <div className="relative flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                        alt="Joey Tribbiani"
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-white/20 shadow ring-2 ring-white/5"
                      />
                      {/* Video Off Icon Badge */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1C1C28] border border-white/40 flex items-center justify-center text-gray-200 shadow" title="Camera off">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Label Overlay */}
                    <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between pointer-events-none px-0.5">
                      <span className="text-[10px] sm:text-[11px] font-medium text-gray-300 truncate bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded shadow">
                        Joey Tribbiani
                      </span>
                      <div className="w-4 h-4 rounded bg-red-500/25 text-red-400 flex items-center justify-center shrink-0 backdrop-blur-sm shadow" title="Microphone Muted">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* User 3: Rahulya (You, Camera Off) */}
                  <div className="relative bg-[#13131F] border border-purple-500/40 rounded-xl p-2 sm:p-2.5 flex items-center justify-center h-[90px] sm:h-[98px] min-h-[90px] sm:min-h-[98px] shadow-lg shadow-purple-950/20 overflow-hidden">
                    {/* Centered Avatar */}
                    <div className="relative flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                        alt="Rahulya"
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-500/60 shadow ring-2 ring-purple-500/10"
                      />
                      {/* Video Off Icon Badge */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1C1C28] border border-white/40 flex items-center justify-center text-gray-200 shadow" title="Camera off">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Label Overlay */}
                    <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between pointer-events-none px-0.5">
                      <span className="text-[10px] sm:text-[11px] font-medium text-purple-200 truncate bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded shadow">
                        Rahulya (You)
                      </span>
                      <div className="w-4 h-4 rounded bg-red-500/25 text-red-400 flex items-center justify-center shrink-0 backdrop-blur-sm shadow" title="Microphone Muted">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. Floating In-Call Controls Bar (Compact Size) */}
                <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141E]/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-purple-950/40 select-none w-fit mx-auto mt-0 sm:mt-1">
                  {/* Mic Button */}
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 transition-all font-medium text-xs cursor-pointer bg-transparent ${micMuted
                        ? 'border-red-500 text-red-300 hover:bg-red-500/20'
                        : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
                      }`}
                    title={micMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {micMuted ? (
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
                    onClick={() => setCamOff(!camOff)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 transition-all font-medium text-xs cursor-pointer bg-transparent ${camOff
                        ? 'border-red-500 text-red-300 hover:bg-red-500/20'
                        : 'border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white'
                      }`}
                    title={camOff ? 'Turn Camera On' : 'Turn Camera Off'}
                  >
                    {camOff ? (
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
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 transition-all font-medium text-xs cursor-pointer bg-emerald-500/20 border-emerald-500/80 text-emerald-300 shadow-md shadow-emerald-950/30"
                    title="Screen sharing active"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Sharing</span>
                  </button>

                  {/* Leave V-Chat Button */}
                  <button
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 transition-all font-medium text-xs cursor-pointer bg-transparent border-red-500/80 text-red-300 hover:bg-red-500/20 hover:text-white"
                    title="Leave V-Chat"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                    <span>Leave</span>
                  </button>
                </div>

              </div>

              {/* Right Side: Board Chat Stream (Always Visible side-by-side) */}
              <div className="lg:col-span-5 xl:col-span-4 p-3.5 sm:p-5 flex flex-col h-[520px] sm:h-[560px] lg:h-full min-h-0 bg-[#111119] overflow-hidden">

                {/* Chat Top Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400 stroke-purple-400 fill-none" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold text-white">Board Chat</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Sprint Channel</span>
                </div>

                {/* Messages Feed - Dynamic ongoing multi-message stream */}
                <div ref={chatScrollRef} className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1 overscroll-contain scroll-smooth">

                  {/* Message 1: Joey (Left side) */}
                  <div className="flex items-start gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Joey"
                      className="w-7 h-7 rounded-full object-cover border border-white/15 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-gray-200">Joey Tribbiani</span>
                        <span className="text-[10px] text-gray-500">3:42 PM</span>
                      </div>
                      <div className="p-2.5 rounded-2xl rounded-tl-none bg-[#1D1D2B] border border-[#2B2B3D] text-xs leading-relaxed text-gray-200 shadow">
                        Hey <span className="text-purple-400 font-semibold bg-purple-500/10 px-1 rounded">@Rahulya</span>, did we verify the Redis idempotency lock for duplicate Stripe webhooks?
                      </div>
                    </div>
                  </div>

                  {/* Message 2: Sarah Lin (Left side) */}
                  <div className="flex items-start gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Sarah"
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-gray-200">Sarah Lin</span>
                        <span className="text-[10px] text-gray-500">3:43 PM</span>
                      </div>
                      <div className="p-2.5 rounded-2xl rounded-tl-none bg-[#1D1D2B] border border-[#2B2B3D] text-xs leading-relaxed text-gray-200 shadow">
                        Walking through database.pool.ts and redis.cache.ts on screen right now ✨
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#252538] border border-white/10 text-[10px] text-gray-300 font-medium">
                          🔥 2
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Ongoing Messages (Messages 3 to 8) */}
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 transition-all duration-300 ${
                        msg.isMe ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className={`w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ${
                          msg.isMe
                            ? 'border border-purple-500/50'
                            : 'border border-white/15'
                        }`}
                      />
                      <div
                        className={`flex flex-col ${
                          msg.isMe ? 'items-end max-w-[82%]' : 'flex-1 text-left'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 mb-1 ${
                            msg.isMe ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <span
                            className={`text-xs font-semibold ${
                              msg.isMe ? 'text-purple-300' : 'text-gray-200'
                            }`}
                          >
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-gray-500">{msg.time}</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-2xl text-xs leading-relaxed shadow ${
                            msg.isMe
                              ? 'rounded-tr-none bg-[#1E132B]/95 border border-purple-500/80 text-white shadow-purple-950/40 text-left'
                              : 'rounded-tl-none bg-[#1D1D2B] border border-[#2B2B3D] text-gray-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.badge && (
                          <div
                            className={`flex items-center gap-1 mt-1.5 ${
                              msg.isMe ? 'justify-end' : ''
                            }`}
                          >
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                msg.isMe
                                  ? 'bg-[#252538] border border-purple-500/40 text-purple-200'
                                  : 'bg-[#252538] border border-white/10 text-gray-300'
                              }`}
                            >
                              {msg.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                </div>

                {/* Bottom Chat Input Box with Automatic Typing Animation & Send trigger */}
                <div className="pt-3 border-t border-white/10 mt-3 shrink-0">
                  <div className="flex items-center gap-2 bg-[#171724] border border-white/10 focus-within:border-purple-500/60 rounded-xl px-3 py-2 transition-colors">
                    <div className="flex-1 text-xs text-left truncate flex items-center min-h-[20px]">
                      {chatTypedText ? (
                        <span className="text-white font-mono flex items-center">
                          {chatTypedText}
                          <span className="inline-block w-1.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse"></span>
                        </span>
                      ) : (
                        <span className="text-gray-500">Type message or @mention...</span>
                      )}
                    </div>
                    {/* Emoji trigger SVG icon */}
                    <div className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors shrink-0" title="Add emoji">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {/* Purple Send Button - Animated when triggered */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all shadow shrink-0 ${
                        isSendActive
                          ? 'bg-purple-500 scale-90 ring-2 ring-purple-400 ring-offset-1 ring-offset-[#171724]'
                          : chatTypedText
                          ? 'bg-purple-600 scale-105'
                          : 'bg-purple-600/70 hover:bg-purple-600 cursor-pointer'
                      }`}
                      title="Send message"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Section Divider: V-Chat -> Features */}
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 my-16 sm:my-20">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        </div>

        {/* Features — transparent boxes with clean borders */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-20">

          {/* Section label — used meaningfully, not as ALL-CAPS decoration */}
          <p className="text-[#7C6FF7] text-sm font-medium mb-3">What you get</p>
          <h2 className="text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-10 max-w-2xl">
            Designed for focus.<br />
            <span className="text-[#7C6FF7]">Built for simplicity.</span>
          </h2>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-transparent divide-y divide-white/10">

            {/* Feature 1 — horizontal split, text-heavy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-transparent hover:bg-white/[0.015] transition-colors">
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="text-3xl sm:text-[36px] font-bold tracking-tight text-white leading-[1.15] mb-4">
                  Clear plan.<br />Minutes, not hours.
                </div>
                <p className="text-[#8B8B9E] text-base leading-[1.7] max-w-sm">
                  Create tasks with owners, due dates, and priorities in one step. Skip the setup and get straight to work.
                </p>
              </div>
              <div className="p-8 sm:p-10 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-sm bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#7C6FF7]/20 text-[#7C6FF7] flex items-center justify-center text-xs">✓</div>
                      <span className="text-sm font-semibold text-white">Campaign Launch</span>
                    </div>
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white/10 text-[9px] text-white flex items-center justify-center font-bold">J</div>
                      <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white/10 text-[9px] text-white flex items-center justify-center font-bold">R</div>
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#7C6FF7]/30 text-[#7C6FF7] flex items-center justify-center font-bold text-xs shrink-0">J</div>
                      <div>
                        <div className="text-xs text-white font-medium flex gap-2"><span>Joey</span><span className="text-[#8B8B9E]">3:30 pm</span></div>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed"><span className="text-[#7C6FF7] font-medium">@channel</span> customer wants that new feature ASAP — can we move?</p>
                      </div>
                    </div>
                    <div className="ml-10 bg-white/[0.04] border border-[#7C6FF7]/40 rounded-xl p-3 space-y-1.5 shadow-lg shadow-[#7C6FF7]/10">
                      <div className="text-xs text-white font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7C6FF7] animate-pulse"></span>Task created successfully.
                      </div>
                      <div className="text-[11px] text-[#8B8B9E] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full border border-[#7C6FF7] flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-[#7C6FF7]"></span></span>
                        <span className="text-white font-semibold">Customer feature request</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-transparent hover:bg-white/[0.015] transition-colors">
              <div className="p-8 sm:p-10 lg:p-12 flex items-center justify-center order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10">
                <div className="w-full max-w-sm bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4 backdrop-blur-sm">
                  <div className="text-[11px] font-semibold text-[#8B8B9E] uppercase tracking-widest">Workspace Activity</div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">M</div>
                    <div>
                      <div className="text-xs text-white font-medium">Marc</div>
                      <p className="text-xs text-gray-300 mt-0.5"><span className="text-[#7C6FF7] font-medium">@Team</span>, what's blocking launch this week?</p>
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3.5 space-y-2.5">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="text-[#7C6FF7]">⚡</span>Here's what's at risk:
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1.5 pl-3 list-disc">
                      <li><span className="font-medium text-white">Launch Email</span> — 80% done.</li>
                      <li><span className="font-medium text-amber-400">Hero Wireframes</span> — pending review.</li>
                      <li><span className="font-medium text-[#FF6B6B]">Competitor Research</span> — overdue.</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
                <div className="text-3xl sm:text-[36px] font-bold tracking-tight text-white leading-[1.15] mb-4">
                  Know who's doing what,<br />without asking.
                </div>
                <p className="text-[#8B8B9E] text-base leading-[1.7] max-w-sm">
                  @mentions, real-time updates, and overdue flags keep everyone aligned without another status meeting.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-transparent hover:bg-white/[0.015] transition-colors">
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="text-3xl sm:text-[36px] font-bold tracking-tight text-white leading-[1.15] mb-4">
                  Invite anyone.<br />Control access.
                </div>
                <p className="text-[#8B8B9E] text-base leading-[1.7] max-w-sm mb-7">
                  Shareable invite links or direct email. Admin, Member, or Viewer — set it once and move on.
                </p>
                <Link to={user ? '/' : '/register'}
                  className="inline-flex items-center gap-2 w-fit bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors">
                  {user ? 'Open Dashboard' : 'Get started'} →
                </Link>
              </div>
              <div className="p-8 sm:p-10 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-sm bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">Project Alpha</span>
                      <span className="text-[11px] text-[#8B8B9E]">Invite link active · 4 members</span>
                    </div>
                    <button className="px-3.5 py-1.5 bg-[#7C6FF7] hover:bg-[#6C5CE7] text-white rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors">Copy Link</button>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    {[
                      { initial: 'R', name: 'Rahulya', role: 'Admin', color: 'bg-purple-600', badge: 'bg-[#7C6FF7]/20 text-[#7C6FF7]' },
                      { initial: 'J', name: 'Joey', role: 'Member', color: 'bg-blue-600', badge: 'bg-white/[0.06] text-gray-300' },
                      { initial: 'M', name: 'Marc', role: 'Viewer', color: 'bg-amber-600', badge: 'bg-white/[0.06] text-gray-300' },
                    ].map(m => (
                      <div key={m.name} className="flex items-center justify-between text-xs py-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full ${m.color} text-white text-[9px] flex items-center justify-center font-bold`}>{m.initial}</div>
                          <span className="text-white font-medium">{m.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${m.badge}`}>{m.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Section Divider: Features -> Footer */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 my-10 sm:my-14 relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      </div>

      {/* 7. Minimal Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 sm:px-10 py-6 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8B8B9E] relative z-10">

        {/* App Name & Logo */}
        <div className="flex items-center gap-2 font-bold text-white tracking-tight">
          <StatusBarsLogo size={22} />
          <span className="text-[#7C6FF7]">PrimeTeam</span>
        </div>

        {/* Copyright */}
        <div className="text-gray-400">
          © {new Date().getFullYear()} PrimeTeam. All rights reserved.
        </div>

        {/* Contact Us & Built by GitHub */}
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=primeteam.security@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B8B9E] hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Contact us
          </a>

          <span className="text-[#2A2A35]">|</span>

          <a
            href="https://github.com/Rahulyacodes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#8B8B9E] hover:text-white transition-colors group"
          >
            <span>Built by</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
