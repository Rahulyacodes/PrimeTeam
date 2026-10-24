import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatusBarsLogo } from '../common/StatusBarsLogo'

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Planner', href: '#planner' },
  { label: 'Details', href: '#details' },
  { label: 'Principles', href: '#principles' },
]

export default function LandingNav() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function closeOnResize() {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('resize', closeOnResize)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('resize', closeOnResize)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#08080B]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7]"
          aria-label="PrimeTeam home"
        >
          <StatusBarsLogo size={25} />
          <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white">
            PrimeTeam
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-white/45 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#EDEBFA] px-4 py-2 text-[14px] font-medium text-[#0B0B10] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080B]"
            >
              Open dashboard
              <ArrowIcon />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-2 py-2 text-[14px] text-white/50 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[#EDEBFA] px-4 py-2 text-[14px] font-medium text-[#0B0B10] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080B]"
              >
                Start free
                <ArrowIcon />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div id="landing-mobile-menu" className="border-t border-white/[0.06] bg-[#08080B]/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            {user ? (
              <Link
                to="/"
                onClick={closeMenu}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EDEBFA] px-4 py-2.5 text-sm font-medium text-[#0B0B10]"
              >
                Open dashboard
                <ArrowIcon />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EDEBFA] px-4 py-2.5 text-sm font-medium text-[#0B0B10]"
                >
                  Start free
                  <ArrowIcon />
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
