import { useState, useEffect } from 'react';
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

export default function ClientForm({ isOpen, onClose, onSubmit, client }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', status: 'active' });

  useEffect(() => {
    if (client) {
      setForm({ name: client.name, email: client.email, company: client.company, status: client.status });
    } else {
      setForm({ name: '', email: '', company: '', status: 'active' });
    }
  }, [client]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? 'Edit Client' : 'Add Client'}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Company</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="active">active</option>
            <option value="paused">paused</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
