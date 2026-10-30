import { useEffect, useRef, useState } from 'react'

const HIDDEN_TRANSFORM = {
  left: '-translate-x-10 sm:-translate-x-16',
  right: 'translate-x-10 sm:translate-x-16',
  up: 'translate-y-6',
  down: '-translate-y-6',
  none: '',
}

/**
 * Directional scroll reveal. Elements slide in from their side of the layout
 * as they enter the viewport, and reset once they leave so the motion plays
 * again — in either scroll direction.
 * Motion is skipped entirely for users who prefer reduced motion.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  from = 'up',
  once = false,
  threshold = 0.15,
  rootMargin = '0px 0px -48px 0px',
  id,
}) {
  const ref = useRef(null)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [visible, setVisible] = useState(
    () =>
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      reduced
  )

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, reduced, threshold, rootMargin])

  const hiddenTransform = HIDDEN_TRANSFORM[from] ?? HIDDEN_TRANSFORM.up

  return (
    <div
      ref={ref}
      id={id}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={`transform-gpu transition-[opacity,translate,filter] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-x-0 translate-y-0 opacity-100 blur-0'
          : `${hiddenTransform} opacity-0 blur-[2px]`
      } ${className}`}
    >
      {children}
    </div>
  )
}
