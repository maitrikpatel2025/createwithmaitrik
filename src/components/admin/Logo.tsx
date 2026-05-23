'use client'
import React from 'react'

const Logo: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '4px 0',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #0071e3 0%, #0058b0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '-0.02em',
        flexShrink: 0,
      }}>
        M
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{
          color: '#ffffff',
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          fontWeight: 700,
          fontSize: '14px',
          letterSpacing: '-0.01em',
          lineHeight: '1.2',
        }}>
          Maitrik Patel
        </span>
        <span style={{
          color: '#636366',
          fontFamily: '"JetBrains Mono", "SF Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          lineHeight: '1.2',
        }}>
          Admin · v1.0
        </span>
      </div>
    </div>
  )
}

export default Logo
