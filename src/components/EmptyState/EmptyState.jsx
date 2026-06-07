import { Inbox } from 'lucide-react'

export default function EmptyState({ message, action }) {
  return (
    <div className="glass" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Inbox size={28} strokeWidth={1.2} style={{ color: 'var(--muted)', marginBottom: 12 }} />
      <p style={{ fontSize: 13.5, margin: '0 0 16px', color: 'var(--muted2)' }}>{message}</p>
      {action}
    </div>
  )
}
