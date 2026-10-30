import { useEffect, useRef, useState } from 'react'
import { StatusBarsLogo } from '../common/StatusBarsLogo'
import { Avatar, AvatarStack } from './Avatar'
import { PEOPLE, PRIORITY_STYLES } from './mockData'

const STEP_STATE = {
  0: {
    landing: { from: 'review', to: 'done' },
    api: { from: 'progress', to: 'progress' },
  },
  1: {
    landing: { from: 'done', to: 'done' },
    api: { from: 'progress', to: 'review' },
  },
  2: {
    landing: { from: 'done', to: 'done' },
    api: { from: 'review', to: 'progress' },
  },
  3: {
    landing: { from: 'done', to: 'review' },
    api: { from: 'progress', to: 'progress' },
  },
}

const MOVING_CARDS = {
  landing: { title: 'Landing page copy', tone: 'low', person: PEOPLE.rahulya },
  api: { title: 'Write API docs', tone: 'medium', person: PEOPLE.joey },
}

function TaskCard({
  title,
  tone = 'low',
  person,
  completed = false,
  faded = false,
  due,
  overdue = false,
  comments,
  progress,
  innerRef,
  landed = false,
}) {
  return (
    <div
      ref={innerRef}
      className={`rounded-[9px] border bg-[#15151E] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[opacity,border-color] duration-300 ${
        completed
          ? 'border-[#69DB7C]/20 bg-[#12191A]'
          : 'border-white/[0.07]'
      } ${faded ? 'border-dashed border-[#7C6FF7]/40 opacity-25' : ''} ${
        landed ? 'landing-card-land' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-[13px] font-medium leading-[1.35] tracking-[-0.01em] ${
            completed ? 'text-white/40 line-through' : 'text-white/90'
          }`}
        >
          {title}
        </p>
        {completed && (
          <svg className="mt-0.5 h-3 w-3 shrink-0 text-[#69DB7C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center rounded border px-1.5 py-[2px] text-[11px] font-medium ${PRIORITY_STYLES[tone] || PRIORITY_STYLES.low}`}>
          {tone === 'done' ? 'Done' : tone.charAt(0).toUpperCase() + tone.slice(1)}
        </span>
        {due && (
          <span className={`inline-flex items-center gap-1 text-[11px] ${overdue ? 'font-medium text-[#FF9B9B]' : 'text-white/35'}`}>
            {overdue && <span className="h-1 w-1 rounded-full bg-[#FF6B6B]" />}
            {due}
          </span>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[11px] text-white/40">
            <span>Progress</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-[#7C6FF7]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {(person || comments) && (
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {person && <Avatar person={person} size={18} />}
            {person && <span className="text-[11px] text-white/45">{person.name}</span>}
          </div>
          {comments && (
            <span className="inline-flex items-center gap-1 text-[11px] text-white/40">
              <CommentIcon className="h-2.5 w-2.5" />
              {comments}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function BoardColumn({ title, count, onAdd, children, innerRef, highlight = false }) {
  return (
    <section
      className={`flex min-h-[340px] flex-col rounded-[10px] border p-2.5 ${
        highlight ? 'border-[#7C6FF7]/20 bg-[#7C6FF7]/[0.035]' : 'border-white/[0.055] bg-[#0D0D14]'
      }`}
    >
      <header className="mb-2.5 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-medium uppercase tracking-[0.12em] ${highlight ? 'text-[#C3BBFF]' : 'text-white/45'}`}>
            {title}
          </span>
          <span className="font-mono text-[11px] text-white/35">{count}</span>
        </div>
        <button type="button" tabIndex={-1} className="text-white/20" aria-hidden="true">
          <PlusIcon className="h-3 w-3" />
        </button>
      </header>
      <div ref={innerRef} className="h-0" />
      <div className="flex flex-1 flex-col gap-2">
        {children}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="mt-auto flex items-center gap-1 rounded-md border border-dashed border-white/[0.06] px-2 py-1.5 text-[11px] text-white/35"
        >
          <PlusIcon className="h-2.5 w-2.5" />
          {onAdd}
        </button>
      </div>
    </section>
  )
}

export default function HeroBoard() {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('from')
  const [flying, setFlying] = useState(false)
  const [ghost, setGhost] = useState(null)

  const frameRef = useRef(null)
  const landingReviewRef = useRef(null)
  const landingDoneRef = useRef(null)
  const apiProgressRef = useRef(null)
  const apiReviewRef = useRef(null)
  const progressDropRef = useRef(null)
  const reviewDropRef = useRef(null)
  const doneDropRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const travel = STEP_STATE[step]
    const movingKey = travel.landing.from !== travel.landing.to ? 'landing' : 'api'
    const fromPos = travel[movingKey].from
    const toPos = travel[movingKey].to

    const sourceEl =
      movingKey === 'landing'
        ? fromPos === 'review'
          ? landingReviewRef.current
          : landingDoneRef.current
        : fromPos === 'progress'
          ? apiProgressRef.current
          : apiReviewRef.current

    const targetEl =
      toPos === 'done'
        ? doneDropRef.current
        : toPos === 'review'
          ? reviewDropRef.current
          : progressDropRef.current

    const frame = frameRef.current
    let firstFrame = null
    let secondFrame = null
    let landTimer = null

    if (frame && sourceEl && targetEl) {
      const frameRect = frame.getBoundingClientRect()
      const sourceRect = sourceEl.getBoundingClientRect()
      const targetRect = targetEl.getBoundingClientRect()

      setFlying(false)
      setGhost({
        left: sourceRect.left - frameRect.left,
        top: sourceRect.top - frameRect.top,
        width: sourceRect.width,
        dx: targetRect.left - sourceRect.left,
        dy: targetRect.top - sourceRect.top,
        movingKey,
      })
      setPhase('flying')

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => setFlying(true))
      })

      landTimer = setTimeout(() => {
        setFlying(false)
        setGhost(null)
        setPhase('to')
      }, 1280)
    } else {
      landTimer = setTimeout(() => setPhase('to'), 900)
    }

    const nextStepTimer = setTimeout(() => {
      setPhase('from')
      setStep((current) => (current + 1) % 4)
    }, 3900)

    return () => {
      if (firstFrame) cancelAnimationFrame(firstFrame)
      if (secondFrame) cancelAnimationFrame(secondFrame)
      if (landTimer) clearTimeout(landTimer)
      clearTimeout(nextStepTimer)
    }
  }, [step])

  const positionOf = (key) =>
    phase === 'to' ? STEP_STATE[step][key].to : STEP_STATE[step][key].from

  const landingPos = positionOf('landing')
  const apiPos = positionOf('api')
  const movingKey = STEP_STATE[step].landing.from !== STEP_STATE[step].landing.to ? 'landing' : 'api'
  const ghostMeta = ghost ? MOVING_CARDS[ghost.movingKey] : null

  const progressCount = 1 + (apiPos === 'progress' ? 1 : 0)
  const reviewCount = 1 + (landingPos === 'review' ? 1 : 0) + (apiPos === 'review' ? 1 : 0)
  const doneCount = 2 + (landingPos === 'done' ? 1 : 0)

  return (
    <div>
      <p className="sr-only">
        Product preview: a PrimeTeam board with Backlog, In progress, Review, and Done lists. A card moves
        between lists to show the workflow.
      </p>

      <div aria-hidden="true" className="relative">
        <div
          ref={frameRef}
          className="relative overflow-hidden rounded-xl border border-white/[0.09] bg-[#0A0A0F] shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.02)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#7C6FF7]/70 to-transparent" />

          {/* Workspace toolbar */}
          <div className="flex h-[50px] items-center gap-3 border-b border-white/[0.06] bg-[#0D0D13] px-3.5">
            <div className="flex items-center gap-2">
              <StatusBarsLogo size={19} />
              <span className="hidden text-[11px] font-medium text-white/50 sm:inline">PrimeTeam</span>
              <span className="hidden text-[11px] text-white/15 sm:inline">/</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[13px] font-semibold text-white/90">Product launch</span>
              <svg className="h-3 w-3 shrink-0 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m12 3 2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.5l6.3-.9L12 3Z" />
              </svg>
            </div>

            <div className="ml-4 hidden items-center gap-4 sm:flex">
              <span className="border-b border-[#7C6FF7] pb-[18px] pt-[18px] text-[13px] font-medium text-white">
                Board
              </span>
              <span className="pb-[18px] pt-[18px] text-[13px] text-white/40">Planner</span>
              <span className="hidden pb-[18px] pt-[18px] text-[13px] text-white/40 md:inline">Activity</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:block">
                <AvatarStack people={[PEOPLE.sarah, PEOPLE.joey, PEOPLE.marc]} size={21} />
              </div>
              <button
                type="button"
                tabIndex={-1}
                className="hidden items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-white/60 sm:flex"
              >
                <ShareIcon />
                Share
              </button>
              <button
                type="button"
                tabIndex={-1}
                className="relative flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
              >
                <VideoIcon className="h-3.5 w-3.5" />
                <span className="landing-live-dot absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* App rail */}
            <aside className="hidden w-11 shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-[#0B0B10] py-3 lg:flex">
              <span className="mb-2 flex h-6 w-6 items-center justify-center rounded-md bg-[#7C6FF7]/15 text-[#B8AFFF]">
                <GridIcon className="h-3.5 w-3.5" />
              </span>
              <RailButton label="Planner">
                <CalendarIcon className="h-3.5 w-3.5" />
              </RailButton>
              <RailButton label="Search">
                <SearchIcon className="h-3.5 w-3.5" />
              </RailButton>
              <RailButton label="Inbox">
                <InboxIcon className="h-3.5 w-3.5" />
              </RailButton>
              <div className="mt-auto">
                <Avatar person={PEOPLE.rahulya} size={22} />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="overflow-x-auto px-3.5 py-3.5 sm:px-4">
                <div className="grid min-w-[680px] grid-cols-4 gap-2.5">
                  <BoardColumn title="Backlog" count={3} onAdd="Add card">
                    <TaskCard
                      title="Research competitors"
                      tone="low"
                      person={PEOPLE.sarah}
                      comments={2}
                    />
                    <TaskCard
                      title="Set up design system"
                      tone="medium"
                      person={PEOPLE.marc}
                      due="Aug 20"
                    />
                    <TaskCard
                      title="User interviews"
                      tone="design"
                      person={PEOPLE.marc}
                    />
                  </BoardColumn>

                  <BoardColumn
                    title="In progress"
                    count={progressCount}
                    onAdd="Add card"
                    innerRef={progressDropRef}
                  >
                    <TaskCard
                      title="Build auth flow"
                      tone="high"
                      person={PEOPLE.joey}
                      due="Aug 12 · Overdue"
                      overdue
                      progress={50}
                    />
                    {apiPos === 'progress' && (
                      <TaskCard
                        title="Write API docs"
                        tone="medium"
                        person={PEOPLE.joey}
                        innerRef={movingKey === 'api' ? apiProgressRef : undefined}
                        faded={phase === 'flying' && movingKey === 'api'}
                        landed={phase === 'to' && movingKey === 'api'}
                      />
                    )}
                  </BoardColumn>

                  <BoardColumn
                    title="Review"
                    count={reviewCount}
                    onAdd="Add card"
                    highlight
                    innerRef={reviewDropRef}
                  >
                    {landingPos === 'review' && (
                      <TaskCard
                        title="Landing page copy"
                        tone="low"
                        person={PEOPLE.rahulya}
                        innerRef={movingKey === 'landing' ? landingReviewRef : undefined}
                        faded={phase === 'flying' && movingKey === 'landing'}
                        landed={phase === 'to' && movingKey === 'landing'}
                      />
                    )}
                    {apiPos === 'review' && (
                      <TaskCard
                        title="Write API docs"
                        tone="medium"
                        person={PEOPLE.joey}
                        innerRef={movingKey === 'api' ? apiReviewRef : undefined}
                        faded={phase === 'flying' && movingKey === 'api'}
                        landed={phase === 'to' && movingKey === 'api'}
                      />
                    )}
                    <TaskCard
                      title="Pricing page"
                      tone="design"
                      person={PEOPLE.sarah}
                      comments={1}
                    />
                  </BoardColumn>

                  <BoardColumn
                    title="Done"
                    count={doneCount}
                    onAdd="Add card"
                    innerRef={doneDropRef}
                  >
                    {landingPos === 'done' && (
                      <TaskCard
                        title="Landing page copy"
                        tone="done"
                        person={PEOPLE.rahulya}
                        completed
                        innerRef={movingKey === 'landing' ? landingDoneRef : undefined}
                        faded={phase === 'flying' && movingKey === 'landing'}
                        landed={phase === 'to' && movingKey === 'landing'}
                      />
                    )}
                    <TaskCard title="Wireframes" tone="done" completed />
                    <TaskCard title="Set up repo" tone="done" completed />
                  </BoardColumn>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/35 sm:px-4">
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#7C6FF7]" />
                  4 lists · 9 cards
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Updated just now
                </span>
              </div>
            </div>
          </div>

          {/* Drag ghost */}
          {ghost && ghostMeta && (
            <div
              className="pointer-events-none absolute z-30"
              style={{
                left: ghost.left,
                top: ghost.top,
                width: ghost.width,
                transform: `translate3d(${flying ? ghost.dx : 0}px, ${flying ? ghost.dy : 0}px, 0)`,
                transition: 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div className="relative -rotate-2 scale-[1.035] rounded-[9px] border border-[#7C6FF7] bg-[#171722] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(124,111,247,0.35)]">
                <p className="text-[13px] font-medium leading-[1.35] text-white/95">{ghostMeta.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-flex items-center rounded border px-1.5 py-[2px] text-[11px] font-medium ${PRIORITY_STYLES[ghostMeta.tone]}`}>
                    {ghostMeta.tone === 'medium' ? 'Medium' : 'Low'}
                  </span>
                  <Avatar person={ghostMeta.person} size={17} />
                </div>

                <div className="absolute -bottom-3.5 -right-2 flex items-center gap-1 rounded-full border border-white/20 bg-[#7C6FF7] px-1.5 py-0.5 text-[11px] font-medium text-white shadow-lg">
                  <svg className="h-2.5 w-2.5 -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.1 2.5a.75.75 0 0 1 1-.4l16.5 7.5a.75.75 0 0 1 0 1.4l-6.5 2.9-3 6.5a.75.75 0 0 1-1.4 0l-7.5-16.5a.75.75 0 0 1 .9-1.4Z" />
                  </svg>
                  Rahulya
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floor reflection */}
        <div className="pointer-events-none mx-auto h-16 w-[88%] rounded-b-[40px] bg-[#7C6FF7]/[0.045] blur-2xl" />
      </div>
    </div>
  )
}

function RailButton({ label, children }) {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-md text-white/25"
      title={label}
    >
      {children}
    </span>
  )
}

function PlusIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CommentIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  )
}

function GridIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function CalendarIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
    </svg>
  )
}

function SearchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function InboxIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M4 13h5l2 3h2l2-3h5" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </svg>
  )
}

function VideoIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10 5-3v10l-5-3" />
    </svg>
  )
}
