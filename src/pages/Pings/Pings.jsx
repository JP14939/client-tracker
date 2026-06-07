import { Bell, CheckCheck } from 'lucide-react'
import usePings from '../../hooks/usePings'

export default function Pings() {
  const { pings, markRead, markAllRead, unreadCount } = usePings()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Pings</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>
            Messages from your clients
            {unreadCount > 0 && (
              <strong style={{ color: 'var(--accent2)', marginLeft: 6 }}>{unreadCount} unread</strong>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 9,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--muted2)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            <CheckCheck size={12} /> Mark all read
          </button>
        )}
      </div>

      {pings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px' }}>
          <Bell size={36} strokeWidth={1.2} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 14 }} />
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No pings yet.</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 4 }}>
            Client messages will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pings.map(ping => (
            <div
              key={ping.id}
              className="glass"
              onClick={() => !ping.read && markRead(ping.id)}
              style={{
                padding: '14px 16px',
                cursor: ping.read ? 'default' : 'pointer',
                borderColor: ping.read ? 'var(--glass-border)' : 'rgba(124,92,252,0.35)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!ping.read && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  )}
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), var(--green))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {ping.clientName.charAt(0).toUpperCase()}
                  </div>
                  <strong style={{ fontSize: 13, color: ping.read ? 'var(--muted2)' : 'var(--text)' }}>
                    {ping.clientName}
                  </strong>
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {new Date(ping.date).toLocaleString('en-GB', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <p style={{
                fontSize: 13, lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap',
                color: ping.read ? 'var(--muted)' : 'var(--text)',
                paddingLeft: 34,
              }}>
                {ping.message}
              </p>
              {!ping.read && (
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, paddingLeft: 34 }}>
                  Click to mark as read
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
