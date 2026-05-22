import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'tertiary'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size,
  href,
  onClick,
  type = 'button',
  className = '',
  style,
  disabled,
}: ButtonProps) {
  const cls = ['cwm-btn', `cwm-btn--${variant}`, size ? `cwm-btn--${size}` : '', className]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return <Link href={href} className={cls} style={style}>{children}</Link>
  }
  return (
    <button className={cls} onClick={onClick} type={type} style={style} disabled={disabled}>
      {children}
    </button>
  )
}

export function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

export function CheckCircle({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" />
    </svg>
  )
}

export function Slash({ size = 26, color, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size, lineHeight: 1, color: color || 'inherit', display: 'inline-block', transform: 'translateY(-1px)', ...style }}>/</span>
  )
}

export function Eyebrow({ children, color, style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return <span className="cwm-eyebrow" style={{ color, ...style }}>{children}</span>
}
