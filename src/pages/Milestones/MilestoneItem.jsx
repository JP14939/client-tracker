import { Trash2, Calendar } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import Button from '../../components/Button/Button'

export default function MilestoneItem({ milestone, onToggle, onDelete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 13px', borderRadius: 10, marginBottom: 5,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <input type="checkbox" checked={milestone.done} onChange={onToggle} />
      <span style={{
        flex: 1, fontSize: 13.5,
        textDecoration: milestone.done ? 'line-through' : 'none',
        color: milestone.done ? 'var(--muted)' : 'var(--text)',
      }}>{milestone.title}</span>
      {milestone.dueDate && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
          <Calendar size={11} strokeWidth={1.8} />{formatDate(milestone.dueDate)}
        </span>
      )}
      <Button variant="danger" onClick={onDelete} style={{ padding: 5, borderRadius: 7 }}><Trash2 size={12} strokeWidth={2} /></Button>
    </div>
  )
}
