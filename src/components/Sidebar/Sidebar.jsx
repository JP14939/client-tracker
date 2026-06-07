import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, FolderKanban, Timer, CheckSquare, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePings } from '../../hooks/usePings'

const navItems = [
  { to: '/',           label: 'Dashboard',   Icon: LayoutDashboard, end: true },
  { to: '/clients',    label: 'Clients',      Icon: Users },
  { to: '/projects',   label: 'Projects',     Icon: FolderKanban },
  { to: '/time',       label: 'Time Tracker', Icon: Timer },
  { to: '/milestones', label: 'Milestones',   Icon: CheckSquare },
  { to: '/pings',      label: 'Pings',        Icon: Bell },
]

export default function Sidebar() {
  const { session, logout } = useAuth()
  const { unreadCount } = usePings()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = (session?.name ?? 'P')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside style={{
      width: 216, flexShrink: 0, position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column',
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(64px) saturate(200%)',
      WebkitBackdropFilter: 'blur(64px) saturate(200%)',
      borderRight: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.18)',
    }}>
      {/* specular top edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28) 40%, rgba(255,255,255,0.28) 60%, transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(140deg, #9b74ff, #7c5cfc)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#fff',
          boxShadow: '0 2px 10px rgba(124,92,252,0.4), inset 0 1px 0 rgba(255,255,255,0.18)',
          flexShrink: 0,
        }}>CF</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', color: 'var(--text)' }}>
          Client<span style={{ color: 'var(--accent2)' }}>Flow</span>
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        <p style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)', padding: '0 8px', marginBottom: 6,
        }}>Menu</p>

        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 10px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none', transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              fontSize: 13.5, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.48)',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.14), 0 1px 6px rgba(0,0,0,0.18)' : 'none',
              border: isActive ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {label === 'Pings' && unreadCount > 0 && (
                  <span style={{
                    background: 'var(--accent)', color: '#fff',
                    borderRadius: 99, fontSize: 10, fontWeight: 700,
                    padding: '1px 6px', minWidth: 18, textAlign: 'center',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User pill + logout */}
      <div style={{ padding: '10px 8px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '8px 10px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10.5, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.name ?? 'Producer'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>Producer</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.28)', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center', flexShrink: 0,
              transition: 'color 0.15s',
            }}
          >
            <LogOut size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  )
}
