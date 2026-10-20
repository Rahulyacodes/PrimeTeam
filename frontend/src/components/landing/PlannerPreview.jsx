import { Avatar } from './Avatar'
import { PEOPLE } from './mockData'

const DAYS = [
  {
    day: 'Mon',
    date: '19',
    today: false,
    cards: [
      { title: 'Fix onboarding emails', board: 'Marketing', color: '#F5A524', person: PEOPLE.sarah, done: true },
      { title: 'Review pricing copy', board: 'Product', color: '#7C6FF7', person: PEOPLE.rahulya },
    ],
  },
  {
    day: 'Tue',
    date: '20',
    today: true,
    cards: [
      { title: 'Ship API docs', board: 'Product', color: '#7C6FF7', person: PEOPLE.joey, due: 'Today' },
      { title: 'Design QA', board: 'Design', color: '#4ECDC4', person: PEOPLE.marc },
    ],
  },
  {
    day: 'Wed',
    date: '21',
    today: false,
    cards: [
      { title: 'Build auth flow', board: 'Product', color: '#7C6FF7', person: PEOPLE.joey, overdue: true },
      { title: 'Write release notes', board: 'Marketing', color: '#F5A524', person: PEOPLE.sarah },
    ],
  },
  {
    day: 'Thu',
    date: '22',
    today: false,
    cards: [
      { title: 'Landing page copy', board: 'Marketing', color: '#F5A524', person: PEOPLE.rahulya },
      { title: 'Sprint review', board: 'Product', color: '#7C6FF7', person: PEOPLE.echo },
    ],
  },
  {
    day: 'Fri',
    date: '23',
    today: false,
    cards: [
      { title: 'Deploy v2.4', board: 'Product', color: '#7C6FF7', person: PEOPLE.joey },
      { title: 'Wireframes', board: 'Design', color: '#4ECDC4', person: PEOPLE.marc, done: true },
    ],
  },
]

export default function PlannerPreview() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#0B0B10] shadow-[0_35px_100px_-35px_rgba(0,0,0,0.9)]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] bg-[#0E0E14] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#7C6FF7]/25 bg-[#7C6FF7]/10 text-[#B8AFFF]">
              <CalendarIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11.5px] font-semibold text-white/90">Planner</span>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-white/[0.07] bg-[#0A0A0F] px-2 py-1 text-[10px] font-medium text-white/60">
            <span>Oct 19 – 25</span>
            <ChevronIcon className="h-2.5 w-2.5 rotate-90 text-white/30" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center rounded-md border border-white/[0.07] bg-[#0A0A0F] p-0.5 sm:flex">
              <span className="rounded bg-[#7C6FF7]/15 px-2 py-1 text-[9px] font-medium text-[#C3BBFF]">Schedule</span>
              <span className="px-2 py-1 text-[9px] text-white/30">Board</span>
            </div>
            <Avatar person={PEOPLE.rahulya} size={21} />
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.05] px-4 py-2">
          <Metric label="Overdue" value="1" tone="text-[#FF9B9B] border-[#FF6B6B]/20 bg-[#FF6B6B]/[0.06]" />
          <Metric label="Due today" value="2" tone="text-[#F5C56B] border-[#F5A524]/20 bg-[#F5A524]/[0.06]" />
          <Metric label="Done this week" value="8" tone="text-[#8BE39A] border-[#69DB7C]/20 bg-[#69DB7C]/[0.06]" />
          <span className="ml-auto hidden items-center gap-1.5 text-[9px] text-white/25 sm:flex">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            Live across 4 boards
          </span>
        </div>

        {/* Week grid */}
        <div className="overflow-x-auto p-3.5">
          <div className="grid min-w-[600px] grid-cols-5 gap-2">
            {DAYS.map((day) => (
              <div
                key={day.date}
                className={`rounded-lg border p-2 ${
                  day.today
                    ? 'border-[#7C6FF7]/30 bg-[#7C6FF7]/[0.045]'
                    : 'border-white/[0.055] bg-[#0E0E14]'
                }`}
              >
                <div className="mb-2 flex items-center justify-between px-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-[8.5px] font-medium uppercase tracking-[0.12em] ${day.today ? 'text-[#C3BBFF]' : 'text-white/35'}`}>
                      {day.day}
                    </span>
                    <span className={`font-display text-[15px] font-medium ${day.today ? 'text-white' : 'text-white/60'}`}>
                      {day.date}
                    </span>
                  </div>
                  {day.today && (
                    <span className="rounded bg-[#7C6FF7]/15 px-1 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-[#C3BBFF]">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {day.cards.map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-md border p-2 ${
                        card.done
                          ? 'border-white/[0.04] bg-[#111117]'
                          : 'border-white/[0.06] bg-[#15151E]'
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <span
                          className={`mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${card.done ? 'opacity-40' : ''}`}
                          style={{ backgroundColor: card.color }}
                        />
                        <p className={`text-[9.5px] font-medium leading-[1.35] ${card.done ? 'text-white/30 line-through' : 'text-white/80'}`}>
                          {card.title}
                        </p>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-1">
                        <span className={`text-[7.5px] uppercase tracking-[0.08em] ${card.done ? 'text-white/20' : 'text-white/25'}`}>
                          {card.board}
                        </span>
                        <div className="flex items-center gap-1">
                          {card.overdue && (
                            <span className="rounded border border-[#FF6B6B]/20 bg-[#FF6B6B]/10 px-1 py-0.5 text-[7px] font-medium text-[#FF9B9B]">
                              Overdue
                            </span>
                          )}
                          {card.due && (
                            <span className="rounded border border-[#F5A524]/20 bg-[#F5A524]/10 px-1 py-0.5 text-[7px] font-medium text-[#F5C56B]">
                              {card.due}
                            </span>
                          )}
                          {card.person && <Avatar person={card.person} size={14} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/25">This week</span>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[62%] rounded-full bg-[#7C6FF7]" />
            </div>
            <span className="text-[9px] text-white/30">8 of 13 done</span>
          </div>
          <span className="hidden items-center gap-1.5 rounded-md border border-white/[0.07] bg-[#15151E] px-2 py-1 text-[8.5px] text-white/40 sm:flex">
            <span className="h-1 w-1 rounded-full bg-[#69DB7C]" />
            Undo available
          </span>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, tone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] ${tone}`}>
      <span className="font-mono font-medium">{value}</span>
      {label}
    </span>
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

function ChevronIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
