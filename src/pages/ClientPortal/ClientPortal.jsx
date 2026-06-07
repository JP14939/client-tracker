import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Send } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePings } from '../../hooks/usePings'
import { getItem } from '../../utils/storage'
import { formatDate, formatHours } from '../../utils/formatters'
import Badge from '../../components/Badge/Badge'

export default function ClientPortal() {
  const { session, logout } = useAuth()
  const { sendPing } = usePings()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const clients = getItem('ct_clients') ?? []
  const projects = getItem('ct_projects') ?? []
  const timeEntries = getItem('ct_time_entries') ?? []

  const client = clients.find(c => c.id === session?.clientId)
  const clientProjects = projects.filter(p => p.clientId === session?.clientId)
  const notes = Array.isArray(client?.notes) ? [...client.notes].sort((a, b) => new Date(b.date) - new Date(a.date)) : []

  function handlePing(e) {
    e.preventDefault()
    if (!message.trim()) return
    sendPing(session.clientId, session.name, message.trim())
    setMessage('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <header style={{
        padding: '14px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(140deg, #9b74ff, #7c5cfc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#fff',
          }}>CF</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
            Client<span style={{ color: 'var(--accent2)' }}>Flow</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted2)' }}>
            Hello, <strong style={{ color: 'var(--text)' }}>{session?.name}</strong>
          </span>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--muted)', borderRadius: 8, padding: '5px 11px',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            <LogOut size={11} /> Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: '36px 32px', maxWidth: 680, width: '100%', margin: '0 auto', flex: 1 }}>
        <h1 style={{ marginBottom: 4 }}>Your Portal</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 36 }}>
          View your projects and get in touch with your producer.
        </p>

        {/* Projects */}
        <Section label="Your Projects">
          {clientProjects.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>No projects on record yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {clientProjects.map(proj => {
                const hours = timeEntries
                  .filter(e => e.projectId === proj.id)
                  .reduce((s, e) => s + (e.hours || 0), 0)
                return (
                  <div key={proj.id} className="glass" style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <strong style={{ fontSize: 14, fontFamily: 'var(--font-display)' }}>{proj.name}</strong>
                      <Badge status={proj.status} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted2)' }}>
                      {proj.deadline && <span>Due: {formatDate(proj.deadline)}</span>}
                      <span style={{ color: 'var(--accent2)', fontWeight: 500 }}>{formatHours(hours)} logged</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        {/* Notes from producer */}
        {notes.length > 0 && (
          <Section label="Notes from your producer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notes.map(note => (
                <div key={note.id} className="glass" style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 4, fontWeight: 500 }}>
                    {new Date(note.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Ping form */}
        <Section label="Send a ping">
          <form onSubmit={handlePing} className="glass" style={{ padding: '14px 16px' }}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write a message to your producer…"
              rows={4}
              style={{
                width: '100%', marginBottom: 10, resize: 'vertical',
                background: 'transparent', border: 'none', borderRadius: 0,
                boxShadow: 'none', outline: 'none',
                fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-body)', lineHeight: 1.55,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--green)', opacity: sent ? 1 : 0, transition: 'opacity 0.2s' }}>
                ✓ Ping sent!
              </span>
              <button
                type="submit"
                disabled={!message.trim()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 9,
                  background: message.trim() ? 'rgba(124,92,252,0.75)' : 'rgba(255,255,255,0.06)',
                  color: message.trim() ? '#fff' : 'var(--muted)',
                  border: '1px solid rgba(124,92,252,0.4)',
                  fontSize: 13, fontWeight: 500,
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}
              >
                <Send size={12} /> Send Ping
              </button>
            </div>
          </form>
        </Section>
      </div>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 600, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12,
      }}>
        {label}
      </h2>
      {children}
    </section>
  )
}
