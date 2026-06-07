import { useState } from 'react'
import { getItem, setItem } from '../utils/storage'
import { generateId } from '../utils/ids'

const KEY = 'ct_pings'

export function usePings() {
  const [pings, setPings] = useState(() => getItem(KEY) ?? [])

  function save(updater) {
    setPings(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      setItem(KEY, updated)
      return updated
    })
  }

  function sendPing(clientId, clientName, message) {
    save(prev => [
      { id: generateId(), clientId, clientName, message, date: new Date().toISOString(), read: false },
      ...prev,
    ])
  }

  function markRead(id) {
    save(prev => prev.map(p => p.id === id ? { ...p, read: true } : p))
  }

  function markAllRead() {
    save(prev => prev.map(p => ({ ...p, read: true })))
  }

  const unreadCount = pings.filter(p => !p.read).length

  return { pings, sendPing, markRead, markAllRead, unreadCount }
}

export default usePings
