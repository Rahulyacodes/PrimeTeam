import { Avatar } from './Avatar'
import { PEOPLE } from './mockData'

export default function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FeatureCard
        title="Calls on the board."
        description="Start a V-Chat, share your screen, and get straight back to the work."
      >
        <VChatVisual />
      </FeatureCard>

      <FeatureCard
        title="Talk where the card is."
        description="Comments, @mentions, and replies stay attached to the work."
      >
        <CommentsVisual />
      </FeatureCard>

      <FeatureCard
        title="Access, set once."
        description="Invite by link or username, then pick a role. It applies immediately."
      >
        <AccessVisual />
      </FeatureCard>

      <FeatureCard
        title="Find it before you ask."
        description="One field searches every board and card. Notifications stay quiet."
      >
        <SearchVisual />
      </FeatureCard>
    </div>
  )
}

function FeatureCard({ title, description, children }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.012] transition-colors duration-300 hover:border-white/[0.16]">
      <div className="relative flex h-[220px] overflow-hidden border-b border-white/[0.06] bg-[#09090D] p-4">
        <div className="landing-visual-grid absolute inset-0 opacity-45" />
        <div className="relative flex w-full flex-col justify-center" aria-hidden="true">
          {children}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[18px] font-medium leading-[1.3] tracking-[-0.02em] text-white">
          {title}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.7] text-white/55">{description}</p>
      </div>
    </article>
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
