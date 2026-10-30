import { Avatar } from './Avatar'
import { PEOPLE } from './mockData'
import Reveal from './Reveal'

const FEATURES = [
  {
    title: 'Calls on the board.',
    description: 'Start a V-Chat, share your screen, and get straight back to the work.',
    visual: VChatVisual,
    accent: '#69DB7C',
  },
  {
    title: 'Talk where the card is.',
    description: 'Comments, @mentions, and replies stay attached to the work.',
    visual: CommentsVisual,
    accent: '#7C6FF7',
  },
  {
    title: 'Access, set once.',
    description: 'Invite by link or username, then pick a role. It applies immediately.',
    visual: AccessVisual,
    accent: '#F5A524',
  },
  {
    title: 'Find it before you ask.',
    description: 'One field searches every board and card. Notifications stay quiet.',
    visual: SearchVisual,
    accent: '#4ECDC4',
  },
]

const FEATURE_BORDERS = [
  'border-b border-white/[0.06] sm:border-r',
  'border-b border-white/[0.06]',
  'border-b border-white/[0.06] sm:border-b-0 sm:border-r',
  '',
]

export default function FeatureGrid() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0.004))]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[620px] -translate-x-1/2 rounded-full bg-[#7C6FF7]/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#4ECDC4]/[0.05] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="relative grid sm:grid-cols-2">
        {FEATURES.map((feature, index) => (
          <Reveal
            key={feature.title}
            from={index % 2 === 0 ? 'left' : 'right'}
            delay={(index % 2) * 90}
            className={FEATURE_BORDERS[index]}
          >
            <FeatureCard
              index={index}
              title={feature.title}
              description={feature.description}
              visual={feature.visual}
              accent={feature.accent}
              flip={index % 2 === 1}
            />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ index, title, description, visual: Visual, accent, flip }) {
  return (
    <article
      className={`group relative p-5 transition-colors duration-300 hover:bg-white/[0.015] sm:p-6 xl:grid xl:min-h-[250px] xl:items-center xl:gap-7 xl:p-7 ${
        flip
          ? 'xl:grid-cols-[1fr_0.9fr]'
          : 'xl:grid-cols-[0.9fr_1fr]'
      }`}
    >
      <div className={flip ? 'xl:order-2' : ''}>
        <div className="flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 rounded-full ring-4 ring-white/[0.02]"
            style={{ backgroundColor: accent }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
            0{index + 1}
          </span>
        </div>

        <h3 className="mt-3 font-display text-[20px] font-medium leading-[1.2] tracking-[-0.025em] text-white/90 transition-colors duration-300 group-hover:text-white">
          {title}
        </h3>
        <p className="mt-2.5 max-w-[245px] text-[13px] leading-[1.65] text-white/45 transition-colors duration-300 group-hover:text-white/60">
          {description}
        </p>
      </div>

      <div className={`mt-6 xl:mt-0 ${flip ? 'xl:order-1' : ''}`}>
        <TiltedCard accent={accent} className="h-[186px] xl:h-[198px]">
          <Visual />
        </TiltedCard>
      </div>
    </article>
  )
}

function TiltedCard({ accent, className = '', children }) {
  return (
    <div aria-hidden="true" className={`relative [perspective:1100px] ${className}`}>
      <div className="relative h-full transition-transform duration-500 ease-out [transform:rotateY(5deg)_rotateX(1.5deg)] group-hover:[transform:rotateY(2.5deg)_rotateX(0.5deg)]">
        {/* Offset slab peeking out from behind, like a stacked card. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-[6px] translate-y-[8px] rounded-[15px] border"
          style={{ backgroundColor: `${accent}1f`, borderColor: `${accent}33` }}
        />

        <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] border border-white/[0.09] bg-[#0B0B10] p-3 shadow-[0_26px_50px_-30px_rgba(0,0,0,1)]">
          <div className="landing-visual-grid pointer-events-none absolute inset-0 opacity-35" />

          <div className="relative flex h-full flex-col justify-center opacity-90 transition-opacity duration-500 group-hover:opacity-100">
            {children}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[15px] ring-1 ring-inset ring-white/[0.035]" />
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </div>
    </div>
  )
}

const PARTICIPANTS = [
  { person: PEOPLE.sarah, speaking: true, muted: false },
  { person: PEOPLE.joey, speaking: false, muted: false },
  { person: PEOPLE.rahulya, speaking: false, muted: true },
]

function VChatVisual() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          <span className="landing-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          V-Chat live
        </span>
        <span className="text-[11px] text-white/30">3 in call</span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {PARTICIPANTS.map(({ person, speaking, muted }) => (
          <div
            key={person.id}
            className={`relative flex h-[64px] flex-col items-center justify-center rounded-lg border ${
              speaking
                ? 'border-emerald-400/30 bg-emerald-400/[0.05]'
                : 'border-white/[0.07] bg-white/[0.025]'
            }`}
          >
            <Avatar person={person} size={24} />
            <span className="mt-1 w-full truncate px-1 text-center text-[11px] font-medium text-white/55">
              {person.name}
            </span>
            <span
              className={`absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded ${
                muted ? 'bg-[#FF6B6B]/15 text-[#FF9B9B]' : 'bg-white/[0.06] text-white/35'
              }`}
            >
              {muted ? <MicOffIcon /> : <MicIcon />}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <ControlButton>
            <MicIcon />
          </ControlButton>
          <ControlButton>
            <CamIcon />
          </ControlButton>
          <ControlButton active>
            <ShareIcon />
          </ControlButton>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FF6B6B]/20 bg-[#FF6B6B]/[0.08] px-2 py-1 text-[11px] font-medium text-[#FF9B9B]">
          <PhoneOffIcon />
          Leave
        </span>
      </div>
    </>
  )
}

function CommentsVisual() {
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-white/65">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C6FF7]" />
          <span className="truncate">Checkout redesign</span>
        </span>
        <span className="shrink-0 rounded border border-[#7C6FF7]/25 bg-[#7C6FF7]/10 px-1.5 py-0.5 text-[11px] font-medium text-[#C3BBFF]">
          Review
        </span>
      </div>

      <div className="mt-2.5 flex items-start gap-2">
        <Avatar person={PEOPLE.sarah} size={22} />
        <div className="min-w-0 flex-1 rounded-lg rounded-tl-none border border-white/[0.07] bg-white/[0.03] px-2.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-white/75">Sarah Lin</span>
            <span className="text-[11px] text-white/25">2m</span>
          </div>
          <p className="mt-1 text-[12px] leading-[1.5] text-white/50">
            One more pass on the summary.{' '}
            <span className="rounded bg-[#7C6FF7]/15 px-1 py-0.5 text-[#C3BBFF]">@Rahulya</span> can
            you check?
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2 pl-7">
        <Avatar person={PEOPLE.rahulya} size={18} />
        <span className="rounded-lg rounded-tl-none border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[11px] text-white/45">
          On it — shipping tonight.
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5">
        <span className="flex-1 text-[11px] text-white/25">Reply or @mention…</span>
        <span className="flex h-5 w-5 items-center justify-center rounded bg-[#7C6FF7] text-white">
          <SendIcon />
        </span>
      </div>
    </>
  )
}

function AccessVisual() {
  const members = [
    { person: PEOPLE.rahulya, role: 'Owner', owner: true },
    { person: PEOPLE.joey, role: 'Member', owner: false },
    { person: PEOPLE.marc, role: 'Viewer', owner: false },
  ]

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <LinkIcon />
          <span className="truncate text-[11px] text-white/50">primeteam.app/invite/7c9k</span>
        </span>
        <span className="shrink-0 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[11px] font-medium text-white/50">
          Copy
        </span>
      </div>

      <div className="mt-2 space-y-1">
        {members.map(({ person, role, owner }) => (
          <div
            key={person.id}
            className="flex items-center justify-between rounded-lg border border-transparent bg-white/[0.015] px-2 py-1.5"
          >
            <span className="flex items-center gap-2">
              <Avatar person={person} size={20} />
              <span className="text-[11px] font-medium text-white/60">{person.name}</span>
            </span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${
                owner
                  ? 'border-[#7C6FF7]/25 bg-[#7C6FF7]/10 text-[#C3BBFF]'
                  : 'border-white/[0.07] bg-white/[0.03] text-white/45'
              }`}
            >
              {role}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-1.5 text-center text-[11px] text-white/25">
        Invite link joins instantly
      </p>
    </>
  )
}

function SearchVisual() {
  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border border-[#7C6FF7]/25 bg-white/[0.025] px-2.5 py-1.5">
        <SearchIcon />
        <span className="flex-1 text-[11px] text-white/55">checkout</span>
        <span className="rounded border border-white/[0.07] px-1 py-0.5 font-mono text-[11px] text-white/25">
          ⌘K
        </span>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1.5">
          <span className="flex min-w-0 items-center gap-1.5">
            <CardIcon />
            <span className="truncate text-[11px] text-white/55">
              <span className="text-white/85">Checkout</span> redesign
            </span>
          </span>
          <span className="shrink-0 text-[11px] text-white/25">Product launch</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1.5">
          <span className="flex min-w-0 items-center gap-1.5">
            <CardIcon />
            <span className="truncate text-[11px] text-white/55">
              Mobile <span className="text-white/85">checkout</span> QA
            </span>
          </span>
          <span className="shrink-0 text-[11px] text-white/25">Design sprint</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#7C6FF7]/15 bg-[#7C6FF7]/[0.06] px-2 py-1.5">
        <span className="h-1 w-1 shrink-0 rounded-full bg-[#7C6FF7]" />
        <span className="min-w-0 flex-1 truncate text-[11px] text-white/40">
          <span className="text-white/65">Joey</span> moved Checkout to Review
        </span>
        <span className="shrink-0 text-[11px] text-white/25">now</span>
      </div>
    </>
  )
}

function ControlButton({ active = false, children }) {
  return (
    <span
      className={`flex h-7 w-8 items-center justify-center rounded-md border ${
        active
          ? 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300'
          : 'border-white/[0.07] bg-white/[0.03] text-white/35'
      }`}
    >
      {children}
    </span>
  )
}

function MicIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </svg>
  )
}

function MicOffIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 9v1a3 3 0 0 0 5.1 2.1M15 9V5a3 3 0 0 0-5.9-.7" />
      <path d="M5 10a7 7 0 0 0 11.3 5.5M19 10a7 7 0 0 1-.4 2.3M12 17v4M8 21h8M2 2l20 20" />
    </svg>
  )
}

function CamIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10 5-3v10l-5-3" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function PhoneOffIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      <path d="m3 3 18 18" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h5" />
    </svg>
  )
}
