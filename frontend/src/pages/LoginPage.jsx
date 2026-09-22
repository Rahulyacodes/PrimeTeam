import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { login, sendLoginOtp, verifyLoginOtp, googleLogin } from '../api'
import { useAuth } from '../context/AuthContext'
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal'
import { StatusBarsLogo } from '../components/common/StatusBarsLogo'

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

  // Google OAuth states
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null)
  const [newGoogleUser, setNewGoogleUser]                     = useState(null)
  const [customUsername, setCustomUsername]                   = useState('')
  const [usernameError, setUsernameError]                     = useState('')
  const [usernameLoading, setUsernameLoading]                 = useState(false)

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
      
      // If user is new, open username customization modal
      if (res.data.isNewUser) {
        setPendingGoogleCredential(credentialResponse.credential)
        setNewGoogleUser(res.data.user)
        setCustomUsername(res.data.user.username)
        loginUser(res.data.user, res.data.token)
      } else {
        loginUser(res.data.user, res.data.token)
        redirectAfterLogin()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Google Authentication failed')
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
      redirectAfterLogin()
    } catch (err) {
      setUsernameError(err.response?.data?.error || 'Failed to update username')
    } finally {
      setUsernameLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-auth-glow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-auth-glow" />

      {/* Main card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-bg-surface border border-bg-border shadow-2xl shadow-black/50 backdrop-blur-xl relative z-10 flex flex-col gap-6 animate-auth-card">
        
        {/* Header / Logo */}
        <div className="text-center flex flex-col items-center gap-2 animate-auth-header">
          <StatusBarsLogo size={52} className="mb-1" />
          <h1 className="text-2xl font-bold tracking-tight text-white">PrimeTeam</h1>
          <p className="text-sm text-[#8B8B9E]">Welcome back! Sign in to your workspace</p>
        </div>

        {/* Form Body with Staggered Entrance */}
        <div className="flex flex-col gap-6 animate-auth-form">
          {/* Tab Switcher (Password Default vs OTP Code Add-on) */}
          <div className="flex bg-[#0F0F13] p-1 rounded-xl border border-[#2A2A35]">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setError(''); setSuccessMsg('') }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                loginMethod === 'password'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-[#8B8B9E] hover:text-white'
              }`}
            >
              Password Sign-In
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); setOtpStep('request'); setError(''); setSuccessMsg('') }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                loginMethod === 'otp'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-[#8B8B9E] hover:text-white'
              }`}
            >
              Email OTP Sign-In
            </button>
          </div>

          {/* Success / Notification */}
          {successMsg && (
            <div className="p-3.5 rounded-xl text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-2">
              <span>📩</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error notification */}
          {error && (
            <div className="p-3.5 rounded-xl text-sm font-medium bg-danger/10 border border-danger/30 text-danger flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12"/>
                <line x1="12" y1="16" x2="12.01"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* METHOD 1: Password Login */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                  Email or Username
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 cursor-pointer mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In with Password'}
              </button>
            </form>
          )}

          {/* METHOD 2: Email OTP Login */}
          {loginMethod === 'otp' && (
            otpStep === 'request' ? (
              <form onSubmit={handleRequestLoginOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                    Account Email or Username
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@company.com or username"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                  <p className="text-[11px] text-[#8B8B9E] mt-0.5">
                    We will send a one-time 6-digit login code to your registered email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 cursor-pointer mt-2"
                >
                  {loading ? 'Sending code...' : 'Send Login Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                      6-Digit Login Code
                    </label>
                    <button
                      type="button"
                      onClick={() => { setOtpStep('request'); setError(''); setSuccessMsg('') }}
                      className="text-xs text-purple-400 hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-center text-lg tracking-widest font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 cursor-pointer mt-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Log In'}
                </button>

                <div className="text-center text-xs text-[#8B8B9E] mt-1">
                  <span>Didn't receive the code? </span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendLoginOtp}
                    className="text-purple-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer font-medium"
                  >
                    {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )
          )}
        </div>

        {/* Footer Area with Staggered Entrance */}
        <div className="flex flex-col gap-4 animate-auth-footer">
          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#2A2A35]" />
            <span className="text-xs text-[#8B8B9E] uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-[#2A2A35]" />
          </div>

          {/* Official Google OAuth Component */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed or was closed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#8B8B9E] mt-1">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-purple-400 hover:underline hover:text-purple-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  )
}

export default LoginPage
