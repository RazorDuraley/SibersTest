import React from 'react';
import { useAuth } from '../context/Context';

const ProjectList = ({ projects, onEdit, onDelete, onTasks }) => {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('Admin');
    const isManager = user?.roles?.includes('ProjectManager');
    const canEdit = isAdmin || isManager;

    return (
        <ul>
            {projects.map(project => (
                <li key={project.id}>
                    {project.name} — Приоритет: {project.priority}
                    <div>
                        {canEdit && (
                            <>
                                <button onClick={() => onEdit(project)}>Редактировать</button>
                                <button onClick={() => onTasks(project)}>Задачи</button>
                            </>
                        )}
                        {isAdmin && (
                            <button onClick={() => onDelete(project.id)}>Удалить</button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProjectList;