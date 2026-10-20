import { getDiceBearAvatar } from '../../utils/avatars'

// Generated once at module load so the landing page does not rebuild avatars on every render.
export const PEOPLE = {
  rahulya: { id: 'rahulya', name: 'Rahulya', avatar: getDiceBearAvatar('Gizmo') },
  joey: { id: 'joey', name: 'Joey', avatar: getDiceBearAvatar('Astro') },
  sarah: { id: 'sarah', name: 'Sarah', avatar: getDiceBearAvatar('Spark') },
  marc: { id: 'marc', name: 'Marc', avatar: getDiceBearAvatar('Buster') },
  echo: { id: 'echo', name: 'Echo', avatar: getDiceBearAvatar('Echo') },
}

export const PRIORITY_STYLES = {
  low: 'border-[#7C6FF7]/25 bg-[#7C6FF7]/12 text-[#B8AFFF]',
  medium: 'border-[#F5A524]/25 bg-[#F5A524]/12 text-[#F5C56B]',
  high: 'border-[#FF6B6B]/25 bg-[#FF6B6B]/12 text-[#FFA0A0]',
  done: 'border-[#69DB7C]/25 bg-[#69DB7C]/12 text-[#8BE39A]',
  design: 'border-[#4ECDC4]/25 bg-[#4ECDC4]/12 text-[#7EE5DE]',
  product: 'border-[#7C6FF7]/25 bg-[#7C6FF7]/12 text-[#B8AFFF]',
  marketing: 'border-[#F5A524]/25 bg-[#F5A524]/12 text-[#F5C56B]',
}
