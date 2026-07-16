import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [filters, setFilters] = useState({
        startDateFrom: '',
        startDateTo: '',
        priorityFrom: '',
        priorityTo: '',
        orderBy: 'name',
        descending: false
    });

    // Загрузка проектов с параметрами
    const fetchProjects = (params = '') => {
        axios.get(`/api/projects${params}`)
            .then(response => setProjects(response.data))
            .catch(error => console.error(error));
    };

    // Применение фильтров
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.startDateFrom) params.append('startDateFrom', filters.startDateFrom);
        if (filters.startDateTo) params.append('startDateTo', filters.startDateTo);
        if (filters.priorityFrom) params.append('priorityFrom', filters.priorityFrom);
        if (filters.priorityTo) params.append('priorityTo', filters.priorityTo);
        if (filters.orderBy) params.append('orderBy', filters.orderBy);
        if (filters.descending) params.append('descending', 'true');

        fetchProjects(`?${params.toString()}`);
    };

    // Автообновление при изменении фильтров
    useEffect(() => {
        applyFilters();
    }, [filters]);

    // Первоначальная загрузка
    useEffect(() => {
        fetchProjects();
    }, []);

    // Сброс фильтров
    const resetFilters = () => {
        setFilters({
            startDateFrom: '',
            startDateTo: '',
            priorityFrom: '',
            priorityTo: '',
            orderBy: 'name',
            descending: false
        });
    };

    // Удаление проекта
    const deleteProject = (id) => {
        if (window.confirm('Точно удалить?')) {
            axios.delete(`/api/projects/${id}`)
                .then(() => fetchProjects())
                .catch(error => console.error(error));
        }
    };

    // Сохранение изменений после редактирования
    const saveEdit = () => {
        axios.put(`/api/projects/${editingProject.id}`, editingProject)
            .then(() => {
                setEditingProject(null);
                fetchProjects();
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Список проектов</h1>

            {/* Блок фильтров */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input
                    type="date"
                    value={filters.startDateFrom}
                    onChange={(e) => setFilters({ ...filters, startDateFrom: e.target.value })}
                    placeholder="Дата от"
                />
                <input
                    type="date"
                    value={filters.startDateTo}
                    onChange={(e) => setFilters({ ...filters, startDateTo: e.target.value })}
                    placeholder="Дата до"
                />
                <input
                    type="number"
                    value={filters.priorityFrom}
                    onChange={(e) => setFilters({ ...filters, priorityFrom: e.target.value })}
                    placeholder="Приоритет от"
                />
                <input
                    type="number"
                    value={filters.priorityTo}
                    onChange={(e) => setFilters({ ...filters, priorityTo: e.target.value })}
                    placeholder="Приоритет до"
                />
                <select
                    value={filters.orderBy}
                    onChange={(e) => setFilters({ ...filters, orderBy: e.target.value })}
                >
                    <option value="name">По названию</option>
                    <option value="startdate">По дате начала</option>
                    <option value="priority">По приоритету</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        checked={filters.descending}
                        onChange={(e) => setFilters({ ...filters, descending: e.target.checked })}
                    />
                    По убыванию
                </label>
                <button onClick={resetFilters}>Сбросить</button>
            </div>

            <CreateProject onProjectCreated={fetchProjects} />

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

            {editingProject && (
                <div className="modal">
                    <h2>Редактировать проект</h2>
                    <input
                        type="text"
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    />
                    <input
                        type="number"
                        value={editingProject.priority}
                        onChange={(e) => setEditingProject({ ...editingProject, priority: parseInt(e.target.value) })}
                    />
                    <button onClick={saveEdit}>Сохранить</button>
                    <button onClick={() => setEditingProject(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
};

export default Projects;