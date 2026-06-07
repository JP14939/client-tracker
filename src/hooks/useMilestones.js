import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/ids'

function fromDb(row) {
  if (!row) return null
  const { project_id, ...rest } = row
  return { ...rest, projectId: project_id }
}

function toDb(obj) {
  const { projectId, id, ...rest } = obj
  return { ...rest, ...(projectId !== undefined && { project_id: projectId }) }
}

export function useMilestones() {
  const [milestones, setMilestones] = useState([])

  useEffect(() => {
    supabase.from('milestones').select('*')
      .then(({ data }) => setMilestones((data ?? []).map(fromDb)))
  }, [])

  async function addMilestone(data) {
    const row = { id: generateId(), done: false, ...toDb(data) }
    const { data: saved } = await supabase.from('milestones').insert(row).select().single()
    if (saved) setMilestones(prev => [...prev, fromDb(saved)])
  }

  async function updateMilestone(id, data) {
    const { data: saved } = await supabase.from('milestones').update(toDb(data)).eq('id', id).select().single()
    if (saved) setMilestones(prev => prev.map(m => m.id === id ? fromDb(saved) : m))
  }

  async function deleteMilestone(id) {
    await supabase.from('milestones').delete().eq('id', id)
    setMilestones(prev => prev.filter(m => m.id !== id))
  }

  async function toggleMilestone(id) {
    const m = milestones.find(m => m.id === id)
    if (!m) return
    const { data: saved } = await supabase.from('milestones').update({ done: !m.done }).eq('id', id).select().single()
    if (saved) setMilestones(prev => prev.map(m => m.id === id ? fromDb(saved) : m))
  }

  function getMilestonesByProject(projectId) {
    return milestones.filter(m => m.projectId === projectId)
  }

  return { milestones, addMilestone, updateMilestone, deleteMilestone, toggleMilestone, getMilestonesByProject }
}

export default useMilestones
