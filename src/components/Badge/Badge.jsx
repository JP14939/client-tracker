const colorMap = {
  active:    { bg: 'var(--green-bg)',   color: 'var(--green)',  dot: 'var(--green)'  },
  paused:    { bg: 'var(--amber-bg)',   color: 'var(--amber)',  dot: 'var(--amber)'  },
  completed: { bg: 'var(--blue-bg)',    color: 'var(--blue)',   dot: 'var(--blue)'   },
  'on-hold': { bg: 'var(--amber-bg)',   color: 'var(--amber)',  dot: 'var(--amber)'  },
}

const fallback = { bg: 'var(--accent-glow)', color: 'var(--accent2)', dot: 'var(--accent2)' }

const displayText = {
  'on-hold': 'On Hold',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export default function Badge({ status }) {
  const c = colorMap[status] ?? fallback
  const label = displayText[status] ?? (status ? status.charAt(0).toUpperCase() + status.slice(1) : '')

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 99,
      fontSize: 11.5, fontWeight: 500,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {label}
    </span>
  )
}
