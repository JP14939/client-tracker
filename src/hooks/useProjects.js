import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/ids'

function fromDb(row) {
  if (!row) return null
  const { client_id, created_at, ...rest } = row
  return { ...rest, clientId: client_id, createdAt: created_at }
}

function toDb(obj) {
  const { clientId, createdAt, id, ...rest } = obj
  return {
    ...rest,
    ...(clientId !== undefined && { client_id: clientId }),
    ...(createdAt !== undefined && { created_at: createdAt }),
  }
}

export function useProjects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at')
      .then(({ data }) => setProjects((data ?? []).map(fromDb)))
  }, [])

  async function addProject(data) {
    const row = { id: generateId(), created_at: new Date().toISOString(), ...toDb(data) }
    const { data: saved } = await supabase.from('projects').insert(row).select().single()
    if (saved) setProjects(prev => [...prev, fromDb(saved)])
  }

  async function updateProject(id, data) {
    const { data: saved } = await supabase.from('projects').update(toDb(data)).eq('id', id).select().single()
    if (saved) setProjects(prev => prev.map(p => p.id === id ? fromDb(saved) : p))
  }

  async function deleteProject(id) {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function getProjectsByClient(clientId) {
    return projects.filter(p => p.clientId === clientId)
  }

  return { projects, addProject, updateProject, deleteProject, getProjectsByClient }
}

export default useProjects
