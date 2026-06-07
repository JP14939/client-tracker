import { useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateId } from '../utils/ids';

const KEY = 'ct_milestones';

export function useMilestones() {
  const [milestones, setMilestones] = useState(() => getItem(KEY) ?? []);

  function save(updater) {
    setMilestones(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      setItem(KEY, updated);
      return updated;
    });
  }

  function addMilestone(data) {
    save(prev => [...prev, { id: generateId(), ...data, done: false }]);
  }

  function updateMilestone(id, data) {
    save(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
  }

  function deleteMilestone(id) {
    save(prev => prev.filter(m => m.id !== id));
  }

  function toggleMilestone(id) {
    save(prev => prev.map(m => (m.id === id ? { ...m, done: !m.done } : m)));
  }

  function getMilestonesByProject(projectId) {
    return milestones.filter(m => m.projectId === projectId);
  }

  return {
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestone,
    getMilestonesByProject,
  };
}

export default useMilestones;
