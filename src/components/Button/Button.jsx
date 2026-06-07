const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  padding: '8px 16px', borderRadius: 9,
  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
  cursor: 'pointer', lineHeight: 1.4,
  transition: 'all 0.18s',
  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
}

const variants = {
  primary: {
    background: 'rgba(124,92,252,0.75)',
    color: '#fff',
    border: '1px solid rgba(124,92,252,0.5)',
    boxShadow: '0 2px 12px rgba(124,92,252,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  danger: {
    background: 'rgba(244,63,94,0.12)',
    color: 'var(--red)',
    border: '1px solid rgba(244,63,94,0.18)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted2)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  icon: {
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted2)',
    border: '1px solid rgba(255,255,255,0.09)',
    padding: '6px', borderRadius: 8,
  },
}

export default function Button({ variant = 'primary', style, ...rest }) {
  return (
    <button style={{ ...base, ...(variants[variant] ?? variants.primary), ...style }} {...rest} />
  )
}
