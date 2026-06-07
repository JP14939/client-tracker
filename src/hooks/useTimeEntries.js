import { useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateId } from '../utils/ids';

const KEY = 'ct_time_entries';

export function useTimeEntries() {
  const [timeEntries, setTimeEntries] = useState(() => getItem(KEY) ?? []);

  function save(updater) {
    setTimeEntries(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      setItem(KEY, updated);
      return updated;
    });
  }

  function addTimeEntry(data) {
    save(prev => [...prev, { id: generateId(), ...data }]);
  }

  function deleteTimeEntry(id) {
    save(prev => prev.filter(e => e.id !== id));
  }

  function getEntriesByProject(projectId) {
    return timeEntries.filter(e => e.projectId === projectId);
  }

  function getTotalHoursByProject(projectId) {
    return getEntriesByProject(projectId).reduce((sum, e) => sum + e.hours, 0);
  }

  function getHoursThisWeek() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() || 7) - 1));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    function toDate(str) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    return timeEntries
      .filter(e => {
        const d = toDate(e.date);
        return d >= monday && d <= sunday;
      })
      .reduce((sum, e) => sum + e.hours, 0);
  }

  return {
    timeEntries,
    addTimeEntry,
    deleteTimeEntry,
    getEntriesByProject,
    getTotalHoursByProject,
    getHoursThisWeek,
  };
}

export default useTimeEntries;
