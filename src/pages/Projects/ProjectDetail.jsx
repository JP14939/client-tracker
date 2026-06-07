import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Clock, Calendar, Trash2 } from 'lucide-react'
import useProjects from '../../hooks/useProjects'
import useClients from '../../hooks/useClients'
import useTimeEntries from '../../hooks/useTimeEntries'
import useMilestones from '../../hooks/useMilestones'
import { formatDate, formatHours } from '../../utils/formatters'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import EmptyState from '../../components/EmptyState/EmptyState'

export default function ProjectDetail() {
  const { id } = useParams()
  const { projects } = useProjects()
  const { getClientById } = useClients()
  const { getEntriesByProject, getTotalHoursByProject } = useTimeEntries()
  const { getMilestonesByProject, toggleMilestone, deleteMilestone } = useMilestones()

  const project = projects?.find(p => String(p.id) === String(id))
  const client = getClientById(project?.clientId)
  const milestones = getMilestonesByProject(id)
  const entries = getEntriesByProject(id)

  if (!project) return <p style={{ color: 'var(--muted)' }}>Project not found.</p>

  return (
    <div>
      <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted2)', fontSize: 13, marginBottom: 20 }}>
        <ChevronLeft size={14} strokeWidth={2} /> Projects
      </Link>

      <div className="glass" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>{project.name}</h1>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {client && <Link to={`/clients/${client.id}`} style={{ color: 'var(--accent2)', fontSize: 13, fontWeight: 500 }}>{client.name}</Link>}
              <Badge status={project.status} />
              {project.deadline && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 12 }}><Calendar size={11} strokeWidth={1.8} />{formatDate(project.deadline)}</span>}
            </div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8, background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.2)', color: 'var(--accent2)', fontSize: 12.5, fontWeight: 600 }}>
            <Clock size={12} strokeWidth={2} />{formatHours(getTotalHoursByProject(id))}
          </span>
        </div>
      </div>

      <h2 style={{ marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)' }}>Milestones</h2>
      {!milestones?.length ? <EmptyState message="No milestones yet." /> : (
        <div style={{ marginBottom: 24 }}>
          {milestones.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10, marginBottom: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <input type="checkbox" checked={m.done} onChange={() => toggleMilestone(m.id)} />
              <span style={{ flex: 1, fontSize: 13.5, textDecoration: m.done ? 'line-through' : 'none', color: m.done ? 'var(--muted)' : 'var(--text)' }}>{m.title}</span>
              {m.dueDate && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 12 }}><Calendar size={11} strokeWidth={1.8} />{formatDate(m.dueDate)}</span>}
              <Button variant="danger" onClick={() => deleteMilestone(m.id)} style={{ padding: 5, borderRadius: 7 }}><Trash2 size={12} strokeWidth={2} /></Button>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)' }}>Time Entries</h2>
      {!entries?.length ? <EmptyState message="No time entries yet." /> : (
        <div>
          {entries.map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 13px', borderRadius: 10, marginBottom: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: 12.5, color: 'var(--muted2)', minWidth: 94 }}>{formatDate(e.date)}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>{e.description || '—'}</span>
              <strong style={{ fontSize: 13, color: 'var(--text)' }}>{formatHours(e.hours)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
