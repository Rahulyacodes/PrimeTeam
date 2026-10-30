import { Link } from 'react-router-dom'
import { StatusBarsLogo } from '../common/StatusBarsLogo'
import { Avatar, AvatarStack } from '../landing/Avatar'
import { PEOPLE } from '../landing/mockData'

export const authLabelClass =
  'text-[11px] font-medium uppercase tracking-[0.09em] text-white/45'

export const authInputClass =
  'h-11 w-full rounded-xl border border-white/[0.08] bg-[#0F0F14] px-3.5 text-[13.5px] text-white placeholder:text-white/25 transition-colors focus:border-[#7C6FF7]/70 focus:outline-none focus:ring-2 focus:ring-[#7C6FF7]/15'

export const authPrimaryButtonClass =
  'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#7C6FF7] text-[13px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(124,111,247,0.8)] transition-all hover:bg-[#8B7DFF] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'

export const authTextLinkClass =
  'font-medium text-[#C3BBFF] transition-colors hover:text-white'

const switchCopy = {
  login: {
    prompt: 'New to PrimeTeam?',
    action: 'Create an account',
    to: '/register',
  },
  register: {
    prompt: 'Already a member?',
    action: 'Sign in',
    to: '/login',
  },
}

export default function AuthShell({ mode = 'login', title, subtitle, children }) {
  const copy = switchCopy[mode] || switchCopy.login

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080B] text-white">
      {/* Ambient page glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[#7C6FF7]/10 blur-[130px]" />
        <div className="absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full bg-[#4E3FD0]/10 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-3 sm:p-4 lg:p-4">
        <div className="grid w-full max-w-[1240px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0B0B0F] shadow-[0_50px_140px_-40px_rgba(0,0,0,0.95)] lg:h-[calc(100dvh-2rem)] lg:max-h-[740px] lg:grid-cols-[1.04fr_0.96fr]">
          <AuthVisual />

          {/* Form side */}
          <div className="relative flex flex-col bg-[#0B0B0F]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,rgba(124,111,247,0.12),transparent_72%)] lg:hidden" />

            <div className="relative flex items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-6 lg:px-9 lg:pt-6 xl:px-11">
              <Link
                to="/"
                className="flex items-center gap-2.5 lg:hidden"
                aria-label="PrimeTeam home"
              >
                <StatusBarsLogo size={27} />
                <span className="font-display text-[17px] font-medium tracking-tight text-white">
                  PrimeTeam
                </span>
              </Link>

              <p className="ml-auto flex items-center gap-1.5 text-[11.5px] text-white/35">
                <span className="hidden sm:inline">{copy.prompt}</span>
                <Link to={copy.to} className={`${authTextLinkClass} text-[12px]`}>
                  {copy.action}
                </Link>
                <ArrowIcon className="h-3 w-3 text-[#C3BBFF]/60" />
              </p>
            </div>

            <div className="auth-form-panel relative flex flex-1 flex-col justify-center px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-9 lg:pb-8 lg:pt-8 xl:px-11">
              <div className="mx-auto w-full max-w-[400px]">
                <div className="animate-auth-header">
                  <h1 className="font-display text-[30px] font-medium leading-[1.1] tracking-[-0.035em] text-white sm:text-[34px]">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="mt-2.5 max-w-[340px] text-[13px] leading-relaxed text-white/40">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="auth-form-content mt-8 animate-auth-form">{children}</div>
              </div>
            </div>

            <div className="auth-panel-footer relative flex items-center justify-between gap-3 border-t border-white/[0.05] px-5 py-3.5 text-[10px] text-white/25 sm:px-8 lg:px-9 xl:px-11">
              <span className="flex items-center gap-1.5">
                <LockIcon className="h-3 w-3" />
                Private by default
              </span>
              <span className="hidden sm:inline">Boards · Planner · V-Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthVisual() {
  return (
    <aside className="relative hidden overflow-hidden bg-[#4B3FC6] lg:flex lg:h-full lg:flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(150deg,#6A5CF0_0%,#5046D4_42%,#2B237C_100%)]" />
      <div className="absolute -left-24 -top-28 h-[440px] w-[440px] rounded-full bg-[#C0B8FF]/35 blur-[100px]" />
      <div className="absolute -right-28 top-24 h-[430px] w-[430px] rounded-full bg-[#31228F]/70 blur-[110px]" />
      <div className="absolute -bottom-32 left-8 h-[380px] w-[380px] rounded-[45%] bg-[#8B7CFF]/25 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#211B63]/70 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col p-7 xl:p-9">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2.5"
          aria-label="PrimeTeam home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.16] bg-white/[0.08]">
            <StatusBarsLogo size={24} />
          </span>
          <span className="font-display text-[18px] font-medium tracking-tight text-white">
            PrimeTeam
          </span>
        </Link>

        <div className="mt-9 max-w-[430px] xl:mt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.16] bg-white/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D8D2FF]" />
            One calm workspace
          </span>
          <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.06] tracking-[-0.04em] text-white xl:text-[38px]">
            Your team&apos;s work,
            <br />
            finally in one place.
          </h2>
          <p className="auth-visual-paragraph mt-3 max-w-[350px] text-[13px] leading-[1.65] text-white/55 xl:text-[14px]">
            Boards, planner, and V-Chat — designed to keep the signal and lose the
            noise.
          </p>
        </div>

        <div className="auth-visual-cards relative mt-6 min-h-[260px] flex-1" aria-hidden="true">
          <BoardCard />
          <ChatCard />
          <PlannerCard />
          <MentionCard />
        </div>

        <div className="auth-visual-footer mt-5 flex items-center justify-between gap-4 border-t border-white/[0.14] pt-4">
          <div className="flex items-center gap-2.5">
            <AvatarStack
              people={[PEOPLE.sarah, PEOPLE.joey, PEOPLE.marc, PEOPLE.echo]}
              size={20}
            />
            <span className="text-[10.5px] text-white/50">Built for focused teams</span>
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/35 sm:block">
            Boards · Planner · Chat
          </span>
        </div>
      </div>
    </aside>
  )
}

function BoardCard() {
  return (
    <div className="absolute left-0 top-0 z-10 w-[56%] -rotate-1 rounded-2xl border border-white/[0.13] bg-[#111118]/95 p-3.5 shadow-[0_28px_60px_-24px_rgba(8,4,36,0.85)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#7C6FF7]" />
        <span className="truncate text-[11.5px] font-semibold text-white/90">
          Website redesign
        </span>
        <span className="ml-auto shrink-0">
          <AvatarStack people={[PEOPLE.sarah, PEOPLE.joey]} size={15} />
        </span>
      </div>

      <div className="mt-3 h-px bg-white/[0.07]" />

      <div className="mt-3 space-y-2">
        <TaskRow
          title="Audit sign-up flow"
          tag="Today"
          tagClass="border-[#7C6FF7]/25 bg-[#7C6FF7]/12 text-[#C3BBFF]"
          person={PEOPLE.rahulya}
        />
        <TaskRow
          title="Polish empty states"
          tag="Review"
          tagClass="border-[#F5A524]/25 bg-[#F5A524]/12 text-[#F5C56B]"
          person={PEOPLE.sarah}
        />
        <TaskRow
          title="Ship pricing page"
          tag="Done"
          tagClass="border-[#69DB7C]/25 bg-[#69DB7C]/12 text-[#8BE39A]"
          person={PEOPLE.joey}
          done
        />
      </div>
    </div>
  )
}

function TaskRow({ title, tag, tagClass, person, done = false }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border ${
          done
            ? 'border-[#69DB7C]/35 bg-[#69DB7C]/15 text-[#8BE39A]'
            : 'border-white/15 text-transparent'
        }`}
      >
        <CheckIcon className="h-2.5 w-2.5" />
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-[11px] ${
          done ? 'text-white/30 line-through' : 'text-white/70'
        }`}
      >
        {title}
      </span>
      <span
        className={`hidden shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium sm:inline ${tagClass}`}
      >
        {tag}
      </span>
      <Avatar person={person} size={16} />
    </div>
  )
}

function ChatCard() {
  return (
    <div className="absolute right-0 top-2 z-20 w-[40%] rotate-[1.5deg] rounded-2xl border border-white/[0.13] bg-[#12121B]/95 p-3 shadow-[0_28px_60px_-24px_rgba(8,4,36,0.85)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ChatIcon className="h-3.5 w-3.5 text-[#C3BBFF]" />
          <span className="text-[11px] font-semibold text-white/85">V-Chat</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-white/35">
          <span className="h-1 w-1 rounded-full bg-[#69DB7C]" />
          Live
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <Avatar person={PEOPLE.sarah} size={18} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/45">Sarah</span>
            <span className="text-[10px] text-white/20">now</span>
          </div>
          <p className="mt-1 rounded-lg rounded-tl-sm bg-white/[0.06] px-2 py-1.5 text-[10.5px] leading-[1.45] text-white/70">
            Pricing page is ready.
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 pl-6 text-[10px] text-white/30">
        <Avatar person={PEOPLE.joey} size={13} />
        Joey is typing…
      </div>
    </div>
  )
}

function PlannerCard() {
  return (
    <div className="auth-visual-card-lower absolute bottom-0 left-[12%] z-30 w-[38%] rotate-[1deg] rounded-2xl border border-white/[0.13] bg-[#111119]/95 p-3 shadow-[0_28px_60px_-24px_rgba(8,4,36,0.85)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[10px] uppercase tracking-[0.14em] text-white/40">
          Thu · Oct 22
        </span>
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C6FF7]" />
      </div>

      <div className="mt-2.5 space-y-1.5">
        <div className="rounded-lg border border-[#F5A524]/25 bg-[#F5A524]/10 px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#F5A524]" />
            <span className="truncate text-[10.5px] font-medium text-white/80">
              Launch pricing page
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#7C6FF7]" />
            <span className="truncate text-[10.5px] text-white/55">
              Sprint review
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MentionCard() {
  return (
    <div className="auth-visual-card-lower absolute bottom-4 right-0 z-20 w-[44%] -rotate-[1.5deg] rounded-2xl border border-white/[0.13] bg-[#13131C]/95 p-3 shadow-[0_28px_60px_-24px_rgba(8,4,36,0.85)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Avatar person={PEOPLE.marc} size={18} />
        <span className="text-[10px] text-white/45">Marc commented</span>
        <span className="ml-auto shrink-0 text-[10px] text-white/25">2m</span>
      </div>
      <p className="mt-2 text-[10.5px] leading-[1.5] text-white/70">
        “Can we tighten this section?”
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <Avatar person={PEOPLE.echo} size={14} />
        <span className="rounded-full border border-[#7C6FF7]/25 bg-[#7C6FF7]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#C3BBFF]">
          @rahulya
        </span>
      </div>
    </div>
  )
}

function CheckIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function ChatIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-3.8-.8L3 21l1.9-4.6A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  )
}

function ArrowIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function LockIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
