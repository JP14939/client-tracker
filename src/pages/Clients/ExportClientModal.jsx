import { useState, useEffect } from 'react'
import { FileText, Wifi, WifiOff, Loader } from 'lucide-react'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/Button/Button'
import { exportClientToPDF } from '../../hooks/useExport'
import { getItem } from '../../utils/storage'

export default function ExportClientModal({ isOpen, onClose, clientId }) {
  const [ollamaStatus, setOllamaStatus] = useState('checking') // checking | online | offline
  const [progress, setProgress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) { setOllamaStatus('checking'); setProgress(''); return }
    setOllamaStatus('checking')
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)
    fetch('/ollama/api/tags', { signal: ctrl.signal })
      .then(r => { clearTimeout(timer); return r.ok ? r.json() : Promise.reject() })
      .then(data => setOllamaStatus(data.models?.length > 0 ? 'online' : 'offline'))
      .catch(() => setOllamaStatus('offline'))
  }, [isOpen])

  // preview data
  const clients = getItem('ct_clients') ?? []
  const projects = getItem('ct_projects') ?? []
  const entries = getItem('ct_time_entries') ?? []
  const client = clients.find(c => c.id === clientId)
  const clientProjects = projects.filter(p => p.clientId === clientId)
  const clientEntries = entries.filter(e => clientProjects.some(p => p.id === e.projectId))
  const totalHours = clientEntries.reduce((s, e) => s + (e.hours || 0), 0)
  const notes = Array.isArray(client?.notes) ? client.notes : []

  async function handleExport() {
    setLoading(true)
    setProgress('Starting…')
    try {
      await exportClientToPDF(clientId, setProgress)
      onClose()
    } catch (e) {
      setProgress('Error generating PDF.')
    } finally {
      setLoading(false)
    }
  }

  if (!client) return null

  return (
    <Modal isOpen={isOpen} onClose={loading ? undefined : onClose} title="Export Client Report">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Ollama status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 8,
          background: ollamaStatus === 'online'
            ? 'rgba(34,211,165,0.08)' : ollamaStatus === 'offline'
            ? 'rgba(244,63,94,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${ollamaStatus === 'online'
            ? 'rgba(34,211,165,0.2)' : ollamaStatus === 'offline'
            ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
        }}>
          {ollamaStatus === 'checking' ? (
            <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
          ) : ollamaStatus === 'online' ? (
            <Wifi size={12} color="var(--green)" />
          ) : (
            <WifiOff size={12} color="var(--red)" />
          )}
          <span style={{ fontSize: 12, color: ollamaStatus === 'online' ? 'var(--green)' : ollamaStatus === 'offline' ? 'var(--red)' : 'var(--muted2)' }}>
            {ollamaStatus === 'checking' ? 'Checking Ollama…'
              : ollamaStatus === 'online' ? 'Ollama online — AI summary will be included'
              : 'Ollama offline — report will be generated without AI summary'}
          </span>
        </div>

        {/* Preview */}
        <div style={{
          background: 'rgba(124,92,252,0.07)',
          border: '1px solid rgba(124,92,252,0.15)',
          borderRadius: 10, padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <Row label="Client" value={client.name} bold />
          {client.company && <Row label="Company" value={client.company} />}
          <Row label="Projects" value={clientProjects.length} />
          <Row label="Time entries" value={clientEntries.length} />
          <Row label="Total hours" value={`${totalHours.toFixed(1)}h`} accent />
          <Row label="Notes" value={notes.length} />
        </div>

        {/* Progress */}
        {progress ? (
          <p style={{ fontSize: 12, color: 'var(--muted2)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading && <Loader size={11} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
            {progress}
          </p>
        ) : null}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleExport} disabled={loading}
            style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
            <FileText size={13} />
            {loading ? 'Generating…' : 'Generate & Download PDF'}
          </Button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  )
}

function Row({ label, value, bold, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: bold || accent ? 600 : 400, color: accent ? 'var(--accent2)' : 'var(--text)' }}>
        {value}
      </span>
    </div>
  )
}
