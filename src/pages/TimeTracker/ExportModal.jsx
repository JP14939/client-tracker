import { useState } from 'react'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/Button/Button'
import useProjects from '../../hooks/useProjects'
import useClients from '../../hooks/useClients'
import useTimeEntries from '../../hooks/useTimeEntries'
import { formatHours } from '../../utils/formatters'
import { exportProjectToPDF } from '../../hooks/useExport'

export default function ExportModal({ isOpen, onClose }) {
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const { projects } = useProjects()
  const { clients } = useClients()
  const { timeEntries } = useTimeEntries()

  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const selectedClient = selectedProject ? clients.find(c => c.id === selectedProject.clientId) : null
  const projectEntries = selectedProjectId ? timeEntries.filter(e => e.projectId === selectedProjectId) : []
  const totalHours = projectEntries.reduce((sum, e) => sum + (e.hours || 0), 0)

  function handleDownload() {
    if (!selectedProjectId) return
    exportProjectToPDF(selectedProjectId)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export to PDF">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--muted2)', display: 'block', marginBottom: 6 }}>
            Select project
          </label>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
          >
            <option value="">Choose a project…</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div style={{
            background: 'rgba(124,92,252,0.08)',
            border: '1px solid rgba(124,92,252,0.18)',
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}>
            <Row label="Project" value={selectedProject.name} bold />
            {selectedClient && <Row label="Client" value={selectedClient.name} />}
            <Row label="Entries" value={projectEntries.length} />
            <Row label="Total hours" value={formatHours(totalHours)} accent />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleDownload} disabled={!selectedProjectId}
            style={!selectedProjectId ? { opacity: 0.45, cursor: 'not-allowed' } : {}}>
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function Row({ label, value, bold, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{label}</span>
      <span style={{
        fontSize: 13,
        fontWeight: bold || accent ? 600 : 400,
        color: accent ? 'var(--accent2)' : 'var(--text)',
      }}>
        {value}
      </span>
    </div>
  )
}
