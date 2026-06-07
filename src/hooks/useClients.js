import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/ids'

function fromDb(row) {
  if (!row) return null
  const { created_at, ...rest } = row
  return { ...rest, createdAt: created_at }
}

function toDb(obj) {
  const { createdAt, id, ...rest } = obj
  return { ...rest, ...(createdAt !== undefined && { created_at: createdAt }) }
}

export function useClients() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    supabase.from('clients').select('*').order('created_at')
      .then(({ data }) => setClients((data ?? []).map(fromDb)))
  }, [])

  async function addClient(data) {
    const row = { id: generateId(), created_at: new Date().toISOString(), notes: [], ...toDb(data) }
    const { data: saved } = await supabase.from('clients').insert(row).select().single()
    if (saved) setClients(prev => [...prev, fromDb(saved)])
  }

  async function updateClient(id, data) {
    const { data: saved } = await supabase.from('clients').update(toDb(data)).eq('id', id).select().single()
    if (saved) setClients(prev => prev.map(c => c.id === id ? fromDb(saved) : c))
  }

  async function deleteClient(id) {
    await supabase.from('clients').delete().eq('id', id)
    setClients(prev => prev.filter(c => c.id !== id))
  }

  function getClientById(id) {
    return clients.find(c => c.id === id)
  }

  async function addClientNote(clientId, text) {
    const client = clients.find(c => c.id === clientId)
    if (!client) return
    const note = { id: generateId(), text, date: new Date().toISOString() }
    const newNotes = [note, ...(Array.isArray(client.notes) ? client.notes : [])]
    const { data: saved } = await supabase.from('clients').update({ notes: newNotes }).eq('id', clientId).select().single()
    if (saved) setClients(prev => prev.map(c => c.id === clientId ? fromDb(saved) : c))
  }

  async function deleteClientNote(clientId, noteId) {
    const client = clients.find(c => c.id === clientId)
    if (!client) return
    const newNotes = (Array.isArray(client.notes) ? client.notes : []).filter(n => n.id !== noteId)
    const { data: saved } = await supabase.from('clients').update({ notes: newNotes }).eq('id', clientId).select().single()
    if (saved) setClients(prev => prev.map(c => c.id === clientId ? fromDb(saved) : c))
  }

  return { clients, addClient, updateClient, deleteClient, getClientById, addClientNote, deleteClientNote }
}

export default useClients
