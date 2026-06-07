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

export function useTimeEntries() {
  const [timeEntries, setTimeEntries] = useState([])

  useEffect(() => {
    supabase.from('time_entries').select('*')
      .then(({ data }) => setTimeEntries((data ?? []).map(fromDb)))
  }, [])

  async function addTimeEntry(data) {
    const row = { id: generateId(), ...toDb(data) }
    const { data: saved } = await supabase.from('time_entries').insert(row).select().single()
    if (saved) setTimeEntries(prev => [...prev, fromDb(saved)])
  }

  async function deleteTimeEntry(id) {
    await supabase.from('time_entries').delete().eq('id', id)
    setTimeEntries(prev => prev.filter(e => e.id !== id))
  }

  function getEntriesByProject(projectId) {
    return timeEntries.filter(e => e.projectId === projectId)
  }

  function getTotalHoursByProject(projectId) {
    return getEntriesByProject(projectId).reduce((sum, e) => sum + (e.hours || 0), 0)
  }

  function getHoursThisWeek() {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() || 7) - 1))
    monday.setHours(0, 0, 0, 0)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    function toDate(str) {
      const [y, m, d] = str.split('-').map(Number)
      return new Date(y, m - 1, d)
    }

    return timeEntries
      .filter(e => { const d = toDate(e.date); return d >= monday && d <= sunday })
      .reduce((sum, e) => sum + (e.hours || 0), 0)
  }

  return { timeEntries, addTimeEntry, deleteTimeEntry, getEntriesByProject, getTotalHoursByProject, getHoursThisWeek }
}

export default useTimeEntries
