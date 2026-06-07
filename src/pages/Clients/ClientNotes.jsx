import { useState } from 'react'
import { Trash2 } from 'lucide-react'

function formatNoteDate(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ClientNotes({ clientId, notes, addClientNote, deleteClientNote }) {
  const [draft, setDraft] = useState('')

  function handleAdd() {
    const text = draft.trim()
    if (!text) return
    addClientNote(clientId, text)
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd()
  }

  return (
    <div style={{ marginTop: 4 }}>
      {/* Existing notes */}
      {notes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          {notes.map(note => (
            <div key={note.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>
                  {formatNoteDate(note.date)}
                </span>
                <button
                  onClick={() => deleteClientNote(clientId, note.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted)', padding: '2px 4px', borderRadius: 4,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <Trash2 size={10} strokeWidth={2} />
                </button>
              </div>
              <p style={{
                fontSize: 12.5,
                color: 'var(--text)',
                lineHeight: 1.55,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add note */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note… (Ctrl+Enter to save)"
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 12.5,
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.55,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!draft.trim()}
          style={{
            alignSelf: 'flex-end',
            padding: '5px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            cursor: draft.trim() ? 'pointer' : 'not-allowed',
            border: '1px solid rgba(124,92,252,0.4)',
            background: draft.trim() ? 'rgba(124,92,252,0.18)' : 'rgba(255,255,255,0.04)',
            color: draft.trim() ? 'var(--accent)' : 'var(--muted)',
            transition: 'all 0.15s',
          }}
        >
          Add Note
        </button>
      </div>
    </div>
  )
}
