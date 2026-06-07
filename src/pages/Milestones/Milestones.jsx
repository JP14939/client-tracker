import { useState } from 'react'
import { Plus } from 'lucide-react'
import useMilestones from '../../hooks/useMilestones'
import useProjects from '../../hooks/useProjects'
import Button from '../../components/Button/Button'
import EmptyState from '../../components/EmptyState/EmptyState'
import MilestoneItem from './MilestoneItem'
import MilestoneForm from './MilestoneForm'

export default function Milestones() {
  const [showForm, setShowForm] = useState(false)
  const { milestones, addMilestone, deleteMilestone, toggleMilestone } = useMilestones()
  const { projects } = useProjects()

  const projectIds = Array.from(new Set(milestones.map(m => m.projectId)))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Milestones</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={14} strokeWidth={2.5} /> Add Milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <EmptyState
          message="No milestones yet."
          action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus size={13} /> Add your first milestone</Button>}
        />
      ) : (
        projectIds.map(projectId => {
          const projectName = projects.find(p => p.id === projectId)?.name || 'Unknown Project'
          const group = milestones.filter(m => m.projectId === projectId)
          return (
            <div key={projectId} style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted2)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {projectName}
              </h2>
              {group.map(milestone => (
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  onToggle={() => toggleMilestone(milestone.id)}
                  onDelete={() => deleteMilestone(milestone.id)}
                />
              ))}
            </div>
          )
        })
      )}

      <MilestoneForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={data => { addMilestone(data); setShowForm(false) }}
      />
    </div>
  )
}
