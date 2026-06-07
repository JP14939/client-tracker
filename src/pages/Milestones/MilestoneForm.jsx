import { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import useProjects from '../../hooks/useProjects';

export default function MilestoneForm({ isOpen, onClose, onSubmit }) {
  const { projects } = useProjects();
  const [form, setForm] = useState({ projectId: '', title: '', dueDate: '' });

  useEffect(() => {
    if (isOpen) {
      setForm({ projectId: projects[0]?.id || '', title: '', dueDate: '' });
    }
  }, [isOpen]);

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
    marginBottom: 0,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Milestone">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Project</label>
          {projects.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>Add a project first.</p>
          ) : (
            <select
              style={inputStyle}
              value={form.projectId}
              onChange={e => setForm({ ...form, projectId: e.target.value })}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            required
            style={inputStyle}
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            style={inputStyle}
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
