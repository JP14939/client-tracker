import { useState } from 'react'
import { Plus } from 'lucide-react'
import useTimeEntries from '../../hooks/useTimeEntries'
import useProjects from '../../hooks/useProjects'
import { formatHours } from '../../utils/formatters'
import Button from '../../components/Button/Button'
import EmptyState from '../../components/EmptyState/EmptyState'
import TimeEntryRow from './TimeEntryRow'
import TimeForm from './TimeForm'

export default function TimeTracker() {
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { timeEntries, addTimeEntry, deleteTimeEntry } = useTimeEntries()
  const { projects } = useProjects()

  const filteredEntries = (selectedProjectId
    ? timeEntries.filter(e => e.projectId === selectedProjectId)
    : [...timeEntries]
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  const total = filteredEntries.reduce((sum, e) => sum + (e.hours || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Time Tracker</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>
            Total: <strong style={{ color: 'var(--accent2)' }}>{formatHours(total)}</strong>
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={14} strokeWidth={2.5} /> Log Time
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProjectId(e.target.value)}
          style={{
            padding: '9px 14px',
            fontSize: 13,
            width: 220,
            cursor: 'pointer',
          }}
        >
          <option value="">All projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <EmptyState
          message="No time entries yet."
          action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus size={13} /> Log your first entry</Button>}
        />
      ) : (
        <div>
          {filteredEntries.map(entry => {
            const project = projects.find(p => p.id === entry.projectId)
            return (
              <TimeEntryRow
                key={entry.id}
                entry={entry}
                projectName={project ? project.name : ''}
                onDelete={() => deleteTimeEntry(entry.id)}
              />
            )
          })}
        </div>
      )}

      <TimeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={data => { addTimeEntry(data); setShowForm(false) }}
      />

    </div>
  )
}
