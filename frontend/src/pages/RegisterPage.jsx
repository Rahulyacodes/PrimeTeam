import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { sendRegistrationOtp, verifyRegistrationOtp, googleLogin } from '../api'
import { useAuth } from '../context/AuthContext'
import AuthShell, {
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
  authTextLinkClass,
} from '../components/auth/AuthShell'

function RegisterPage() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' })
  const [step, setStep]       = useState('details') // 'details' | 'otp'
  const [otp, setOtp]         = useState('')
  const [error, setError]     = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Google OAuth states
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null)
  const [newGoogleUser, setNewGoogleUser]                     = useState(null)
  const [customUsername, setCustomUsername]                   = useState('')
  const [usernameError, setUsernameError]                     = useState('')
  const [usernameLoading, setUsernameLoading]                 = useState(false)

  const { loginUser } = useAuth()
  const navigate      = useNavigate()

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Single handler for all input fields
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      const res = await sendRegistrationOtp(form)
      setStep('otp')
      setSuccessMsg(res.data.message || 'Verification code sent to your email.')
      setResendCooldown(30)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await sendRegistrationOtp(form)
      setSuccessMsg(res.data.message || 'New verification code sent!')
      setResendCooldown(30)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification code.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP & Complete Account Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setLoading(true)
    try {
      const res = await verifyRegistrationOtp({
        email: form.email.trim(),
        otp: otp.trim()
      })
      loginUser(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Google Auth Response
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)

    try {
      const res = await googleLogin({ credential: credentialResponse.credential })
      
      // If user is new, open username customization modal
      if (res.data.isNewUser) {
        setPendingGoogleCredential(credentialResponse.credential)
        setNewGoogleUser(res.data.user)
        setCustomUsername(res.data.user.username)
        loginUser(res.data.user, res.data.token)
      } else {
        loginUser(res.data.user, res.data.token)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Google Sign-Up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCustomUsername = async (e) => {
    e.preventDefault()
    if (!customUsername.trim()) return
    setUsernameError('')
    setUsernameLoading(true)

    try {
      const res = await googleLogin({
        credential: pendingGoogleCredential,
        customUsername: customUsername.trim()
      })
      loginUser(res.data.user, res.data.token)
      setNewGoogleUser(null)
      navigate('/')
    } catch (err) {
      setUsernameError(err.response?.data?.error || 'Failed to update username')
    } finally {
      setUsernameLoading(false)
    }
  }


  return (
    <>
      <AuthShell
        mode="register"
        title={step === 'details' ? 'Create your account' : 'Check your email'}
        subtitle={
          step === 'details'
            ? 'Start your workspace in under a minute.'
            : 'Enter the code we sent to finish setting up your workspace.'
        }
      >
        <div className="flex flex-col gap-5">
          {/* Success / Info notification */}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-[#7C6FF7]/20 bg-[#7C6FF7]/10 p-3 text-[12px] font-medium text-[#C3BBFF]">
              <span className="text-sm">📩</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error notification */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[#FF6B6B]/20 bg-[#FF6B6B]/10 p-3 text-[12px] font-medium text-[#FFA0A0]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" />
                <line x1="12" y1="16" x2="12.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Registration Form */}
          {step === 'details' ? (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={authLabelClass}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="username"
                  required
                  className={authInputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={authLabelClass}>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  className={authInputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={authLabelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className={authInputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${authPrimaryButtonClass} mt-1`}
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending code...</span>
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center">
                <p className="text-[11px] text-white/35">Enter the 6-digit code sent to</p>
                <p className="mt-0.5 truncate text-[12.5px] font-semibold text-white/80">{form.email}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={authLabelClass}>6-digit verification code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  required
                  className={`${authInputClass} text-center font-mono text-lg tracking-widest`}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`${authPrimaryButtonClass} mt-1`}
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Complete registration'
                )}
              </button>

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-white/30 transition-colors hover:text-white/70 cursor-pointer"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  className={`${authTextLinkClass} text-[11px] cursor-pointer disabled:opacity-50`}
                >
                  {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
              or continue with
            </span>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <div className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-Up failed or was closed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="signup_with"
            />
          </div>
        </div>
      </AuthShell>

      {/* Customize Username Modal for New Google Users */}
      {newGoogleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#14141B] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              {newGoogleUser.avatar ? (
                <img src={newGoogleUser.avatar} alt="Avatar" className="h-12 w-12 rounded-full border border-[#7C6FF7]/40" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#7C6FF7]/50 bg-[#7C6FF7]/20 text-lg font-bold text-[#C3BBFF]">
                  {newGoogleUser.name?.[0] || 'U'}
                </div>
              )}
              <div>
                <h3 className="text-base font-semibold text-white">Welcome, {newGoogleUser.name || 'Friend'}! 👋</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-white/40">Choose your handle to finish setting up your workspace.</p>
              </div>
            </div>

            {usernameError && (
              <div className="rounded-xl border border-[#FF6B6B]/20 bg-[#FF6B6B]/10 p-2.5 text-xs font-medium text-[#FFA0A0]">
                {usernameError}
              </div>
            )}

            <form onSubmit={handleConfirmCustomUsername} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-white/40">
                  Username handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-[#C3BBFF]">@</span>
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0F0F14] py-2.5 pl-8 pr-3 text-sm text-white outline-none transition-colors focus:border-[#7C6FF7]/70 focus:ring-2 focus:ring-[#7C6FF7]/15"
                    placeholder="username"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-white/30">This is how teammates will mention you on boards.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 rounded-xl bg-white/[0.04] py-2.5 text-xs font-medium text-white/50 transition-all hover:bg-white/[0.08] hover:text-white/80 cursor-pointer"
                >
                  Keep @{newGoogleUser.username}
                </button>
                <button
                  type="submit"
                  disabled={usernameLoading}
                  className="flex-1 rounded-xl bg-[#7C6FF7] py-2.5 text-xs font-semibold text-white shadow-[0_12px_30px_-12px_rgba(124,111,247,0.8)] transition-all hover:bg-[#8B7DFF] disabled:opacity-50 cursor-pointer"
                >
                  {usernameLoading ? 'Saving...' : 'Save & continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default RegisterPage
