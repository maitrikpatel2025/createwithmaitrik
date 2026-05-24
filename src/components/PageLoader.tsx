'use client'

import { useState, useEffect } from 'react'

export function PageLoader() {
  const [phase, setPhase] = useState<'loading' | 'fading' | 'done'>('loading')

  useEffect(() => {
    // Let the logo animate, then fade out
    const t1 = setTimeout(() => setPhase('fading'), 600)
    const t2 = setTimeout(() => setPhase('done'), 1100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`page-loader ${phase === 'fading' ? 'page-loader--done' : ''}`}>
      <div className="page-loader__inner">
        <span className="page-loader__mark">/</span>
        <div className="page-loader__bar">
          <div className="page-loader__bar-fill" />
        </div>
      </div>
    </div>
  )
}
