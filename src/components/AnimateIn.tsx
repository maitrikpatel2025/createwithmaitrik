'use client'

import { useRef, useEffect, useState, type CSSProperties } from 'react'

// ───────────────────────────────────────────────────
// Reveal — single-element scroll-reveal
// ───────────────────────────────────────────────────

type Animation = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up' | 'blur-in'

interface RevealProps {
  children: React.ReactNode
  animation?: Animation
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  style?: CSSProperties
}

export function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration,
  threshold = 0.12,
  className = '',
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check if element is already in viewport on mount
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight + 40

    if (isInView) {
      // Already in viewport — show immediately, no animation needed
      setReady(true)
      setVisible(true)
      return
    }

    // Below fold — set up scroll animation
    setReady(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const inlineStyle: CSSProperties = {
    transitionDelay: delay ? `${delay}ms` : undefined,
    transitionDuration: duration ? `${duration}ms` : undefined,
    ...style,
  }

  // Before JS hydrates: no animation classes — content is fully visible (good for SEO/no-JS)
  // After mount: animation classes added, IntersectionObserver handles reveal
  const classes = ready
    ? `reveal ${animation} ${visible ? 'is-visible' : ''} ${className}`
    : className

  return (
    <div
      ref={ref}
      className={classes.trim() || undefined}
      style={inlineStyle}
    >
      {children}
    </div>
  )
}

// ───────────────────────────────────────────────────
// RevealGroup — staggers children on scroll
// ───────────────────────────────────────────────────

interface RevealGroupProps {
  children: React.ReactNode
  animation?: Animation
  stagger?: number
  threshold?: number
  className?: string
  style?: CSSProperties
}

export function RevealGroup({
  children,
  animation = 'fade-up',
  stagger = 100,
  threshold = 0.08,
  className = '',
  style,
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check if element is already in viewport on mount
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight + 40

    if (isInView) {
      // Already in viewport — show immediately
      setReady(true)
      setVisible(true)
      return
    }

    // Below fold — set up scroll animation
    setReady(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  // Before JS: no animation classes — content visible
  // After JS: animation classes with stagger
  const classes = ready
    ? `reveal-group ${animation} ${visible ? 'is-visible' : ''} ${className}`
    : className

  const groupStyle = ready
    ? { '--stagger': `${stagger}ms`, ...style } as CSSProperties
    : style

  return (
    <div
      ref={ref}
      className={classes.trim() || undefined}
      style={groupStyle}
    >
      {children}
    </div>
  )
}
