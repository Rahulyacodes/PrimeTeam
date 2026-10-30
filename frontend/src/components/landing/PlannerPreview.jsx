import { Avatar } from './Avatar'
import { PEOPLE } from './mockData'

const DAYS = [
  {
    day: 'Mon',
    date: '19',
    today: false,
    cards: [
      { title: 'Onboarding emails', board: 'Growth', color: '#F5A524', person: PEOPLE.sarah, done: true },
      { title: 'Pricing copy', board: 'Product', color: '#7C6FF7', person: PEOPLE.rahulya },
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
      { title: 'Release notes', board: 'Growth', color: '#F5A524', person: PEOPLE.sarah },
    ],
  },
  {
    day: 'Thu',
    date: '22',
    today: false,
    cards: [
      { title: 'Landing copy', board: 'Growth', color: '#F5A524', person: PEOPLE.rahulya },
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
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[760px] xl:max-w-none">
      {/* Ambient stage so the planner sits inside the page like the card preview. */}
      <div className="pointer-events-none absolute -inset-x-4 -inset-y-8 sm:-inset-x-6 sm:-inset-y-10 lg:-inset-x-12 lg:-inset-y-14">
        <div className="landing-visual-grid absolute inset-0 opacity-[0.32]" />
        <div className="absolute left-1/2 top-1/2 h-[78%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C6FF7]/[0.14] blur-[95px]" />
        <div className="absolute -bottom-6 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-[#7C6FF7]/[0.10] blur-[55px]" />
        <div className="absolute inset-x-10 bottom-2 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      <div className="relative [perspective:1500px]">
        <div className="tilt-card relative transition-transform duration-700 ease-out [transform:none] md:[transform:rotateY(-8deg)_rotateX(1.5deg)] md:hover:[transform:rotateY(-3deg)_rotateX(0.5deg)]">
          {/* Offset slab peeking out from behind, mirrored for this section. */}
          <div className="absolute inset-0 -translate-x-[10px] translate-y-[14px] rounded-xl border border-[#7C6FF7]/25 bg-[#7C6FF7]/[0.13] sm:-translate-x-[14px] sm:translate-y-[20px]" />
          <div className="absolute inset-0 -translate-x-[5px] translate-y-[7px] rounded-xl border border-white/[0.04] bg-[#0A0A0F] sm:-translate-x-[7px] sm:translate-y-[10px]" />

          <div className="relative overflow-hidden rounded-xl border border-white/[0.09] bg-[#0B0B10] shadow-[0_40px_110px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(124,111,247,0.05)]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] bg-[#0E0E14] px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#7C6FF7]/25 bg-[#7C6FF7]/10 text-[#B8AFFF]">
                  <CalendarIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-[13px] font-semibold text-white/90">Planner</span>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-white/[0.07] bg-[#0A0A0F] px-2 py-1 text-[11px] font-medium text-white/60">
                <span>Oct 19 – 25</span>
                <ChevronIcon className="h-2.5 w-2.5 rotate-90 text-white/30" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden items-center rounded-md border border-white/[0.07] bg-[#0A0A0F] p-0.5 sm:flex">
                  <span className="rounded bg-[#7C6FF7]/15 px-2 py-1 text-[11px] font-medium text-[#C3BBFF]">Schedule</span>
                  <span className="px-2 py-1 text-[11px] text-white/40">Board</span>
                </div>
                <Avatar person={PEOPLE.rahulya} size={21} />
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-white/[0.05] px-3.5 py-2 text-[11px] text-white/40">
              <span>
                <span className="font-medium text-[#FF9B9B]">1</span> overdue
              </span>
              <span>
                <span className="font-medium text-[#F5C56B]">2</span> due today
              </span>
              <span>
                <span className="font-medium text-[#8BE39A]">8</span> done this week
              </span>
            </div>

            {/* Week grid */}
            <div className="overflow-x-auto p-3">
              <div className="grid min-w-[600px] grid-cols-5 gap-2">
                {DAYS.map((day) => (
                  <div
                    key={day.date}
                    className={`rounded-lg border p-2 ${
                      day.today
                        ? 'border-[#7C6FF7]/35 bg-[#7C6FF7]/[0.045]'
                        : 'border-white/[0.055] bg-[#0E0E14]'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between px-0.5">
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                          day.today ? 'text-[#C3BBFF]' : 'text-white/40'
                        }`}
                      >
                        {day.today && <span className="h-1 w-1 rounded-full bg-[#7C6FF7]" />}
                        {day.day}
                      </span>
                      <span
                        className={`font-display text-[15px] font-medium ${
                          day.today ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {day.date}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {day.cards.map((card) => (
                        <PlannerCard key={card.title} card={card} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-3.5 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="h-1 w-20 shrink-0 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-[62%] rounded-full bg-[#7C6FF7]" />
                </div>
                <span className="whitespace-nowrap text-[11px] text-white/40">8 of 13 done</span>
              </div>
              <span className="hidden items-center gap-1.5 text-[10px] text-white/30 sm:flex">
                <span className="h-1 w-1 rounded-full bg-[#69DB7C]" />
                Undo available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlannerCard({ card }) {
  const status = card.overdue ? 'Overdue' : card.due || null

  const cardTone = card.overdue
    ? 'border-[#FF6B6B]/25 bg-[#FF6B6B]/[0.035]'
    : card.due
      ? 'border-[#F5A524]/20 bg-[#F5A524]/[0.03]'
      : card.done
        ? 'border-white/[0.04] bg-[#111117]'
        : 'border-white/[0.06] bg-[#15151E]'

  const statusTone = card.overdue
    ? 'text-[#FF9B9B]'
    : card.due
      ? 'text-[#F5C56B]'
      : card.done
        ? 'text-white/25'
        : 'text-white/35'

  return (
    <div className={`flex h-[74px] flex-col rounded-md border p-2.5 ${cardTone}`}>
      <div className="flex items-start gap-1.5">
        <span
          className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${card.done ? 'opacity-40' : ''}`}
          style={{ backgroundColor: card.color }}
        />
        <p
          className={`line-clamp-2 text-[11.5px] font-medium leading-[1.4] ${
            card.done ? 'text-white/30 line-through' : 'text-white/80'
          }`}
        >
          {card.title}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-1.5">
        <span className={`truncate text-[10px] font-medium uppercase tracking-[0.06em] ${statusTone}`}>
          {status || card.board}
        </span>
        <Avatar person={card.person} size={16} />
      </div>
    </div>
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
