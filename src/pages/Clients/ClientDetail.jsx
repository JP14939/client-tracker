import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Clock, Calendar } from 'lucide-react'
import useClients from '../../hooks/useClients'
import useProjects from '../../hooks/useProjects'
import useTimeEntries from '../../hooks/useTimeEntries'
import { formatHours, formatDate } from '../../utils/formatters'
import Badge from '../../components/Badge/Badge'
import EmptyState from '../../components/EmptyState/EmptyState'

export default function ClientDetail() {
  const { id } = useParams()
  const { getClientById } = useClients()
  const { getProjectsByClient } = useProjects()
  const { getTotalHoursByProject } = useTimeEntries()

  const client = getClientById(id)
  const projects = getProjectsByClient(id)
  if (!client) return <p style={{ color: 'var(--muted)' }}>Client not found.</p>

  return (
    <div>
      <Link to="/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted2)', fontSize: 13, marginBottom: 20 }}>
        <ChevronLeft size={14} strokeWidth={2} /> Clients
      </Link>

      <div className="glass" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ marginBottom: 5 }}>{client.name}</h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              {client.email && <span style={{ color: 'var(--muted2)', fontSize: 13 }}>{client.email}</span>}
              {client.company && <span style={{ color: 'var(--muted)', fontSize: 13 }}>{client.company}</span>}
            </div>
          </div>
          <Badge status={client.status} />
        </div>
      </div>

      <h2 style={{ marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)' }}>Projects</h2>
      {!projects?.length ? <EmptyState message="No projects for this client yet." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {projects.map(p => (
            <div key={p.id} className="glass" style={{ padding: '13px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Link to={`/projects/${p.id}`} style={{ fontWeight: 600, color: 'var(--accent2)', fontSize: 14 }}>{p.name}</Link>
                  <Badge status={p.status} />
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {p.deadline && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 12 }}><Calendar size={11} strokeWidth={1.8} />{formatDate(p.deadline)}</span>}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted2)', fontSize: 12 }}><Clock size={11} strokeWidth={1.8} />{formatHours(getTotalHoursByProject(p.id))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
