import { useEffect, useRef, useState } from 'react'

/**
 * Subtle one-time scroll reveal. The element fades and lifts 14px into place.
 * Motion is skipped entirely for users who prefer reduced motion.
 */
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    return (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  })

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[3px]'
      } ${className}`}
    >
      {children}
    </div>
  )
}
