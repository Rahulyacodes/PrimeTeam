import { PEOPLE } from './mockData'

const LABELS = [
  { name: 'High Priority', color: '#F97316' },
  { name: 'In Progress', color: '#3B82F6' },
  { name: 'Tech Debt', color: '#8B5CF6' },
]

const CHECKLIST = [
  { label: 'Audit current checkout', done: true },
  { label: 'Design failure states', done: true },
  { label: 'QA on mobile Safari', done: false },
]

const MEMBERS = [PEOPLE.rahulya, PEOPLE.joey, PEOPLE.sarah]

export default function CardDetailPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[680px] xl:max-w-none">
      {/* Ambient stage so the card sits inside the page instead of floating on it. */}
      <div className="pointer-events-none absolute -inset-x-4 -inset-y-8 sm:-inset-x-6 sm:-inset-y-10 lg:-inset-x-12 lg:-inset-y-14">
        <div className="landing-visual-grid absolute inset-0 opacity-[0.32]" />
        <div className="absolute left-1/2 top-1/2 h-[78%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C6FF7]/[0.14] blur-[95px]" />
        <div className="absolute -bottom-6 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-[#7C6FF7]/[0.10] blur-[55px]" />
        <div className="absolute inset-x-10 bottom-2 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      <div className="relative [perspective:1500px]">
        <div className="tilt-card relative transition-transform duration-700 ease-out [transform:none] md:[transform:rotateY(8deg)_rotateX(1.5deg)] md:hover:[transform:rotateY(3deg)_rotateX(0.5deg)]">
          {/* Offset slab peeking out from behind, in the app accent. */}
          <div className="absolute inset-0 translate-x-[10px] translate-y-[14px] rounded-[20px] border border-[#7C6FF7]/25 bg-[#7C6FF7]/[0.13] sm:translate-x-[14px] sm:translate-y-[20px]" />
          <div className="absolute inset-0 translate-x-[5px] translate-y-[7px] rounded-[20px] border border-white/[0.04] bg-[#0A0A0F] sm:translate-x-[7px] sm:translate-y-[10px]" />

          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#101016] shadow-[0_50px_120px_-45px_rgba(0,0,0,0.95),0_0_0_1px_rgba(124,111,247,0.05)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#14141B] px-4 py-2.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400/25 bg-purple-500/[0.10] px-2.5 py-1 text-[11px] font-semibold text-purple-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Done
                  <ChevronDownIcon className="h-2.5 w-2.5 text-purple-300/50" />
                </span>
                <span className="hidden truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/25 md:inline">
                  Product launch
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="hidden items-center gap-1.5 rounded-lg border border-white/[0.05] bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-white/35 sm:flex">
                  <ClockIcon className="h-2.5 w-2.5 text-white/25" />
                  16 Aug, 01:06
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-white/25">
                  <TrashIcon className="h-3 w-3" />
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-white/35">
                  <XIcon className="h-3 w-3" />
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row">
              {/* Main card details */}
              <div className="min-w-0 flex-1 space-y-5 p-4 sm:p-5">
                {/* Title */}
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/[0.12] text-emerald-300">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <h3 className="truncate text-[18px] font-semibold tracking-[-0.01em] text-white">
                      Checkout redesign
                    </h3>
                    <PencilIcon className="h-3 w-3 shrink-0 text-white/25" />
                  </div>
                </div>

                {/* Action pills */}
                <div className="flex flex-wrap items-center gap-0.5">
                  <ActionPill icon={<UsersIcon />} label="Members" />
                  <ActionPill icon={<TagIcon />} label="Labels" />
                  <ActionPill icon={<CalendarIcon />} label="Dates" />
                  <ActionPill icon={<ChecklistIcon />} label="Checklist" />
                  <ActionPill icon={<PaperclipIcon />} label="Attachment" />
                </div>

                {/* Members, due date, labels */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                    <div>
                      <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">Members</span>
                      <div className="mt-1.5 flex items-center">
                        {MEMBERS.map((person, index) => (
                          <span
                            key={person.id}
                            className={`flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-[#101016] bg-[#0A0A0F] p-0.5 ${
                              index > 0 ? '-ml-2' : ''
                            }`}
                            style={{ zIndex: MEMBERS.length - index }}
                          >
                            <img src={person.avatar} alt="" className="h-full w-full rounded-full object-contain" />
                          </span>
                        ))}
                        <span className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#101016] bg-white/[0.06] text-[10px] font-semibold text-purple-300">
                          +1
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">Due</span>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-500/[0.12] px-2 py-[3px] text-[10px] font-semibold text-emerald-300">
                        <CheckIcon className="h-2.5 w-2.5" />
                        24 Aug
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">Labels</span>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {LABELS.map((label) => (
                        <span
                          key={label.name}
                          className="rounded-md px-1.5 py-[3px] text-[10px] font-semibold"
                          style={{ backgroundColor: `${label.color}22`, color: label.color }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/35">
                      <DescriptionIcon className="h-3 w-3" />
                      <span className="text-[11px] font-semibold text-white/65">Description</span>
                    </div>
                    <span className="text-[10px] font-medium text-white/30">Edit</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0B11] px-3 py-2.5 text-[11.5px] leading-[1.65] text-white/55">
                    A two-step checkout for returning customers, with clear recovery when a payment fails.
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/35">
                      <ChecklistIcon className="h-3 w-3" />
                      <span className="text-[11px] font-semibold text-white/65">Launch checklist</span>
                    </div>
                    <span className="font-mono text-[10px] font-medium text-purple-300/80">2/3 · 67%</span>
                  </div>

                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-purple-500 to-emerald-400/90" />
                  </div>

                  <div className="space-y-1.5">
                    {CHECKLIST.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-[#0B0B11] px-2.5 py-1.5"
                      >
                        <GripIcon className="h-2.5 w-2.5 shrink-0 text-white/20" />
                        <span
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border ${
                            item.done
                              ? 'border-purple-400/70 bg-purple-500/20 text-purple-300'
                              : 'border-white/20 text-transparent'
                          }`}
                        >
                          <CheckIcon className="h-2 w-2" />
                        </span>
                        <span className={`truncate text-[11px] ${item.done ? 'text-white/30 line-through' : 'text-white/70'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="flex-1 rounded-lg border border-white/[0.06] bg-[#0B0B11] px-2.5 py-1.5 text-[10.5px] text-white/25">
                      Add an item...
                    </div>
                    <span className="rounded-lg border border-purple-400/40 bg-purple-500/[0.10] px-2.5 py-1 text-[10px] font-semibold text-purple-200">
                      Add
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments and activity */}
              <aside className="hidden w-[252px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0C0C12] md:flex">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <div className="flex items-center gap-1.5 text-white/35">
                    <CommentIcon className="h-3 w-3" />
                    <span className="text-[11px] font-semibold text-white/65">Comments &amp; activity</span>
                  </div>
                  <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-medium text-white/35">5</span>
                </div>

                <div className="flex-1 space-y-4 p-4">
                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0B11] px-3 py-2.5">
                    <p className="text-[10.5px] text-white/25">Write a comment...</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[9px] text-white/20">@ to mention</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/[0.15] text-purple-300">
                        <ArrowUpIcon />
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    <ActivityRow avatar={PEOPLE.sarah.avatar} name="Sarah" time="2h ago">
                      Two-step flow is ready. QA on Safari is the last step.
                    </ActivityRow>
                    <ActivityRow avatar={PEOPLE.rahulya.avatar} name="Rahulya" time="Yesterday">
                      attached <span className="text-white/65">checkout-spec.pdf</span>
                    </ActivityRow>
                    <ActivityRow avatar={PEOPLE.sarah.avatar} name="Sarah" time="17 Aug">
                      set the due date to <span className="text-emerald-300">24 Aug</span>
                    </ActivityRow>
                    <ActivityRow avatar={PEOPLE.joey.avatar} name="Joey" time="18 Aug · 11:20">
                      moved this card to <span className="text-purple-300">Done</span>
                    </ActivityRow>
                    <ActivityRow avatar={PEOPLE.rahulya.avatar} name="Rahulya" time="16 Aug · 01:06">
                      created this card
                    </ActivityRow>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-300/80">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    Saved
                  </span>
                  <span className="rounded-lg border border-purple-400/30 bg-purple-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-purple-200">
                    Done
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-white/[0.06] bg-white/[0.025] px-[4.5px] py-1 text-[10px] font-medium text-white/50">
      {icon}
      {label}
    </span>
  )
}

function ActivityRow({ avatar, name, time, children }) {
  return (
    <div className="flex items-start gap-2.5 py-3 first:pt-0 last:pb-0">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-[#0A0A0F] p-0.5">
        <img src={avatar} alt="" className="h-full w-full rounded-full object-contain" />
      </span>
      <div className="min-w-0">
        <p className="text-[10.5px] leading-[1.5] text-white/50">
          <span className="font-medium text-white/75">{name}</span> {children}
        </p>
        <span className="mt-1 block text-[9px] text-white/30">{time}</span>
      </div>
    </div>
  )
}

function ArrowUpIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function ChevronDownIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ClockIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function TrashIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function XIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PencilIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function DescriptionIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="21" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="3" y2="18" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ChecklistIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function PaperclipIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function GripIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  )
}

function CommentIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

