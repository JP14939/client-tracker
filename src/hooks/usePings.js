import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateId } from '../utils/ids'

function fromDb(row) {
  if (!row) return null
  const { client_id, client_name, ...rest } = row
  return { ...rest, clientId: client_id, clientName: client_name }
}

export function usePings() {
  const [pings, setPings] = useState([])

  useEffect(() => {
    supabase.from('pings').select('*').order('date', { ascending: false })
      .then(({ data }) => setPings((data ?? []).map(fromDb)))

    // Real-time: new pings appear instantly for the producer
    const channel = supabase
      .channel('pings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pings' }, ({ new: row }) => {
        setPings(prev => [fromDb(row), ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function sendPing(clientId, clientName, message) {
    const row = {
      id: generateId(),
      client_id: clientId,
      client_name: clientName,
      message,
      date: new Date().toISOString(),
      read: false,
    }
    await supabase.from('pings').insert(row)
    // real-time subscription handles adding to state on producer side
    // on client side, optimistic update:
    setPings(prev => [fromDb(row), ...prev])
  }

  async function markRead(id) {
    await supabase.from('pings').update({ read: true }).eq('id', id)
    setPings(prev => prev.map(p => p.id === id ? { ...p, read: true } : p))
  }

  async function markAllRead() {
    await supabase.from('pings').update({ read: true }).eq('read', false)
    setPings(prev => prev.map(p => ({ ...p, read: true })))
  }

  const unreadCount = pings.filter(p => !p.read).length

  return { pings, sendPing, markRead, markAllRead, unreadCount }
}

export default usePings
