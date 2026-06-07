import { Trash2 } from 'lucide-react'
import { formatDate, formatHours } from '../../utils/formatters'
import Button from '../../components/Button/Button'

export default function TimeEntryRow({ entry, projectName, onDelete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 14px', borderRadius: 10, marginBottom: 5,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontSize: 12.5, color: 'var(--muted2)', minWidth: 94 }}>{formatDate(entry.date)}</span>
      <span style={{ fontSize: 12.5, color: 'var(--accent2)', fontWeight: 500, minWidth: 110 }}>{projectName}</span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>{entry.description || '—'}</span>
      <strong style={{ fontSize: 13, color: 'var(--text)' }}>{formatHours(entry.hours)}</strong>
      <Button variant="danger" onClick={onDelete} style={{ padding: 5, borderRadius: 7 }}><Trash2 size={12} strokeWidth={2} /></Button>
    </div>
  )
}
