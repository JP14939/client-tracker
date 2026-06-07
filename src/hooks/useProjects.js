import { useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateId } from '../utils/ids';

const PROJECTS_KEY = 'ct_projects';
const TIME_ENTRIES_KEY = 'ct_time_entries';
const MILESTONES_KEY = 'ct_milestones';

export function useProjects() {
  const [projects, setProjects] = useState(() => getItem(PROJECTS_KEY) ?? []);

  function addProject(data) {
    const newProject = { id: generateId(), createdAt: new Date().toISOString(), ...data };
    setProjects(prev => {
      const updated = [...prev, newProject];
      setItem(PROJECTS_KEY, updated);
      return updated;
    });
  }

  function updateProject(id, data) {
    setProjects(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...data } : p));
      setItem(PROJECTS_KEY, updated);
      return updated;
    });
  }

  function deleteProject(id) {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      setItem(PROJECTS_KEY, updated);
      return updated;
    });

    const timeEntries = getItem(TIME_ENTRIES_KEY) ?? [];
    setItem(TIME_ENTRIES_KEY, timeEntries.filter(e => e.projectId !== id));

    const milestones = getItem(MILESTONES_KEY) ?? [];
    setItem(MILESTONES_KEY, milestones.filter(m => m.projectId !== id));
  }

  function getProjectsByClient(clientId) {
    return projects.filter(p => p.clientId === clientId);
  }

  return { projects, addProject, updateProject, deleteProject, getProjectsByClient };
}

export default useProjects;
