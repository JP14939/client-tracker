import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import { useEffect, useRef, lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './pages/Login/Login'
import ClientPortal from './pages/ClientPortal/ClientPortal'

const Dashboard    = lazy(() => import('./pages/Dashboard/Dashboard'))
const Clients      = lazy(() => import('./pages/Clients/Clients'))
const ClientDetail = lazy(() => import('./pages/Clients/ClientDetail'))
const Projects     = lazy(() => import('./pages/Projects/Projects'))
const ProjectDetail= lazy(() => import('./pages/Projects/ProjectDetail'))
const TimeTracker  = lazy(() => import('./pages/TimeTracker/TimeTracker'))
const Milestones   = lazy(() => import('./pages/Milestones/Milestones'))
const Pings        = lazy(() => import('./pages/Pings/Pings'))

const BG = () => (
  <div className="bg-canvas">
    <div className="orb orb-1" /><div className="orb orb-2" />
    <div className="orb orb-3" /><div className="orb orb-4" />
  </div>
)

const ROUTE_ORDER = ['/', '/clients', '/projects', '/time', '/milestones', '/pings']

function routeDepth(path) {
  const base = '/' + path.split('/')[1]
  const idx = ROUTE_ORDER.indexOf(base === '/' ? '/' : base)
  const isDetail = path.split('/').length > 2
  return (idx === -1 ? 0 : idx) * 10 + (isDetail ? 5 : 0)
}

function ProducerApp() {
  const location = useLocation()
  const navType = useNavigationType()
  const mainRef = useRef(null)
  const prevDepth = useRef(routeDepth(location.pathname))

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const currentDepth = routeDepth(location.pathname)
    const cls = navType === 'POP' || currentDepth < prevDepth.current ? 'slide-back' : 'slide-forward'
    prevDepth.current = currentDepth
    el.classList.remove('slide-forward', 'slide-back', 'slide-up')
    void el.offsetWidth
    el.classList.add(cls)
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', position: 'relative', zIndex: 1 }}>
      <Sidebar />
      <div ref={mainRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '28px 32px', position: 'relative', zIndex: 1 }}>
        <Suspense fallback={null}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/time" element={<TimeTracker />} />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/pings" element={<Pings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

function AppRouter() {
  const { session } = useAuth()
  const location = useLocation()

  // Not logged in
  if (!session) {
    if (location.pathname !== '/login') return <Navigate to="/login" replace />
    return <><BG /><Login /></>
  }

  // Client role
  if (session.role === 'client') {
    if (location.pathname !== '/portal') return <Navigate to="/portal" replace />
    return <><BG /><ClientPortal /></>
  }

  // Producer role
  if (location.pathname === '/login') return <Navigate to="/" replace />
  if (location.pathname === '/portal') return <Navigate to="/" replace />

  return <><BG /><ProducerApp /></>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}
