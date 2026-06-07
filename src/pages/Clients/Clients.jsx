import { useState } from 'react'
import { Plus } from 'lucide-react'
import useClients from '../../hooks/useClients'
import Button from '../../components/Button/Button'
import EmptyState from '../../components/EmptyState/EmptyState'
import ClientCard from './ClientCard'
import ClientForm from './ClientForm'

export default function Clients() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const { clients, addClient, updateClient, deleteClient, addClientNote, deleteClientNote } = useClients();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Clients</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}><Plus size={14} strokeWidth={2.5} /> Add Client</Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          message="No clients yet."
          action={<Button onClick={() => setShowForm(true)}>Add your first client</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => setEditingClient(client)}
              onDelete={() => deleteClient(client.id)}
              addClientNote={addClientNote}
              deleteClientNote={deleteClientNote}
            />
          ))}
        </div>
      )}

      <ClientForm
        isOpen={showForm || editingClient !== null}
        client={editingClient}
        onClose={() => { setShowForm(false); setEditingClient(null); }}
        onSubmit={(data) => {
          editingClient ? updateClient(editingClient.id, data) : addClient(data);
          setShowForm(false);
          setEditingClient(null);
        }}
      />
    </div>
  );
}
