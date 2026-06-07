import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Users2, FolderOpen, Clock, Flag, LayoutDashboard, Users, FolderKanban, Timer, CheckSquare } from 'lucide-react'
import useClients from '../../hooks/useClients'
import useProjects from '../../hooks/useProjects'
import useTimeEntries from '../../hooks/useTimeEntries'
import useMilestones from '../../hooks/useMilestones'
import { formatHours } from '../../utils/formatters'

const quickLinks = [
  { to: '/',           label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/clients',    label: 'Clients',      Icon: Users },
  { to: '/projects',   label: 'Projects',     Icon: FolderKanban },
  { to: '/time',       label: 'Time Tracker', Icon: Timer },
  { to: '/milestones', label: 'Milestones',   Icon: CheckSquare },
]

export default function Dashboard() {
  const { clients } = useClients()
  const { projects } = useProjects()
  const { timeEntries, getHoursThisWeek } = useTimeEntries()
  const { milestones } = useMilestones()

  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() || 7) - 1))
  monday.setHours(0, 0, 0, 0)

  const chartData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    const hours = timeEntries.filter(e => e.date === dateStr).reduce((sum, e) => sum + (e.hours || 0), 0)
    return { day, hours }
  })

  const stats = [
    { label: 'Clients',       value: clients.length,                                     color: 'var(--accent2)', Icon: Users2     },
    { label: 'Active',        value: projects.filter(p => p.status === 'active').length,  color: 'var(--green)',   Icon: FolderOpen },
    { label: 'Hours / week',  value: formatHours(getHoursThisWeek()),                     color: 'var(--amber)',   Icon: Clock      },
    { label: 'Milestones',    value: milestones.filter(m => !m.done).length,              color: 'var(--blue)',    Icon: Flag       },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Your freelance overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        {stats.map(({ label, value, color, Icon }) => (
          <div key={label} className="glass" style={{ padding: '18px 18px 16px', position: 'relative', overflow: 'hidden' }}>
            <Icon size={22} strokeWidth={1.4} style={{ color, opacity: 0.2, position: 'absolute', top: 16, right: 16 }} />
            <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart + quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 10 }}>
        <div className="glass" style={{ padding: '18px 18px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2>Hours This Week</h2>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              Total: <strong style={{ color: 'var(--accent2)' }}>{formatHours(getHoursThisWeek())}</strong>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={176}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -22, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 4 }} formatter={v => [`${v}h`, 'Hours']} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c5cfc" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <Bar dataKey="hours" fill="url(#barGrad)" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <h2 style={{ marginBottom: 8 }}>Quick Nav</h2>
          {quickLinks.map(({ to, label, Icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 10px', borderRadius: 9,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'var(--muted2)', fontSize: 13, fontWeight: 500,
              transition: 'all 0.15s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--muted2)' }}
            >
              <Icon size={13} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
