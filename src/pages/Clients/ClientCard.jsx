import { useState } from 'react'
import { Pencil, Trash2, FileText } from 'lucide-react'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import ClientNotes from './ClientNotes'
import ExportClientModal from './ExportClientModal'

export default function ClientCard({ client, onEdit, onDelete, addClientNote, deleteClientNote }) {
  const [showExport, setShowExport] = useState(false)

  const notes = Array.isArray(client.notes) ? client.notes : []

  return (
    <div className="glass" style={{ padding: '14px 16px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <strong style={{ fontSize: 14, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{client.name}</strong>
          {client.email && <span style={{ color: 'var(--muted2)', fontSize: 12.5 }}>{client.email}</span>}
          {client.company && <span style={{ color: 'var(--muted)', fontSize: 12 }}>{client.company}</span>}
          <div style={{ marginTop: 5 }}><Badge status={client.status} /></div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 12 }}>
          <Button variant="icon" onClick={onEdit} title="Edit client"><Pencil size={13} strokeWidth={2} /></Button>
          <Button variant="icon" onClick={() => setShowExport(true)} title="Export PDF"
            style={{ color: 'var(--accent2)', borderColor: 'rgba(124,92,252,0.25)' }}>
            <FileText size={13} strokeWidth={2} />
          </Button>
          <Button variant="danger" onClick={onDelete} style={{ padding: 6, borderRadius: 8 }}><Trash2 size={13} strokeWidth={2} /></Button>
        </div>
      </div>

      {/* Notes section */}
      <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Notes
        </span>
        <div style={{ marginTop: 8 }}>
          <ClientNotes
            clientId={client.id}
            notes={notes}
            addClientNote={addClientNote}
            deleteClientNote={deleteClientNote}
          />
        </div>
      </div>

      <ExportClientModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        clientId={client.id}
      />
    </div>
  )
}
