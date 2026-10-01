import { useState, useEffect } from 'react'
import { forgotPassword, verifyOtp, resetPassword } from '../../api'
import { StatusBarsLogo } from '../common/StatusBarsLogo'

function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(120) // 2 minutes cooldown (120 seconds)

  const handleClose = () => {
    setStep(1)
    setEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setMessage('')
    onClose()
  }

  // Live 5-Minute Countdown Timer for OTP Expiry
  useEffect(() => {
    let timerId
    if (isOpen && step === 2 && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [isOpen, step, timeLeft])

  // Live 2-Minute Countdown Timer for Resend Button Cooldown
  useEffect(() => {
    let timerId
    if (isOpen && step === 2 && resendCooldown > 0) {
      timerId = setInterval(() => {
        setResendCooldown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [isOpen, step, resendCooldown])

  // Close on Escape key press (MUST be called before any early return)
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    if (!email.trim()) return
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await forgotPassword({ email: email.trim() })
      setMessage(res.data.message || 'OTP sent successfully!')
      setTimeLeft(300) // Reset 5-minute expiry
      setResendCooldown(120) // Reset 2-minute resend cooldown
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code')
      return
    }
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await verifyOtp({ email: email.trim(), otp: otp.trim() })
      setMessage('OTP verified! Enter your new password below.')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP code.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword
      })
      setMessage(res.data.message || 'Password reset successfully!')
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Early return ONLY after all React Hooks have been declared
  if (!isOpen) return null

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer"
    >
      {/* Modal Card - 100% matched to LoginPage / RegisterPage card system */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-8 rounded-2xl bg-bg-surface border border-bg-border shadow-2xl shadow-black/80 backdrop-blur-xl relative z-10 flex flex-col gap-6 text-text-primary animate-auth-card cursor-default"
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#8B8B9E] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <StatusBarsLogo size={52} className="mb-1" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Enter Security Code'}
            {step === 3 && 'Set New Password'}
            {step === 4 && 'Password Updated!'}
          </h2>
          <p className="text-sm text-[#8B8B9E]">
            {step === 1 && 'Enter your email to receive a recovery code'}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && 'Create a strong, new password for your workspace'}
            {step === 4 && 'Your password has been changed successfully'}
          </p>
        </div>

        {/* Feedback Banner */}
        {error && (
          <div className="p-3.5 rounded-xl text-sm font-medium bg-danger/10 border border-danger/30 text-danger flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12"/><line x1="12" y1="16" x2="12.01"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {message && step !== 4 && (
          <div className="p-3.5 rounded-xl text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-2">
            <span>📩</span>
            <span>{message}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 cursor-pointer mt-2"
            >
              {loading ? 'Sending code...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); setMessage('') }}
                  className="text-xs text-purple-400 hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                disabled={timeLeft === 0}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-center text-lg tracking-widest font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            {timeLeft === 0 ? (
              <div className="text-center p-2.5 rounded-xl bg-danger/10 border border-danger/20">
                <p className="text-xs text-danger font-medium mb-1">
                  This OTP code has expired.
                </p>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-xs font-semibold text-purple-400 hover:underline cursor-pointer"
                >
                  {loading ? 'Resending...' : 'Resend New OTP Code'}
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-[#8B8B9E]">
                <span>Didn't receive the code? </span>
                {resendCooldown > 0 ? (
                  <span className="text-purple-400/80 font-medium">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSendOtp}
                    className="text-purple-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || timeLeft === 0}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 cursor-pointer mt-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F13] border border-bg-border text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9E]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 my-1">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-sm text-[#8B8B9E]">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-purple-600/30 cursor-pointer mt-2"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Modal Footer Link */}
        {step !== 4 && (
          <p className="text-center text-sm text-[#8B8B9E] mt-1">
            Remembered your password?{' '}
            <button
              type="button"
              onClick={handleClose}
              className="font-semibold text-purple-400 hover:underline hover:text-purple-300 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </p>
        )}

      </div>
    </div>
  )
}

export default ForgotPasswordModal
