import { Avatar } from './Avatar'
import { PEOPLE } from './mockData'

export default function FeatureGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FeatureCard
        index="01"
        title="Calls without the calendar link."
        description="Start a huddle from any board, share a screen, and drop out when you're done. No invite, no room code, no tab graveyard."
      >
        <HuddleVisual />
      </FeatureCard>

      <FeatureCard
        index="02"
        title="Talk where the card is."
        description="Mentions, replies, and reactions stay attached to the work. The conversation has a home, and it isn't another channel."
      >
        <CommentsVisual />
      </FeatureCard>

      <FeatureCard
        index="03"
        title="The right access, set once."
        description="Invite by link or username. Admin, member, or viewer — permissions apply immediately and stay out of the way."
      >
        <AccessVisual />
      </FeatureCard>

      <FeatureCard
        index="04"
        title="Find it before you ask."
        description="Search every board and card from one field. Notifications tell you what changed, not everything that happened."
      >
        <SearchVisual />
      </FeatureCard>
    </div>
  )
}

function FeatureCard({ index, title, description, children }) {
  return (
    <article className="group flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.012] p-4 transition-colors duration-300 hover:border-white/[0.14]">
      <div className="relative mb-5 h-[150px] overflow-hidden rounded-lg border border-white/[0.05] bg-[#09090D]">
        <div className="landing-visual-grid absolute inset-0 opacity-[0.55]" />
        <div className="relative flex h-full flex-col justify-center p-3.5">{children}</div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[16px] font-medium tracking-[-0.02em] text-white/90">{title}</h3>
          <p className="mt-2 max-w-[42ch] text-[11.5px] leading-[1.7] text-white/50">{description}</p>
        </div>
        <span className="mt-0.5 font-mono text-[9px] text-white/20">{index}</span>
      </div>
    </article>
  )
}

function HuddleVisual() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-medium text-emerald-300">
          <span className="landing-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Huddle live · 3
        </span>
        <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-white/20">Board call</span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {[
          { person: PEOPLE.sarah, active: true, muted: false },
          { person: PEOPLE.joey, active: false, muted: false },
          { person: PEOPLE.rahulya, active: false, muted: true },
        ].map(({ person, active, muted }) => (
          <div
            key={person.id}
            className={`relative flex h-[56px] flex-col items-center justify-center rounded-md border bg-[#111117] ${
              active ? 'border-emerald-500/50' : 'border-white/[0.06]'
            }`}
          >
            <Avatar person={person} size={22} />
            <span className="mt-1 max-w-full truncate px-1 text-[7.5px] text-white/45">{person.name}</span>
            <span
              className={`absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-sm ${
                muted ? 'bg-[#FF6B6B]/15 text-[#FF9B9B]' : 'bg-white/[0.06] text-white/35'
              }`}
            >
              {muted ? <MicOffIcon /> : <MicIcon />}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1">
        {[<MicIcon key="mic" />, <CamIcon key="cam" />, <ShareIcon key="share" />].map((icon, i) => (
          <span
            key={i}
            className={`flex h-5 w-6 items-center justify-center rounded border ${
              i === 2
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-white/[0.07] bg-white/[0.03] text-white/30'
            }`}
          >
            {icon}
          </span>
        ))}
        <span className="flex h-5 w-6 items-center justify-center rounded border border-[#FF6B6B]/25 bg-[#FF6B6B]/10 text-[#FF9B9B]">
          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
          </svg>
        </span>
      </div>
    </>
  )
}

function CommentsVisual() {
  return (
    <>
      <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-[#111117] px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7C6FF7]" />
          <span className="text-[8.5px] font-medium text-white/60">Checkout redesign</span>
        </div>
        <span className="rounded border border-[#7C6FF7]/20 bg-[#7C6FF7]/10 px-1.5 py-0.5 text-[7px] text-[#C3BBFF]">
          Review
        </span>
      </div>

      <div className="mt-2 flex items-start gap-1.5">
        <Avatar person={PEOPLE.sarah} size={18} />
        <div className="min-w-0 flex-1 rounded-md rounded-tl-none border border-white/[0.07] bg-[#15151E] px-2.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-medium text-white/70">Sarah Lin</span>
            <span className="text-[7px] text-white/20">2m</span>
          </div>
          <p className="mt-1 text-[8.5px] leading-relaxed text-white/45">
            The new summary needs one more pass. <span className="rounded bg-[#7C6FF7]/10 px-1 text-[#C3BBFF]">@Rahulya</span> can you
            take a look?
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <span className="rounded border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 text-[7.5px] text-white/35">👍 2</span>
            <span className="rounded border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 text-[7.5px] text-white/35">✅ 1</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-[#0E0E14] px-2 py-1.5">
        <span className="flex-1 text-[8px] text-white/20">Reply or @mention…</span>
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#7C6FF7] text-white">
          <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </>
  )
}

function AccessVisual() {
  const members = [
    { person: PEOPLE.rahulya, role: 'Admin', tone: 'border-[#7C6FF7]/25 bg-[#7C6FF7]/10 text-[#C3BBFF]' },
    { person: PEOPLE.joey, role: 'Member', tone: 'border-white/[0.07] bg-white/[0.03] text-white/45' },
    { person: PEOPLE.marc, role: 'Viewer', tone: 'border-white/[0.07] bg-white/[0.03] text-white/45' },
  ]

  return (
    <>
      <div className="flex items-center justify-between rounded-md border border-white/[0.07] bg-[#111117] px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <LockIcon />
          <span className="text-[8px] text-white/45">primeteam.app/invite/7c9k</span>
        </div>
        <span className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[7.5px] font-medium text-white/50">
          Copy
        </span>
      </div>

      <div className="mt-2 space-y-1">
        {members.map((member) => (
          <div key={member.person.id} className="flex items-center justify-between rounded border border-transparent px-1 py-1">
            <div className="flex items-center gap-2">
              <Avatar person={member.person} size={18} />
              <span className="text-[8.5px] font-medium text-white/60">{member.person.name}</span>
            </div>
            <span className={`rounded border px-1.5 py-0.5 text-[7px] font-medium ${member.tone}`}>{member.role}</span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 border-t border-white/[0.05] pt-1.5 text-center text-[7.5px] text-white/25">
        Anyone with the link can view
      </div>
    </>
  )
}

function SearchVisual() {
  return (
    <>
      <div className="flex items-center gap-1.5 rounded-md border border-[#7C6FF7]/25 bg-[#0E0E14] px-2.5 py-1.5">
        <SearchIcon />
        <span className="flex-1 text-[8.5px] text-white/55">checkout</span>
        <span className="rounded border border-white/[0.07] px-1 py-0.5 font-mono text-[7px] text-white/25">⌘K</span>
      </div>

      <div className="mt-1.5 space-y-1">
        <div className="flex items-center justify-between rounded border border-white/[0.05] bg-[#111117] px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <CardIcon />
            <span className="truncate text-[8.5px] text-white/55">
              <span className="text-white/85">Checkout</span> redesign
            </span>
          </div>
          <span className="shrink-0 text-[7px] text-white/20">Product launch</span>
        </div>
        <div className="flex items-center justify-between rounded border border-white/[0.05] bg-[#111117] px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <CardIcon />
            <span className="truncate text-[8.5px] text-white/55">
              Mobile <span className="text-white/85">checkout</span> QA
            </span>
          </div>
          <span className="shrink-0 text-[7px] text-white/20">Design sprint</span>
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 rounded border border-[#7C6FF7]/15 bg-[#7C6FF7]/[0.06] px-2 py-1.5">
        <span className="h-1 w-1 rounded-full bg-[#7C6FF7]" />
        <span className="text-[7.5px] text-white/40">
          <span className="text-white/65">Joey</span> moved Checkout redesign to Review
        </span>
        <span className="ml-auto text-[7px] text-white/20">now</span>
      </div>
    </>
  )
}

function MicIcon() {
  return (
    <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </svg>
  )
}

function MicOffIcon() {
  return (
    <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 9v1a3 3 0 0 0 5.1 2.1M15 9V5a3 3 0 0 0-5.9-.7" />
      <path d="M5 10a7 7 0 0 0 11.3 5.5M19 10a7 7 0 0 1-.4 2.3M12 17v4M8 21h8M2 2l20 20" />
    </svg>
  )
}

function CamIcon() {
  return (
    <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10 5-3v10l-5-3" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="h-2.5 w-2.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-2.5 w-2.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg className="h-2.5 w-2.5 shrink-0 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h5" />
    </svg>
  )
}
