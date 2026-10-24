import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { StatusBarsLogo } from '../components/common/StatusBarsLogo'
import LandingNav from '../components/landing/LandingNav'
import HeroBoard from '../components/landing/HeroBoard'
import PlannerPreview from '../components/landing/PlannerPreview'
import CardDetailPreview from '../components/landing/CardDetailPreview'
import FeatureGrid from '../components/landing/FeatureGrid'
import Reveal from '../components/landing/Reveal'

const CAPABILITIES = ['Boards', 'Planner', 'Comments', 'Huddles', 'Roles', 'Search']

const PRINCIPLES = [
  {
    number: '01',
    title: 'Quiet by default.',
    body: 'No notification theatre. No badge storms. The work is here when you need it, and quiet when you do not.',
  },
  {
    number: '02',
    title: 'Fast is a feature.',
    body: 'Boards open instantly, cards move on the first drag, and nothing important waits behind a spinner.',
  },
  {
    number: '03',
    title: 'One place, not five.',
    body: 'Planning, conversation, and calls sit next to the work they belong to. No tab-hopping required.',
  },
]

function LandingPage() {
  const { user } = useAuth()

  return (
    <div id="top" className="relative isolate min-h-screen overflow-x-clip bg-[#08080B] font-sans text-white selection:bg-[#7C6FF7]/30 selection:text-white">
      {/* Background texture */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 95% 55% at 50% 0%, black 8%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 95% 55% at 50% 0%, black 8%, transparent 78%)',
          }}
        />
        <div className="absolute left-1/2 top-[-260px] h-[540px] w-[920px] -translate-x-1/2 rounded-full bg-[#7C6FF7]/[0.085] blur-[130px]" />
      </div>

      <LandingNav />

      <main className="relative z-10 pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 sm:pt-20 lg:pb-20 lg:pt-24">
          <div className="max-w-[930px]">
            <div className="landing-fade-up inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C6FF7]" />
              Project workspace for small teams
            </div>

            <h1
              className="landing-fade-up mt-7 font-display text-[46px] font-medium leading-[0.98] tracking-[-0.05em] text-white sm:text-[64px] lg:text-[84px]"
              style={{ animationDelay: '60ms' }}
            >
              A board that
              <br />
              <span className="text-[#B7ADF6]">gets out of the way.</span>
            </h1>

            <p
              className="landing-fade-up mt-7 max-w-[590px] text-[15px] leading-[1.75] text-white/55 sm:text-[16px]"
              style={{ animationDelay: '120ms' }}
            >
              Boards for the work. A planner for the week. Conversation where it belongs.
              PrimeTeam is one quiet place for teams that would rather ship than administrate.
            </p>

            <div
              className="landing-fade-up mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '180ms' }}
            >
              <Link
                to={user ? '/' : '/register'}
                className="inline-flex items-center gap-2 rounded-lg bg-[#EDEBFA] px-5 py-3 text-[13.5px] font-medium text-[#0B0B10] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080B]"
              >
                {user ? 'Open dashboard' : 'Start for free'}
                <ArrowIcon />
              </Link>
              <a
                href="#product"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.025] px-5 py-3 text-[13.5px] font-medium text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7]"
              >
                See how it works
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </a>
            </div>

            <p
              className="landing-fade-up mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30"
              style={{ animationDelay: '240ms' }}
            >
              Free forever <span className="px-1.5 text-white/10">·</span> No credit card
              <span className="px-1.5 text-white/10">·</span> Under 60 seconds to set up
            </p>
          </div>

          {/* Board preview */}
          <div className="landing-fade-up mt-14 sm:mt-16" style={{ animationDelay: '300ms' }}>
            <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
              <span className="flex items-center gap-2">
                <span className="landing-live-dot h-1 w-1 rounded-full bg-emerald-400" />
                Live board preview
              </span>
              <span className="hidden sm:inline">Product launch / Q4</span>
            </div>
            <HeroBoard />
          </div>
        </section>

        {/* Capability strip */}
        <div className="border-y border-white/[0.06] bg-white/[0.008]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">
              Inside PrimeTeam
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {CAPABILITIES.map((capability) => (
                <span key={capability} className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
                  {capability}
                </span>
              ))}
            </div>
            <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.14em] text-white/20 sm:inline">
              One workspace. No add-ons.
            </span>
          </div>
        </div>

        {/* Product intro */}
        <div id="product" className="scroll-mt-[88px]">
          <section className="mx-auto max-w-[1180px] px-6 pb-6 pt-20 sm:pt-24">
            <Reveal>
              <SectionLabel number="01" label="Inside the workspace" />
              <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <h2 className="max-w-[620px] font-display text-[34px] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-[46px]">
                  The work, without the busywork.
                </h2>
                <p className="max-w-[440px] text-[14px] leading-[1.75] text-white/50 lg:justify-self-end">
                  Two views carry the week. The board shows what is moving. The planner shows when.
                  Everything else lives one click away, not one tab away.
                </p>
              </div>
            </Reveal>
          </section>

          {/* Planner */}
          <section id="planner" className="mx-auto max-w-[1180px] scroll-mt-[88px] px-6 py-16 sm:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <Reveal className="min-w-0">
                <SectionLabel number="02" label="The week" />
                <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.06] tracking-[-0.035em] text-white sm:text-[42px]">
                  See the week before it sees you.
                </h2>
                <p className="mt-5 max-w-[420px] text-[14px] leading-[1.75] text-white/50">
                  Every card with a date lands on the planner automatically. Overdue work surfaces first,
                  today stays obvious, and the rest of the week is right there.
                </p>
                <ul className="mt-7 space-y-3">
                  <FeaturePoint>Overdue, today, and later — grouped without filters.</FeaturePoint>
                  <FeaturePoint>Complete a task without leaving the calendar.</FeaturePoint>
                  <FeaturePoint>One week across every board you are part of.</FeaturePoint>
                </ul>
              </Reveal>

              <Reveal delay={100} className="min-w-0">
                <PlannerPreview />
              </Reveal>
            </div>
          </section>

          {/* Card detail */}
          <section id="details" className="mx-auto max-w-[1180px] scroll-mt-[88px] px-6 py-16 sm:py-20">
            <div className="grid items-center gap-12 xl:grid-cols-[1.2fr_0.8fr] xl:gap-16">
              <Reveal delay={100} className="order-2 mx-auto min-w-0 w-full max-w-[720px] xl:order-1 xl:max-w-none">
                <CardDetailPreview />
              </Reveal>

              <Reveal className="order-1 min-w-0 xl:order-2">
                <SectionLabel number="03" label="The card" />
                <h2 className="mt-5 font-display text-[32px] font-medium leading-[1.06] tracking-[-0.035em] text-white sm:text-[42px]">
                  The whole story, on one card.
                </h2>
                <p className="mt-5 max-w-[420px] text-[14px] leading-[1.75] text-white/50">
                  Assign an owner, set a date, attach the brief. Break the work into a checklist, leave a
                  comment, and move it forward — without opening another app.
                </p>
                <ul className="mt-7 space-y-3">
                  <FeaturePoint>Assignees, labels, due dates, and attachments.</FeaturePoint>
                  <FeaturePoint>Checklists and comments that travel with the card.</FeaturePoint>
                  <FeaturePoint>Move between lists without losing context.</FeaturePoint>
                </ul>
              </Reveal>
            </div>
          </section>

          {/* Supporting features */}
          <section className="border-t border-white/[0.06]">
            <div className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
              <Reveal>
                <SectionLabel number="04" label="The rest of the kit" />
                <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
                  <h2 className="max-w-[520px] font-display text-[34px] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-[46px]">
                    Small features. Fewer tabs.
                  </h2>
                  <p className="max-w-[430px] text-[14px] leading-[1.75] text-white/50 lg:justify-self-end">
                    The things you would normally bolt on live where the work already is. No integrations
                    to wire up, no second inbox to check.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={100} className="mt-10">
                <FeatureGrid />
              </Reveal>
            </div>
          </section>
        </div>

        {/* Principles */}
        <section id="principles" className="scroll-mt-[88px] border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1180px] px-6 py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <SectionLabel number="05" label="Principles" />
                <h2 className="mt-5 max-w-[520px] font-display text-[34px] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-[46px]">
                  Software should feel like a tool.
                  <span className="block text-white/30">Not another place to check.</span>
                </h2>
              </Reveal>

              <Reveal delay={100}>
                <div className="border-t border-white/[0.07]">
                  {PRINCIPLES.map((principle) => (
                    <div key={principle.number} className="grid grid-cols-[40px_1fr] gap-4 border-b border-white/[0.07] py-6 sm:grid-cols-[56px_1fr]">
                      <span className="font-mono text-[10px] text-white/20">{principle.number}</span>
                      <div>
                        <h3 className="font-display text-[17px] font-medium tracking-[-0.02em] text-white/85">
                          {principle.title}
                        </h3>
                        <p className="mt-2 max-w-[460px] text-[13px] leading-[1.7] text-white/45">
                          {principle.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden border-t border-white/[0.06]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 70% 90% at 30% 50%, black 10%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 30% 50%, black 10%, transparent 75%)',
            }}
          />
          <div className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-[0.045] lg:block">
            <StatusBarsLogo size={460} />
          </div>

          <div className="relative mx-auto max-w-[1180px] px-6 py-24 sm:py-32">
            <Reveal>
              <SectionLabel number="06" label="Start here" />
              <h2 className="mt-5 max-w-[720px] font-display text-[40px] font-medium leading-[1.02] tracking-[-0.045em] text-white sm:text-[60px]">
                Give your team a quieter week.
              </h2>
              <p className="mt-5 max-w-[520px] text-[14px] leading-[1.75] text-white/50">
                Create a board, invite the people who need it, and move the first card. That is the
                whole setup.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link
                  to={user ? '/' : '/register'}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#EDEBFA] px-5 py-3 text-[13.5px] font-medium text-[#0B0B10] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080B]"
                >
                  {user ? 'Open your dashboard' : 'Create your first board'}
                  <ArrowIcon />
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.025] px-5 py-3 text-[13.5px] font-medium text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    Sign in
                  </Link>
                )}
              </div>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                Free forever <span className="px-1.5 text-white/10">·</span> No credit card
                <span className="px-1.5 text-white/10">·</span> No setup call
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5 text-white" aria-label="PrimeTeam home">
                <StatusBarsLogo size={24} />
                <span className="font-display text-[16px] font-semibold tracking-[-0.02em]">PrimeTeam</span>
              </Link>
              <p className="mt-4 max-w-[240px] text-[12px] leading-[1.7] text-white/35">
                A quieter place to plan the week, move the work, and keep the team close.
              </p>
            </div>

            <FooterColumn title="Product">
              <FooterLink href="#product">Overview</FooterLink>
              <FooterLink href="#planner">Planner</FooterLink>
              <FooterLink href="#details">Cards</FooterLink>
              <FooterLink href="#principles">Principles</FooterLink>
            </FooterColumn>

            <FooterColumn title="Account">
              {user ? (
                <>
                  <FooterLink to="/">Dashboard</FooterLink>
                  <FooterLink to="/settings">Settings</FooterLink>
                </>
              ) : (
                <>
                  <FooterLink to="/login">Sign in</FooterLink>
                  <FooterLink to="/register">Create account</FooterLink>
                </>
              )}
              <FooterLink href="mailto:primeteam.security@gmail.com">Contact us</FooterLink>
            </FooterColumn>

            <FooterColumn title="Elsewhere">
              <FooterLink href="https://github.com/Rahulyacodes" external>
                GitHub
              </FooterLink>
              <FooterLink to={user ? '/' : '/register'}>Get started</FooterLink>
              <FooterLink href="#top">Back to top</FooterLink>
            </FooterColumn>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} PrimeTeam. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5">
              <span>Built for teams, by</span>
              <a
                href="https://github.com/Rahulyacodes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/50 hover:text-white transition-colors"
                title="GitHub @Rahulyacodes"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionLabel({ number, label }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
      <span className="text-[#B7ADF6]/80">{number}</span>
      <span className="h-px w-5 bg-[#7C6FF7]/50" />
      <span>{label}</span>
    </div>
  )
}

function FeaturePoint({ children }) {
  return (
    <li className="flex items-start gap-3 text-[13px] leading-[1.65] text-white/50">
      <span className="mt-[7px] flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border border-[#7C6FF7]/30 bg-[#7C6FF7]/10">
        <svg className="h-1.5 w-1.5 text-[#B7ADF6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      {children}
    </li>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, to, external = false, children }) {
  const className = 'text-[12px] text-white/50 transition-colors hover:text-white'

  if (to) {
    return (
      <li>
        <Link to={to} className={className}>
          {children}
        </Link>
      </li>
    )
  }

  return (
    <li>
      <a
        href={href}
        className={`${className} inline-flex items-center gap-1.5`}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {external && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        )}
      </a>
    </li>
  )
}

export default LandingPage
