import React, { useState, useEffect } from 'react';
import useProjects from '../../hooks/useProjects';
import useClients from '../../hooks/useClients';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';

const inputStyle = {
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
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--muted)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

export default function TimeForm({ isOpen, onClose, onSubmit }) {
  const { projects } = useProjects();
  const { clients } = useClients();

  const [form, setForm] = useState({
    clientId: '',
    projectId: '',
    date: '',
    hours: '',
    description: '',
  });

  const filteredProjects = form.clientId
    ? projects.filter(p => p.clientId === form.clientId)
    : projects;

  useEffect(() => {
    if (!isOpen) return;
    const firstClient = clients[0];
    const clientId = firstClient?.id || '';
    const firstProject = projects.find(p => !clientId || p.clientId === clientId);
    setForm({
      clientId,
      projectId: firstProject?.id || '',
      date: new Date().toISOString().slice(0, 10),
      hours: '',
      description: '',
    });
  }, [isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleClientChange(e) {
    const clientId = e.target.value;
    const firstProject = projects.find(p => !clientId || p.clientId === clientId);
    setForm(prev => ({ ...prev, clientId, projectId: firstProject?.id || '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ projectId: form.projectId, date: form.date, hours: parseFloat(form.hours), description: form.description });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Time">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Client</label>
          {clients.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Add a client first.</p>
          ) : (
            <select name="clientId" value={form.clientId} onChange={handleClientChange} style={inputStyle}>
              <option value="">All clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Project</label>
          {filteredProjects.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              {form.clientId ? 'No projects for this client.' : 'Add a project first.'}
            </p>
          ) : (
            <select name="projectId" value={form.projectId} onChange={handleChange} style={inputStyle}>
              {filteredProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Hours</label>
          <input
            type="number"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            min={0.25}
            step={0.25}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!form.projectId}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}
