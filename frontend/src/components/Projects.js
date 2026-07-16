import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);

    const refreshProjects = () => {
        axios.get('/api/projects')
            .then(response => setProjects(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        refreshProjects();
    }, []);

    const deleteProject = (id) => {
        if (window.confirm('Точно удалить?')) {
            axios.delete(`/api/projects/${id}`)
                .then(() => refreshProjects())
                .catch(error => console.error(error));
        }
    };

    const saveEdit = () => {
        axios.put(`/api/projects/${editingProject.id}`, editingProject)
            .then(() => {
                setEditingProject(null);
                refreshProjects();
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Список проектов</h1>
            <CreateProject onProjectCreated={refreshProjects} />
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        {project.name} — Приоритет: {project.priority}
                        <div>
                            <button onClick={() => setEditingProject(project)}>Редактировать</button>
                            <button onClick={() => deleteProject(project.id)}>Удалить</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Модальное окно ДОЛЖНО быть внутри return() */}
            {editingProject && (
                <div className="modal">
                    <h2>Редактировать проект</h2>
                    <input
                        type="text"
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                    />
                    <input
                        type="number"
                        value={editingProject.priority}
                        onChange={(e) => setEditingProject({...editingProject, priority: parseInt(e.target.value)})}
                    />
                    <button onClick={saveEdit}>Сохранить</button>
                    <button onClick={() => setEditingProject(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
};

export default Projects;