import { useState, useEffect } from 'react'
import useClients from '../../hooks/useClients'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/Button/Button'

export default function ProjectForm({ isOpen, onClose, onSubmit, project }) {
  const { clients } = useClients()

  const [form, setForm] = useState({
    name: '',
    clientId: clients[0]?.id || '',
    status: 'active',
    deadline: '',
  })

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        clientId: project.clientId,
        status: project.status,
        deadline: project.deadline || '',
      })
    } else {
      setForm({
        name: '',
        clientId: clients[0]?.id || '',
        status: 'active',
        deadline: '',
      })
    }
  }, [project])

  const fieldStyle = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: 8,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 13.5,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 0,
  }

  const fieldWrap = { marginBottom: 16 }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--muted)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'Add Project'}>
      <form onSubmit={handleSubmit}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Name</label>
          <input
            required
            type="text"
            style={fieldStyle}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Client</label>
          {clients.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>Add a client first.</p>
          ) : (
            <select
              style={fieldStyle}
              value={form.clientId}
              onChange={e => setForm({ ...form, clientId: e.target.value })}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Status</label>
          <select
            style={fieldStyle}
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="on-hold">on-hold</option>
          </select>
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Deadline</label>
          <input
            type="date"
            style={fieldStyle}
            value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  )
}
