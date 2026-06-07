import { Pencil, Trash2, Calendar } from 'lucide-react'
import useClients from '../../hooks/useClients'
import { formatDate } from '../../utils/formatters'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'

export default function ProjectCard({ project, onEdit, onDelete }) {
  const { getClientById } = useClients()
  const client = getClientById(project.clientId)

  return (
    <div className="glass" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <strong style={{ fontSize: 14, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{project.name}</strong>
        {client && <span style={{ color: 'var(--muted2)', fontSize: 12.5 }}>{client.name}</span>}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
          <Badge status={project.status} />
          {project.deadline && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 12 }}>
              <Calendar size={11} strokeWidth={1.8} />{formatDate(project.deadline)}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 12 }}>
        <Button variant="icon" onClick={onEdit}><Pencil size={13} strokeWidth={2} /></Button>
        <Button variant="danger" onClick={onDelete} style={{ padding: 6, borderRadius: 8 }}><Trash2 size={13} strokeWidth={2} /></Button>
      </div>
    </div>
  )
}
