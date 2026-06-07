import { useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateId } from '../utils/ids';

const CLIENTS_KEY = 'ct_clients';
const PROJECTS_KEY = 'ct_projects';
const TIME_ENTRIES_KEY = 'ct_time_entries';
const MILESTONES_KEY = 'ct_milestones';

export function useClients() {
  const [clients, setClients] = useState(() => getItem(CLIENTS_KEY) ?? []);

  function addClient(data) {
    const newClient = { id: generateId(), createdAt: new Date().toISOString(), notes: [], ...data };
    setClients(prev => {
      const updated = [...prev, newClient];
      setItem(CLIENTS_KEY, updated);
      return updated;
    });
  }

  function updateClient(id, data) {
    setClients(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...data } : c));
      setItem(CLIENTS_KEY, updated);
      return updated;
    });
  }

  function deleteClient(id) {
    setClients(prev => {
      const updatedClients = prev.filter(c => c.id !== id);
      setItem(CLIENTS_KEY, updatedClients);
      return updatedClients;
    });

    const projects = getItem(PROJECTS_KEY) ?? [];
    const deletedProjectIds = new Set(
      projects.filter(p => p.clientId === id).map(p => p.id)
    );
    const updatedProjects = projects.filter(p => p.clientId !== id);
    setItem(PROJECTS_KEY, updatedProjects);

    const timeEntries = getItem(TIME_ENTRIES_KEY) ?? [];
    setItem(TIME_ENTRIES_KEY, timeEntries.filter(e => !deletedProjectIds.has(e.projectId)));

    const milestones = getItem(MILESTONES_KEY) ?? [];
    setItem(MILESTONES_KEY, milestones.filter(m => !deletedProjectIds.has(m.projectId)));
  }

  function getClientById(id) {
    return clients.find(c => c.id === id);
  }

  function addClientNote(clientId, text) {
    const note = { id: generateId(), text, date: new Date().toISOString() };
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.id !== clientId) return c;
        const existing = Array.isArray(c.notes) ? c.notes : [];
        return { ...c, notes: [note, ...existing] };
      });
      setItem(CLIENTS_KEY, updated);
      return updated;
    });
  }

  function deleteClientNote(clientId, noteId) {
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.id !== clientId) return c;
        const existing = Array.isArray(c.notes) ? c.notes : [];
        return { ...c, notes: existing.filter(n => n.id !== noteId) };
      });
      setItem(CLIENTS_KEY, updated);
      return updated;
    });
  }

  return { clients, addClient, updateClient, deleteClient, getClientById, addClientNote, deleteClientNote };
}

export default useClients;
