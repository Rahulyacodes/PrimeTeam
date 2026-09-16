import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword, requestEmailChangeOtp, verifyEmailChangeOtp } from '../api'
import { BOT_SEEDS, getDiceBearAvatar } from '../utils/avatars'

function SettingsPage() {
  const { user, updateUser } = useAuth()

  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'security'

  // Profile Form State
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // Avatar Edit State (Menu & Modal)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [modalAvatar, setModalAvatar] = useState(user?.avatar || '')
  const [avatarActionLoading, setAvatarActionLoading] = useState(false)
  const avatarMenuRef = useRef(null)

  // Sync user state if updated externally
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setUsername(user.username || '')
      setSelectedAvatar(user.avatar || '')
    }
  }, [user])

  // Email Change State (OTP Verified)
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailOtpStep, setEmailOtpStep] = useState('request') // 'request' | 'verify'
  const [emailOtp, setEmailOtp] = useState('')
  const [emailChangeLoading, setEmailChangeLoading] = useState(false)
  const [emailChangeMsg, setEmailChangeMsg] = useState({ type: '', text: '' })
  const [resendCooldown, setResendCooldown] = useState(0)

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityLoading, setSecurityLoading] = useState(false)
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' })

  const currentAvatarUri = getDiceBearAvatar(selectedAvatar)

  // Close avatar dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setAvatarMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setAvatarMenuOpen(false)
        setShowAvatarModal(false)
      }
    }
    if (avatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [avatarMenuOpen])

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Request Email Change OTP
  const handleRequestEmailOtp = async (e) => {
    e.preventDefault()
    setEmailChangeMsg({ type: '', text: '' })

    if (!newEmail.trim()) {
      setEmailChangeMsg({ type: 'error', text: 'Please enter a valid new email address.' })
      return
    }

    if (newEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      setEmailChangeMsg({ type: 'error', text: 'New email address must be different from your current email.' })
      return
    }

    setEmailChangeLoading(true)
    try {
      const res = await requestEmailChangeOtp({ newEmail: newEmail.trim() })
      setEmailOtpStep('verify')
      setEmailChangeMsg({ type: 'success', text: res.data.message || 'Verification OTP sent to your new email!' })
      setResendCooldown(30)
    } catch (err) {
      setEmailChangeMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to send OTP to new email address.'
      })
    } finally {
      setEmailChangeLoading(false)
    }
  }

  // Resend Email Change OTP
  const handleResendEmailOtp = async () => {
    if (resendCooldown > 0) return
    setEmailChangeMsg({ type: '', text: '' })
    setEmailChangeLoading(true)

    try {
      const res = await requestEmailChangeOtp({ newEmail: newEmail.trim() })
      setEmailChangeMsg({ type: 'success', text: res.data.message || 'New OTP sent to your new email!' })
      setResendCooldown(30)
    } catch (err) {
      setEmailChangeMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to resend OTP.'
      })
    } finally {
      setEmailChangeLoading(false)
    }
  }

  // Verify Email Change OTP & Apply New Primary Email
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault()
    setEmailChangeMsg({ type: '', text: '' })

    if (!emailOtp.trim() || emailOtp.trim().length !== 6) {
      setEmailChangeMsg({ type: 'error', text: 'Please enter the 6-digit verification code.' })
      return
    }

    setEmailChangeLoading(true)
    try {
      const res = await verifyEmailChangeOtp({
        newEmail: newEmail.trim(),
        otp: emailOtp.trim()
      })
      updateUser(res.data.user)
      setProfileMsg({ type: 'success', text: 'Primary email address updated successfully!' })
      setShowEmailChangeModal(false)
      setNewEmail('')
      setEmailOtp('')
      setEmailOtpStep('request')
    } catch (err) {
      setEmailChangeMsg({
        type: 'error',
        text: err.response?.data?.error || 'Invalid or expired OTP code.'
      })
    } finally {
      setEmailChangeLoading(false)
    }
  }

  // Handle Profile Update Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    setProfileLoading(true)

    try {
      const res = await updateProfile({
        name: name.trim(),
        username: username.trim(),
        avatar: selectedAvatar
      })
      updateUser(res.data.user)
      setProfileMsg({ type: 'success', text: res.data.message || 'Profile updated successfully!' })
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update profile. Please try again.'
      })
    } finally {
      setProfileLoading(false)
    }
  }

  // Remove custom avatar -> reset to no profile avatar (placeholder icon)
  const handleRemoveAvatar = async () => {
    setProfileMsg({ type: '', text: '' })
    setAvatarActionLoading(true)
    try {
      const res = await updateProfile({
        name: name.trim(),
        username: username.trim(),
        avatar: ''
      })
      updateUser(res.data.user)
      setSelectedAvatar('')
      setModalAvatar('')
      setShowAvatarModal(false)
      setProfileMsg({ type: 'success', text: 'Avatar removed successfully!' })
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to remove avatar. Please try again.'
      })
    } finally {
      setAvatarActionLoading(false)
    }
  }

  // Save selected avatar from Change Avatar Modal
  const handleSaveAvatar = async (avatarToSave) => {
    setProfileMsg({ type: '', text: '' })
    setAvatarActionLoading(true)
    try {
      const res = await updateProfile({
        name: name.trim(),
        username: username.trim(),
        avatar: avatarToSave
      })
      updateUser(res.data.user)
      setSelectedAvatar(avatarToSave)
      setShowAvatarModal(false)
      setProfileMsg({ type: 'success', text: 'Profile avatar updated successfully!' })
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update avatar. Please try again.'
      })
    } finally {
      setAvatarActionLoading(false)
    }
  }

  // Handle Password Change Submit
  const handleSecuritySubmit = async (e) => {
    e.preventDefault()
    setSecurityMsg({ type: '', text: '' })

    if (newPassword.length < 6) {
      setSecurityMsg({ type: 'error', text: 'New password must be at least 6 characters long.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    setSecurityLoading(true)

    try {
      const res = await changePassword({
        currentPassword,
        newPassword
      })
      setSecurityMsg({ type: 'success', text: res.data.message || 'Password updated successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      if (!user.hasPassword) {
        updateUser({ hasPassword: true })
      }
    } catch (err) {
      setSecurityMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to change password. Please try again.'
      })
    } finally {
      setSecurityLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        
        {/* Banner Header */}
        <div className="relative rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-[#171722] border border-[#2A2A38] p-6 mb-8 shadow-xl">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
            {/* Interactive Avatar with Edit Pencil */}
            <div className="relative" ref={avatarMenuRef}>
              <div
                onClick={() => {
                  setModalAvatar(selectedAvatar || 'Gizmo')
                  setAvatarMenuOpen(prev => !prev)
                }}
                className="group relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#13131A] border-2 border-purple-500/50 p-1 flex items-center justify-center shadow-lg shadow-purple-900/40 shrink-0 cursor-pointer transition-all duration-200 hover:border-purple-400 hover:shadow-purple-500/30 select-none"
                title="Click to change or remove avatar"
              >
                {selectedAvatar ? (
                  <img
                    src={currentAvatarUri}
                    alt="Profile Avatar"
                    className="w-full h-full object-contain rounded-xl transition-transform duration-200 group-hover:scale-95"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#181822] flex items-center justify-center text-gray-400 group-hover:text-gray-300 transition-colors">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}

                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-1 rounded-xl bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-0.5 text-white">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                  <span className="text-[10px] font-semibold text-purple-200">{selectedAvatar ? 'Edit' : 'Add'}</span>
                </div>

                {/* Edit Pencil Icon Badge */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setModalAvatar(selectedAvatar || 'Gizmo')
                    setAvatarMenuOpen(prev => !prev)
                  }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg border-2 border-[#13131A] transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer z-10"
                  title={selectedAvatar ? "Edit Avatar" : "Add Avatar"}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </div>

              {/* Action Dropdown Menu (Change / Remove) */}
              {avatarMenuOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] w-48 bg-[#181822] border border-[#2E2E3E] rounded-xl shadow-2xl py-1.5 z-30 animate-fadeIn divide-y divide-[#262636]">
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avatar Options</p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false)
                        setModalAvatar(selectedAvatar || 'Gizmo')
                        setShowAvatarModal(true)
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-gray-200 hover:text-white hover:bg-purple-600/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                      <span>{selectedAvatar ? 'Change Avatar' : 'Choose Avatar'}</span>
                    </button>

                    {selectedAvatar && (
                      <button
                        type="button"
                        disabled={avatarActionLoading}
                        onClick={() => {
                          setAvatarMenuOpen(false)
                          handleRemoveAvatar()
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        <span>Remove Avatar</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <span>{user?.name || user?.username || 'User Account'}</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                @{user?.username || 'username'} • {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#2A2A38] mb-6 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-semibold text-xs transition-all relative cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-4 font-semibold text-xs transition-all relative cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>Security & Password</span>
          </button>
        </div>

        {/* TAB 1: Profile Details & Avatar Selector */}
        {activeTab === 'profile' && (
          <div className="bg-[#171722] border border-[#2A2A38] rounded-2xl p-6 shadow-lg animate-fadeIn">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Profile Details</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Manage your display name, username handle and email.
            </p>

            {profileMsg.text && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahulya Pandit"
                  className="w-full bg-[#0F0F14] border border-[#2A2A38] focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                />
                <p className="text-[11px] text-gray-500 mt-1">This is the name displayed on your cards and activity logs.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Username Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    required
                    className="w-full bg-[#0F0F14] border border-[#2A2A38] focus:border-purple-500 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Primary Email Address
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailChangeModal(true)
                      setEmailOtpStep('request')
                      setEmailChangeMsg({ type: '', text: '' })
                      setNewEmail('')
                      setEmailOtp('')
                    }}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    <span>Change Primary Email</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-[#0B0B0E] border border-[#22222E] rounded-xl px-4 py-3 text-sm text-gray-300 cursor-not-allowed font-mono"
                  />
                  <span className="absolute right-4 text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span>Verified</span>
                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A38] flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white active:scale-[0.98] disabled:opacity-50 text-xs font-bold transition-all cursor-pointer"
                >
                  {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Email Change OTP Modal */}
        {showEmailChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1C1C24] border border-[#2A2A35] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white flex flex-col gap-4 relative">
              <button
                type="button"
                onClick={() => setShowEmailChangeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Update Primary Email</h3>
                  <p className="text-xs text-gray-400">Requires verification via OTP sent to your new email</p>
                </div>
              </div>

              {emailChangeMsg.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    emailChangeMsg.type === 'success'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {emailChangeMsg.text}
                </div>
              )}

              {emailOtpStep === 'request' ? (
                <form onSubmit={handleRequestEmailOtp} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                      New Primary Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="newemail@example.com"
                      required
                      className="w-full bg-[#0F0F14] border border-[#2A2A38] focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailChangeModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={emailChangeLoading}
                      className="flex-1 py-2.5 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {emailChangeLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailOtp} className="flex flex-col gap-4">
                  <div className="bg-[#121218] border border-[#282838] rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">Enter the 6-digit code sent to</p>
                    <p className="text-sm font-bold text-white mt-0.5 truncate">{newEmail}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      className="w-full text-center text-2xl font-mono tracking-widest bg-[#0F0F14] border border-purple-500/50 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => { setEmailOtpStep('request'); setEmailChangeMsg({ type: '', text: '' }) }}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Change Email
                    </button>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || emailChangeLoading}
                      onClick={handleResendEmailOtp}
                      className="text-purple-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={emailChangeLoading || emailOtp.length !== 6}
                    className="w-full py-3 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {emailChangeLoading ? 'Verifying & Updating...' : 'Confirm & Update Email'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Change Profile Avatar Modal */}
        {showAvatarModal && (
          <div
            onClick={() => setShowAvatarModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1C1C24] border border-[#2A2A38] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white flex flex-col gap-5 relative"
            >
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Choose Profile Avatar</h3>
                  <p className="text-xs text-gray-400">Select an avatar character for your profile</p>
                </div>
              </div>

              {/* Available Avatars Grid */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                  Available Avatars
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {BOT_SEEDS.map((bot) => {
                    const isSelected = modalAvatar === bot.seed
                    const avatarUri = getDiceBearAvatar(bot.seed)
                    return (
                      <button
                        key={bot.id}
                        type="button"
                        onClick={() => setModalAvatar(bot.seed)}
                        className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/15 scale-105 shadow-md shadow-purple-500/30'
                            : 'border-[#2A2A38] bg-[#0F0F14] hover:border-gray-500 hover:scale-102'
                        }`}
                        title={bot.name}
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#13131A] p-0.5 flex items-center justify-center overflow-hidden">
                          <img src={avatarUri} alt={bot.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1.5 font-medium group-hover:text-white truncate max-w-full">
                          {bot.name}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2A2A38]">
                {selectedAvatar ? (
                  <button
                    type="button"
                    disabled={avatarActionLoading}
                    onClick={handleRemoveAvatar}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Remove Avatar</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  disabled={avatarActionLoading || !modalAvatar}
                  onClick={() => handleSaveAvatar(modalAvatar)}
                  className="px-5 py-2 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {avatarActionLoading ? 'Saving...' : 'Save Avatar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <div className="bg-[#171722] border border-[#2A2A38] rounded-2xl p-6 shadow-lg animate-fadeIn">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Security & Password</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Update your login password to keep your account safe and secure.
            </p>

            {securityMsg.text && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                  securityMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {securityMsg.type === 'success' ? (
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                )}
                <span>{securityMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-5">
              {user?.hasPassword !== false && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full bg-[#0F0F14] border border-[#2A2A38] focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-[#0F0F14] border border-[#2A2A38] focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full bg-[#0F0F14] border border-[#2A2A38] focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="pt-3 border-t border-[#2A2A38] flex justify-end">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="px-6 py-2.5 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white active:scale-[0.98] disabled:opacity-50 text-xs font-bold transition-all cursor-pointer"
                >
                  {securityLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  )
}

export default SettingsPage
