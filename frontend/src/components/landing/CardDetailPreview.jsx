import { Avatar, AvatarStack } from './Avatar'
import { PEOPLE } from './mockData'

const CHECKLIST = [
  { label: 'Map payment edge cases', done: true },
  { label: 'Update empty states', done: true },
  { label: 'QA on mobile Safari', done: true },
  { label: 'Copy review', done: false },
  { label: 'Analytics events', done: false },
]

export default function CardDetailPreview() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute inset-x-6 bottom-[-10px] top-4 rounded-xl border border-white/[0.045] bg-[#0C0C11]" />
      <div className="absolute inset-x-3 bottom-[-5px] top-2 rounded-xl border border-white/[0.06] bg-[#0E0E14]" />

      <div className="relative overflow-hidden rounded-xl border border-white/[0.09] bg-[#101017] shadow-[0_35px_100px_-35px_rgba(0,0,0,0.9)]">
        {/* Modal header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#121219] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="rounded-md border border-[#7C6FF7]/20 bg-[#7C6FF7]/10 px-2 py-1 text-[9px] font-medium text-[#C3BBFF]">
              Review
            </span>
            <span className="truncate text-[9.5px] text-white/25">Product launch / Checkout redesign</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[8.5px] text-white/20 sm:inline">Created Aug 12</span>
            <span className="flex h-5 w-5 items-center justify-center rounded text-white/25">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_178px]">
          {/* Main */}
          <div className="p-4">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#69DB7C]/60 bg-[#69DB7C]/10 text-[#69DB7C]">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-white">
                  Checkout redesign
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  <LabelChip className="border-[#4ECDC4]/25 bg-[#4ECDC4]/10 text-[#7EE5DE]">Design</LabelChip>
                  <LabelChip className="border-[#7C6FF7]/25 bg-[#7C6FF7]/10 text-[#C3BBFF]">Q4 launch</LabelChip>
                  <LabelChip className="border-[#FF6B6B]/25 bg-[#FF6B6B]/10 text-[#FFA0A0]">High priority</LabelChip>
                </div>
              </div>
            </div>

            {/* Action row */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <ActionChip icon={<UsersIcon />} label="Members" />
              <ActionChip icon={<TagIcon />} label="Labels" />
              <ActionChip icon={<CalendarIcon />} label="Dates" />
              <ActionChip icon={<ChecklistIcon />} label="Checklist" />
              <ActionChip icon={<PaperclipIcon />} label="Attach" />
            </div>

            <div className="mt-4">
              <p className="text-[8.5px] font-medium uppercase tracking-[0.14em] text-white/25">Description</p>
              <p className="mt-1.5 text-[10.5px] leading-[1.65] text-white/50">
                Rework the checkout flow so returning customers can pay in two steps. Keep the order summary
                visible through the whole flow, and make failure states recoverable.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#0D0D13] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ChecklistIcon className="h-3 w-3 text-[#B8AFFF]" />
                  <span className="text-[10px] font-medium text-white/80">Launch checklist</span>
                </div>
                <span className="font-mono text-[8.5px] text-white/30">3 / 5</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[60%] rounded-full bg-[#7C6FF7]" />
              </div>
              <div className="mt-2.5 space-y-1.5">
                {CHECKLIST.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span
                      className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border ${
                        item.done
                          ? 'border-[#7C6FF7]/50 bg-[#7C6FF7]/20 text-[#C3BBFF]'
                          : 'border-white/10 bg-transparent'
                      }`}
                    >
                      {item.done && (
                        <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-[9.5px] ${item.done ? 'text-white/35 line-through' : 'text-white/55'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Attachment label="checkout-spec.pdf" />
              <Attachment label="figma.com/file/checkout" />
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <div className="flex items-start gap-2">
                <Avatar person={PEOPLE.joey} size={20} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-medium text-white/80">Joey Tribbiani</span>
                    <span className="text-[8px] text-white/25">1h ago</span>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-white/45">
                    Copy is ready for a final pass. <span className="rounded bg-[#7C6FF7]/10 px-1 text-[#C3BBFF]">@Rahulya</span> can you
                    check the error states?
                  </p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="rounded border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 text-[8px] text-white/35">👍 2</span>
                    <span className="rounded border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 text-[8px] text-white/35">👀 1</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-md border border-white/[0.07] bg-[#0D0D13] px-2.5 py-1.5">
                <span className="flex-1 text-[9px] text-white/20">Write a comment or @mention…</span>
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#7C6FF7] text-white">
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden border-l border-white/[0.06] bg-[#0D0D13] p-3.5 sm:block">
            <SidebarLabel>Members</SidebarLabel>
            <div className="mt-2 flex items-center justify-between">
              <AvatarStack people={[PEOPLE.rahulya, PEOPLE.joey]} size={20} />
              <span className="text-[8.5px] text-white/25">2 assigned</span>
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <SidebarLabel>Due date</SidebarLabel>
              <div className="mt-1.5 flex items-center justify-between rounded-md border border-[#F5A524]/20 bg-[#F5A524]/[0.06] px-2 py-1.5">
                <span className="text-[9px] font-medium text-[#F5C56B]">Fri, Oct 24</span>
                <CalendarIcon className="h-3 w-3 text-[#F5C56B]" />
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <SidebarLabel>Priority</SidebarLabel>
              <div className="mt-1.5 flex items-center gap-1.5 rounded-md border border-[#FF6B6B]/20 bg-[#FF6B6B]/[0.06] px-2 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B6B]" />
                <span className="text-[9px] font-medium text-[#FFA0A0]">High</span>
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <SidebarLabel>List</SidebarLabel>
              <div className="mt-1.5 rounded-md border border-white/[0.07] bg-[#15151E] px-2 py-1.5 text-[9px] text-white/55">
                Review
              </div>
            </div>

            <div className="mt-5">
              <SidebarLabel>Add to card</SidebarLabel>
              <div className="mt-1.5 space-y-0.5">
                {['Members', 'Labels', 'Checklist', 'Attachment'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[9px] text-white/35">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function LabelChip({ children, className }) {
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-[2px] text-[8px] font-medium ${className}`}>
      {children}
    </span>
  )
}

function ActionChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-[#15151E] px-2 py-1 text-[8.5px] font-medium text-white/40">
      {icon}
      {label}
    </span>
  )
}

function Attachment({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[8.5px] text-white/35">
      <PaperclipIcon className="h-2.5 w-2.5" />
      {label}
    </span>
  )
}

function SidebarLabel({ children }) {
  return <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/25">{children}</p>
}

function UsersIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  )
}

function CalendarIcon({ className = 'h-2.5 w-2.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
    </svg>
  )
}

function ChecklistIcon({ className = 'h-2.5 w-2.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5h11M9 12h11M9 19h11" />
      <path d="m4 5 1 1 2-2M4 12l1 1 2-2M4 19l1 1 2-2" />
    </svg>
  )
}

function PaperclipIcon({ className = 'h-2.5 w-2.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}
