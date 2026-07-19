import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';
import ProjectEditModal from './ProjectEditModal';
import TaskManager from './TaskManager';
import ProjectFilters from './ProjectFilters';
import ProjectList from './ProjectList';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workers, setWorkers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [tasksModalOpen, setTasksModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filters, setFilters] = useState({
        startDateFrom: '',
        startDateTo: '',
        priorityFrom: '',
        priorityTo: '',
        orderBy: 'name',
        descending: false
    });

    const fetchWorkers = () => {
        axios.get('/api/workers')
            .then(response => setWorkers(response.data))
            .catch(error => console.error(error));
    };

    const fetchCompanies = () => {
        axios.get('/api/companies')
            .then(response => setCompanies(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchWorkers();
        fetchCompanies();
    }, []);

    const fetchProjects = (params = '') => {
        axios.get(`/api/projects${params}`)
            .then(response => setProjects(response.data))
            .catch(error => console.error(error));
    };

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

    useEffect(() => {
        applyFilters();
    }, [filters]);

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const deleteProject = (id) => {
        if (window.confirm('Точно удалить?')) {
            axios.delete(`/api/projects/${id}`)
                .then(() => fetchProjects())
                .catch(error => console.error(error));
        }
    };

    const openTasksModal = (project) => {
        setSelectedProject(project);
        setTasksModalOpen(true);
    };

    return (
        <>
            <div>
                <h1>Список проектов</h1>

                <button onClick={() => setShowCreateModal(true)}>Создать проект</button>

                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                            <CreateProject
                                onProjectCreated={() => {
                                    setShowCreateModal(false);
                                    fetchProjects();
                                }}
                                workers={workers}
                            />
                        </div>
                    </div>
                )}

                <ProjectFilters
                    filters={filters}
                    setFilters={setFilters}
                    resetFilters={resetFilters}
                />

                <ProjectList
                    projects={projects}
                    onEdit={setEditingProject}
                    onDelete={deleteProject}
                    onTasks={openTasksModal}
                />

                {editingProject && (
                    <ProjectEditModal
                        project={editingProject}
                        workers={workers}
                        companies={companies}
                        onClose={() => setEditingProject(null)}
                        onSave={fetchProjects}
                    />
                )}

                {tasksModalOpen && selectedProject && (
                    <TaskManager
                        project={selectedProject}
                        workers={workers}
                        onClose={() => setTasksModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default Projects;