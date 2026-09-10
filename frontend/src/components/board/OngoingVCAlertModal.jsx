// frontend/src/components/board/OngoingVCAlertModal.jsx
import React from 'react'
import { getDiceBearAvatar } from '../../utils/avatars'

/**
 * OngoingVCAlertModal
 * Appears when a user opens a board and there is an ongoing V-Chat call in progress.
 */
export default function OngoingVCAlertModal({
  isOpen,
  participants = [],
  onAccept,
  onDecline
}) {
  if (!isOpen || participants.length === 0) return null

  const participantNames = participants
    .map((p) => p.user?.name || p.user?.username || 'Team Member')
    .join(', ')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-[#151520] border border-[#35354D] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl shadow-purple-950/60 text-white flex flex-col items-center text-center relative overflow-hidden animate-scaleUp">
        {/* Pulsing Video Call Icon */}
        <div className="relative mb-5 mt-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-emerald-500/20 border-2 border-purple-500/50 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-950/50">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#151520]"></span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2">
          Ongoing V-Chat in this Board
        </h3>

        {/* Member Avatars */}
        <div className="flex items-center justify-center -space-x-3 my-2.5">
          {participants.map((p) => {
            const displayName = p.user?.name || p.user?.username || 'Member'
            const avatarUri = getDiceBearAvatar(p.user?.avatar || p.user?.username || displayName)
            return (
              <div key={p.socketId} className="relative group">
                <img
                  src={avatarUri}
                  alt={displayName}
                  className="w-11 h-11 rounded-full border-2 border-[#151520] bg-zinc-800 object-contain shadow-lg"
                  title={displayName}
                />
              </div>
            )
          })}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 mb-1 leading-relaxed">
          <span className="font-semibold text-purple-300">{participantNames}</span>{' '}
          {participants.length === 1 ? 'is' : 'are'} currently on a video call.
        </p>
        <p className="text-[11px] text-gray-400 mb-6">
          Would you like to join the conversation now?
        </p>

        {/* Action Buttons (Border Only) */}
        <div className="flex items-center gap-3 w-full">
          {/* Decline Button */}
          <button
            onClick={onDecline}
            className="flex-1 py-2.5 rounded-xl bg-transparent border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-semibold text-xs hover:bg-white/5 transition-all cursor-pointer"
          >
            Decline
          </button>

          {/* Accept / Join Button */}
          <button
            onClick={onAccept}
            className="flex-1 py-2.5 rounded-xl bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-bold text-xs transition-all shadow-lg shadow-purple-900/40 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>Join V-Chat</span>
          </button>
        </div>
      </div>
    </div>
  )
}
