import { createAvatar } from '@dicebear/core'
import { botttsNeutral } from '@dicebear/collection'

// 8 Pre-configured Bottts Neutral Seeds
export const BOT_SEEDS = [
  { id: 'bot-1', seed: 'Gizmo', name: 'Gizmo' },
  { id: 'bot-2', seed: 'Astro', name: 'Astro' },
  { id: 'bot-3', seed: 'Spark', name: 'Spark' },
  { id: 'bot-4', seed: 'Buster', name: 'Buster' },
  { id: 'bot-5', seed: 'Ziggy', name: 'Ziggy' },
  { id: 'bot-6', seed: 'Circuit', name: 'Circuit' },
  { id: 'bot-7', seed: 'Echo', name: 'Echo' },
  { id: 'bot-8', seed: 'Byte', name: 'Byte' }
]

// Default placeholder silhouette SVG data URI when user has no avatar or removes it
export const DEFAULT_AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#1C1C26"/>
  <circle cx="32" cy="24" r="11" fill="#6B7280"/>
  <path d="M14 52C14 42 21 37 32 37C43 37 50 42 50 52" fill="#6B7280"/>
</svg>
`)}`

// Generate DiceBear Bottts Neutral SVG Data URI string, or return placeholder
export const getDiceBearAvatar = (seedStr) => {
  if (!seedStr || seedStr === 'none' || seedStr === 'null' || seedStr === 'undefined') {
    return DEFAULT_AVATAR_PLACEHOLDER
  }
  if (typeof seedStr === 'string' && (seedStr.startsWith('http://') || seedStr.startsWith('https://') || seedStr.startsWith('data:image'))) {
    return seedStr
  }
  try {
    const avatar = createAvatar(botttsNeutral, {
      seed: String(seedStr),
      radius: 12
    })
    return avatar.toDataUri()
  } catch (err) {
    console.error('Error generating DiceBear avatar:', err)
    return DEFAULT_AVATAR_PLACEHOLDER
  }
}

