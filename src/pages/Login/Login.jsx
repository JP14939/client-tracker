import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getItem } from '../../utils/storage'

export default function Login() {
  const [role, setRole] = useState('producer')
  const [producerName, setProducerName] = useState('')
  const [password, setPassword] = useState('')
  const [clientName, setClientName] = useState('')
  const [error, setError] = useState('')
  const { loginProducer, loginClient } = useAuth()
  const navigate = useNavigate()

  function handleProducer(e) {
    e.preventDefault()
    setError('')
    const ok = loginProducer(producerName, password)
    if (ok) navigate('/', { replace: true })
    else setError('Incorrect password.')
  }

  function handleClient(e) {
    e.preventDefault()
    setError('')
    const clients = getItem('ct_clients') ?? []
    const match = clients.find(c => c.name.toLowerCase() === clientName.trim().toLowerCase())
    if (!match) { setError('No client found with that name. Contact your producer.'); return }
    loginClient(match.id, match.name)
    navigate('/portal', { replace: true })
  }

  return (
    // flex: 1 fills #root's flex container so justifyContent: center works on full viewport width
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', zIndex: 1,
    }}>
      <div className="glass" style={{
        width: 380, padding: '32px 28px', borderRadius: 20,
        boxShadow: '0 32px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(140deg, #9b74ff, #7c5cfc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#fff',
            boxShadow: '0 2px 10px rgba(124,92,252,0.4)',
          }}>CF</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
              Client<span style={{ color: 'var(--accent2)' }}>Flow</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>Sign in to continue</div>
          </div>
        </div>

        {/* Role toggle */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 24,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: 4,
        }}>
          {['producer', 'client'].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setError('') }}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 7,
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s',
                ...(role === r
                  ? { background: 'rgba(124,92,252,0.25)', color: 'var(--accent2)', boxShadow: '0 1px 6px rgba(0,0,0,0.2)' }
                  : { background: 'transparent', color: 'var(--muted)' }
                ),
              }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Producer form */}
        {role === 'producer' && (
          <form onSubmit={handleProducer}>
            <label style={labelStyle}>Your name</label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <User size={13} style={iconStyle} />
              <input
                type="text"
                value={producerName}
                onChange={e => setProducerName(e.target.value)}
                placeholder="Enter your name"
                required
                autoFocus
                style={inputWithIcon}
              />
            </div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Lock size={13} style={iconStyle} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={inputWithIcon}
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
            <button type="submit" style={submitStyle}>Sign In</button>
          </form>
        )}

        {/* Client form */}
        {role === 'client' && (
          <form onSubmit={handleClient}>
            <label style={labelStyle}>Your name</label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <User size={13} style={iconStyle} />
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Enter your name"
                required
                autoFocus
                style={inputWithIcon}
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
            <button type="submit" style={submitStyle}>Enter Portal</button>
          </form>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 11.5, fontWeight: 500,
  color: 'rgba(255,255,255,0.45)', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.07em',
}

const iconStyle = {
  position: 'absolute', left: 12, top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
  zIndex: 1,
}

// Explicit full padding so the global `padding: 9px 12px` doesn't clobber paddingLeft
const inputWithIcon = {
  padding: '9px 12px 9px 36px',
}

const errorStyle = {
  color: 'var(--red)', fontSize: 12, margin: '0 0 12px',
}

const submitStyle = {
  width: '100%', padding: '10px 0',
  background: 'rgba(124,92,252,0.75)', color: '#fff',
  border: '1px solid rgba(124,92,252,0.5)', borderRadius: 9,
  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.18s',
  boxShadow: '0 2px 12px rgba(124,92,252,0.3)',
}
