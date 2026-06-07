import { useState } from 'react'
import { Plus } from 'lucide-react'
import useProjects from '../../hooks/useProjects';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';

export default function Projects() {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { projects, addProject, updateProject, deleteProject } = useProjects();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Projects</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}><Plus size={14} strokeWidth={2.5} /> Add Project</Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          message="No projects yet."
          action={<Button onClick={() => setShowForm(true)}>Add your first project</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditingProject(project)}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </div>
      )}

      <ProjectForm
        isOpen={showForm || editingProject !== null}
        project={editingProject}
        onClose={() => { setShowForm(false); setEditingProject(null); }}
        onSubmit={(data) => {
          editingProject ? updateProject(editingProject.id, data) : addProject(data);
          setShowForm(false);
          setEditingProject(null);
        }}
      />
    </div>
  );
}
