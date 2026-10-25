import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { login, sendLoginOtp, verifyLoginOtp, googleLogin } from '../api'
import { useAuth } from '../context/AuthContext'
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal'
import AuthShell, {
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
  authTextLinkClass,
} from '../components/auth/AuthShell'

function LoginPage() {
  const [loginMethod, setLoginMethod] = useState('password') // 'password' | 'otp'
  const [identifier, setIdentifier]   = useState('')
  const [password, setPassword]       = useState('')
  
  // OTP states
  const [otpStep, setOtpStep]         = useState('request') // 'request' | 'verify'
  const [otp, setOtp]                 = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const [error, setError]             = useState('')
  const [successMsg, setSuccessMsg]   = useState('')
  const [loading, setLoading]         = useState(false)

  // Forgot Password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const { loginUser } = useAuth()
  const navigate      = useNavigate()

  const redirectAfterLogin = () => {
    const pendingToken = sessionStorage.getItem('pendingInviteToken')
    if (pendingToken) {
      navigate(`/invite/${pendingToken}`)
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Standard Password Login Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await login({ identifier, password })
      loginUser(res.data.user, res.data.token)
      redirectAfterLogin()
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or server error')
    } finally {
      setLoading(false)
    }
  }

  // Request Login OTP Submit
  const handleRequestLoginOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!identifier.trim()) {
      setError('Please enter your email address or username')
      return
    }

    setLoading(true)
    try {
      const res = await sendLoginOtp({ identifier: identifier.trim() })
      setOtpStep('verify')
      setSuccessMsg(res.data.message || 'One-time login code sent to your email!')
      setResendCooldown(30)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send login code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Resend Login OTP
  const handleResendLoginOtp = async () => {
    if (resendCooldown > 0) return
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await sendLoginOtp({ identifier: identifier.trim() })
      setSuccessMsg(res.data.message || 'New login code sent!')
      setResendCooldown(30)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  // Verify Login OTP Submit
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit login code')
      return
    }

    setLoading(true)
    try {
      const res = await verifyLoginOtp({
        identifier: identifier.trim(),
        otp: otp.trim()
      })
      loginUser(res.data.user, res.data.token)
      redirectAfterLogin()
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired login code')
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
      loginUser(res.data.user, res.data.token)
      redirectAfterLogin()
    } catch (err) {
      setError(err.response?.data?.error || 'Google Authentication failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      <AuthShell
        mode="login"
        title="Welcome back"
        subtitle="Sign in to pick up where your team left off."
      >
        <div className="flex flex-col gap-6">
          {/* Password / OTP switcher */}
          <div className="flex rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setError(''); setSuccessMsg('') }}
              className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-all cursor-pointer ${
                loginMethod === 'password'
                  ? 'bg-[#7C6FF7] text-white shadow-[0_8px_24px_-10px_rgba(124,111,247,0.9)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); setOtpStep('request'); setError(''); setSuccessMsg('') }}
              className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-all cursor-pointer ${
                loginMethod === 'otp'
                  ? 'bg-[#7C6FF7] text-white shadow-[0_8px_24px_-10px_rgba(124,111,247,0.9)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Email code
            </button>
          </div>

          {/* Success / Notification */}
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

          {/* METHOD 1: Password Login */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={authLabelClass}>Email or username</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@company.com or username"
                  autoComplete="username"
                  required
                  className={authInputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className={authLabelClass}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={`${authTextLinkClass} text-[11px] cursor-pointer`}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={authInputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${authPrimaryButtonClass} mt-1`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}

          {/* METHOD 2: Email OTP Login */}
          {loginMethod === 'otp' && (
            otpStep === 'request' ? (
              <form onSubmit={handleRequestLoginOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={authLabelClass}>Account email or username</label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@company.com or username"
                    autoComplete="username"
                    required
                    className={authInputClass}
                  />
                  <p className="mt-1 text-[11px] leading-relaxed text-white/30">
                    We will send a one-time 6-digit login code to your registered email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`${authPrimaryButtonClass} mt-1`}
                >
                  {loading ? 'Sending code...' : 'Send login code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className={authLabelClass}>6-digit login code</label>
                    <button
                      type="button"
                      onClick={() => { setOtpStep('request'); setError(''); setSuccessMsg('') }}
                      className={`${authTextLinkClass} text-[11px] cursor-pointer`}
                    >
                      Change email
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
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
                  {loading ? 'Verifying...' : 'Verify and sign in'}
                </button>

                <div className="mt-1 text-center text-[11px] text-white/30">
                  <span>Didn&apos;t receive the code? </span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendLoginOtp}
                    className="font-medium text-[#C3BBFF] transition-colors hover:text-white disabled:no-underline disabled:opacity-50 cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
                  </button>
                </div>
              </form>
            )
          )}
        </div>

        <div className="auth-google-block mt-7 flex flex-col gap-5">
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
              onError={() => setError('Google Sign-In failed or was closed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>
        </div>
      </AuthShell>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  )
}

export default LoginPage
