import { createContext, useContext, useState } from 'react'

const KEY = 'ct_session'
const AuthContext = createContext(null)

function readSession() {
  try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  function save(s) {
    sessionStorage.setItem(KEY, JSON.stringify(s))
    setSession(s)
  }

  function loginProducer(name, password) {
    const expected = import.meta.env.VITE_PRODUCER_PASSWORD
    if (!expected || password !== expected) return false
    save({ role: 'producer', name: name.trim() || import.meta.env.VITE_PRODUCER_NAME || 'Producer' })
    return true
  }

  function loginClient(clientId, name) {
    save({ role: 'client', name, clientId })
  }

  function logout() {
    sessionStorage.removeItem(KEY)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, loginProducer, loginClient, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
