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
    <div aria-hidden="true" className="relative">
      <div className="absolute inset-x-6 -bottom-2 top-4 rounded-2xl border border-white/[0.04] bg-[#0C0C11]" />
      <div className="absolute inset-x-3 -bottom-1 top-2 rounded-2xl border border-white/[0.05] bg-[#0E0E14]" />

      <div className="relative overflow-hidden rounded-2xl border border-[#2A2A38] bg-[#1C1C24] shadow-[0_35px_100px_-35px_rgba(0,0,0,0.95)]">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#2A2A38] bg-[#161620] px-4 py-2.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#3A3A4D] bg-[#252533] px-2.5 py-1.5 text-[12px] font-semibold">
              <span className="text-purple-400">Done</span>
              <ChevronDownIcon className="h-2.5 w-2.5 text-gray-400" />
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-xl border border-[#3A3A4D]/50 bg-[#252533]/60 px-2 py-1 text-[11px] font-medium text-gray-400 sm:flex">
              <ClockIcon className="h-2.5 w-2.5 text-gray-500" />
              Created 16 Aug 2026, 01:06
            </span>
            <TrashIcon className="h-3.5 w-3.5 text-gray-500" />
            <XIcon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Main card details */}
          <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
            {/* Title */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400">
                <CheckIcon className="h-3 w-3" />
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <h3 className="truncate text-[18px] font-bold tracking-[-0.01em] text-white">
                  Checkout redesign
                </h3>
                <PencilIcon className="h-3 w-3 shrink-0 text-gray-500" />
              </div>
            </div>

            {/* Action pills */}
            <div className="flex flex-wrap items-center gap-1">
              <ActionPill icon={<UsersIcon />} label="Members" />
              <ActionPill icon={<TagIcon />} label="Labels" />
              <ActionPill icon={<CalendarIcon />} label="Dates" />
              <ActionPill icon={<ChecklistIcon />} label="Checklist" />
              <ActionPill icon={<PaperclipIcon />} label="Attachment" />
            </div>

            {/* Members, labels, due date */}
            <div className="flex flex-wrap items-start gap-x-3 gap-y-3 pt-0.5">
              <div>
                <span className="block text-[11px] font-semibold uppercase text-gray-400">Members</span>
                <div className="mt-1 flex items-center">
                  {MEMBERS.map((person, index) => (
                    <span
                      key={person.id}
                      className={`flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-[#161620] bg-[#121218] p-0.5 ${
                        index > 0 ? '-ml-2' : ''
                      }`}
                      style={{ zIndex: MEMBERS.length - index }}
                    >
                      <img src={person.avatar} alt="" className="h-full w-full rounded-full object-contain" />
                    </span>
                  ))}
                  <span className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#161620] bg-[#252538] text-[11px] font-bold text-purple-300">
                    +1
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase text-gray-400">Labels</span>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {LABELS.map((label) => (
                    <span
                      key={label.name}
                      className="rounded-lg px-1.5 py-[3px] text-[11px] font-semibold text-white shadow-sm"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-semibold uppercase text-gray-400">Due Date</span>
                <span className="mt-1 inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-300 shadow-sm">
                  <CheckIcon className="h-2.5 w-2.5" />
                  24 Aug
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <DescriptionIcon className="h-3.5 w-3.5" />
                  <span className="text-[13px] font-bold">Description</span>
                </div>
                <span className="rounded-xl border border-[#3A3A4D] bg-[#252533] px-2 py-1 text-[11px] font-semibold text-gray-300">
                  Edit
                </span>
              </div>
              <div className="min-h-[56px] rounded-2xl border border-[#2A2A38] bg-[#121218] p-3 text-[12px] leading-[1.6] text-gray-400">
                A two-step checkout for returning customers, with clear recovery when a payment fails.
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <ChecklistIcon className="h-3.5 w-3.5" />
                  <span className="text-[13px] font-bold">Launch checklist</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-purple-400">2/3 (67%)</span>
                  <span className="rounded-lg bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400">
                    Delete
                  </span>
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full border border-[#2A2A38] bg-[#121218]">
                <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-purple-500 to-emerald-400" />
              </div>

              <div className="space-y-1.5">
                {CHECKLIST.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[#2A2A38] bg-[#121218] px-2.5 py-1.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <GripIcon className="h-2.5 w-2.5 shrink-0 text-gray-500/50" />
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-md border-2 ${
                          item.done
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                            : 'border-gray-600 text-transparent'
                        }`}
                      >
                        <CheckIcon className="h-2 w-2" />
                      </span>
                      <span className={`truncate text-[11px] ${item.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                        {item.label}
                      </span>
                    </div>
                    <XIcon className="h-2.5 w-2.5 shrink-0 text-gray-500/60" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex-1 rounded-xl border border-[#2A2A38] bg-[#121218] px-2.5 py-1.5 text-[11px] text-gray-500">
                  Add an item...
                </div>
                <span className="rounded-xl border-2 border-purple-500 px-2.5 py-1 text-[11px] font-bold text-purple-300">
                  Add
                </span>
              </div>
            </div>

          </div>

          {/* Comments and activity */}
          <aside className="hidden w-[260px] shrink-0 flex-col justify-between border-l border-[#2A2A38] bg-[#161620] p-4 sm:flex">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#2A2A38] pb-3">
                <div className="flex min-w-0 items-center gap-1.5 text-gray-300">
                  <CommentIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap text-[12px] font-bold text-gray-200">Comments and activity</span>
                </div>
                <span className="shrink-0 rounded-xl border border-[#3A3A4D] bg-[#252533] px-1.5 py-1 text-[11px] font-semibold text-gray-300">
                  Hide details
                </span>
              </div>

              <div className="min-h-[56px] rounded-xl border border-[#2A2A38] bg-[#121218] p-3 text-[11px] text-gray-500">
                Write a comment...
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-[#2A2A38]/50 bg-[#121218]/60 p-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-purple-500/40 bg-[#121218] p-0.5">
                  <img src={PEOPLE.joey.avatar} alt="" className="h-full w-full rounded-full object-contain" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] leading-tight text-gray-400">
                    <span className="font-semibold text-gray-200">Joey</span> added this card to{' '}
                    <span className="font-medium text-purple-300">Done</span>
                  </p>
                  <span className="text-[11px] text-gray-500">18 Aug, 11:20</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-purple-500/40 bg-[#121218] p-0.5">
                  <img src={PEOPLE.sarah.avatar} alt="" className="h-full w-full rounded-full object-contain" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-gray-200">Sarah</span>
                    <span className="text-[11px] text-gray-500">2h</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-[1.5] text-gray-400">
                    Two-step flow is ready. QA on Safari is the last step.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#2A2A38] pt-3">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Saved
              </span>
              <span className="rounded-xl border-2 border-purple-500 px-3 py-1 text-[11px] font-bold text-purple-300">
                Done
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function ActionPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-[#2A2A38] bg-[#121218] px-2 py-1.5 text-[11px] font-semibold text-gray-300">
      {icon}
      {label}
    </span>
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

