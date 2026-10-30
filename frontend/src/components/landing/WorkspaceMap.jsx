const SURFACES = [
  { title: 'Board', meta: "What's moving", color: '#7C6FF7', icon: BoardIcon },
  { title: 'Planner', meta: 'When it lands', color: '#F5A524', icon: CalendarIcon },
  { title: 'Card', meta: 'The full detail', color: '#4ECDC4', icon: CardIcon },
  { title: 'Collab', meta: 'People, together', color: '#EC4899', icon: UsersIcon },
  { title: 'V-Chat', meta: 'Face to face', color: '#69DB7C', icon: VideoIcon },
  { title: 'Lists', meta: 'Grouped and ordered', color: '#3B82F6', icon: ListIcon },
]

export default function WorkspaceMap() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px] xl:max-w-none">
      {/* Ambient stage so the map sits inside the page like the section previews. */}
      <div className="pointer-events-none absolute -inset-x-4 -inset-y-8 sm:-inset-x-6 sm:-inset-y-10 lg:-inset-x-12 lg:-inset-y-14">
        <div className="landing-visual-grid absolute inset-0 opacity-[0.32]" />
        <div className="absolute left-1/2 top-1/2 h-[78%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C6FF7]/[0.14] blur-[95px]" />
        <div className="absolute -bottom-6 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-[#7C6FF7]/[0.10] blur-[55px]" />
        <div className="absolute inset-x-10 bottom-2 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      {/* Left edge forward, right edge receding — matches the card section. */}
      <div className="relative [perspective:1600px]">
        <div className="tilt-card relative transition-transform duration-700 ease-out [transform:none] md:[transform:rotateY(8deg)_rotateX(1.5deg)] md:hover:[transform:rotateY(3deg)_rotateX(0.5deg)]">
          <div className="absolute inset-0 translate-x-[10px] translate-y-[14px] rounded-2xl border border-[#7C6FF7]/25 bg-[#7C6FF7]/[0.13] sm:translate-x-[14px] sm:translate-y-[20px]" />
          <div className="absolute inset-0 translate-x-[5px] translate-y-[7px] rounded-2xl border border-white/[0.04] bg-[#0A0A0F] sm:translate-x-[7px] sm:translate-y-[10px]" />

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0B0B11] shadow-[0_50px_120px_-45px_rgba(0,0,0,0.95),0_0_0_1px_rgba(124,111,247,0.05)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Panel header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0E0E14] px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#7C6FF7]/30 bg-[#7C6FF7]/10 text-[#B8AFFF]">
                  <BarsIcon />
                </span>
                <span className="truncate text-[12px] font-semibold text-white/85">Primeteam</span>
                <span className="hidden truncate font-mono text-[9px] uppercase tracking-[0.14em] text-white/25 sm:inline">
                  Product launch / Q4
                </span>
              </div>
              <span className="shrink-0 rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] text-white/35">
                6 surfaces
              </span>
            </div>

            {/* Surface grid */}
            <div className="grid grid-cols-2 gap-px bg-white/[0.05] sm:grid-cols-3">
              {SURFACES.map((surface) => (
                <div
                  key={surface.title}
                  className="group bg-[#0B0B11] p-3.5 transition-colors duration-300 hover:bg-[#101018]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-transform duration-300 group-hover:scale-110"
                      style={{
                        color: surface.color,
                        backgroundColor: `${surface.color}14`,
                        borderColor: `${surface.color}33`,
                      }}
                    >
                      <surface.icon />
                    </span>
                    <span className="truncate text-[11px] font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
                      {surface.title}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-[10px] leading-[1.5] text-white/35 transition-colors duration-300 group-hover:text-white/50">
                    {surface.meta}
                  </p>
                </div>
              ))}
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-[#0E0E14] px-4 py-2.5">
              <span className="flex min-w-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
                <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate">Same work, every view</span>
              </span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-white/25">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BarsIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 18V9M10 18V5M16 18v-6M22 18V7" />
    </svg>
  )
}

function BoardIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="5" height="16" rx="1.2" />
      <rect x="10" y="4" width="5" height="10" rx="1.2" />
      <rect x="17" y="4" width="4" height="13" rx="1.2" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h5M8 13h8M8 17h4" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
      <circle cx="9" cy="7" r="3.2" />
      <path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16.5 4.2a3.2 3.2 0 0 1 0 6.1" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10 5-3v10l-5-3" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6h12M9 12h12M9 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  )
}
