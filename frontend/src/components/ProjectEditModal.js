import React, { useState } from 'react';
import axios from 'axios';
import ProjectFileManager from './ProjectFileManager';

const ProjectEditModal = ({ project, workers, companies, onClose, onSave }) => {
    const [editingProject, setEditingProject] = useState({
        ...project,
        executorIds: project.executorIds || []
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!editingProject.name?.trim()) {
            newErrors.name = 'Название обязательно';
        }
        if (!editingProject.startDate) {
            newErrors.startDate = 'Дата начала обязательна';
        }
        if (!editingProject.endDate) {
            newErrors.endDate = 'Дата окончания обязательна';
        }
        if (editingProject.startDate && editingProject.endDate) {
            const start = new Date(editingProject.startDate);
            const end = new Date(editingProject.endDate);
            if (start > end) {
                newErrors.endDate = 'Дата начала не может быть позже даты окончания';
            }
        }
        if (!editingProject.priority || editingProject.priority < 1 || editingProject.priority > 10) {
            newErrors.priority = 'Приоритет должен быть от 1 до 10';
        }
        if (!editingProject.customerCompanyId) {
            newErrors.customerCompanyId = 'Выберите компанию-заказчика';
        }
        if (!editingProject.executorCompanyId) {
            newErrors.executorCompanyId = 'Выберите компанию-исполнителя';
        }
        if (editingProject.customerCompanyId && editingProject.executorCompanyId &&
            editingProject.customerCompanyId === editingProject.executorCompanyId) {
            newErrors.executorCompanyId = 'Компании не могут совпадать';
        }
        if (!editingProject.projectManagerId) {
            newErrors.projectManagerId = 'Выберите руководителя';
        }
        if (!editingProject.executorIds || editingProject.executorIds.length === 0) {
            newErrors.executorIds = 'Выберите хотя бы одного исполнителя';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveEdit = () => {
        if (!validate()) return;

        axios.put(`/api/projects/${editingProject.id}`, editingProject)
            .then(() => {
                onClose();
                onSave();
            })
            .catch(error => console.error(error));
    };

    const inputStyle = (field) => ({
        borderColor: errors[field] ? 'red' : '#ccc',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '8px',
        marginBottom: errors[field] ? '2px' : '8px',
        width: '100%',
        boxSizing: 'border-box'
    });

    const errorStyle = {
        color: 'red',
        fontSize: '12px',
        marginTop: '-4px',
        marginBottom: '8px'
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Редактировать проект</h2>

                <input
                    type="text"
                    placeholder="Название"
                    value={editingProject.name || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    style={inputStyle('name')}
                />
                {errors.name && <div style={errorStyle}>{errors.name}</div>}

                <input
                    type="number"
                    placeholder="Приоритет"
                    value={editingProject.priority || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, priority: parseInt(e.target.value) || '' })}
                    style={inputStyle('priority')}
                />
                {errors.priority && <div style={errorStyle}>{errors.priority}</div>}

                <input
                    type="date"
                    value={editingProject.startDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                    style={inputStyle('startDate')}
                />
                {errors.startDate && <div style={errorStyle}>{errors.startDate}</div>}

                <input
                    type="date"
                    value={editingProject.endDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                    style={inputStyle('endDate')}
                />
                {errors.endDate && <div style={errorStyle}>{errors.endDate}</div>}

                <div>
                    <label>Компания-заказчик:</label>
                    <select
                        value={editingProject.customerCompanyId || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, customerCompanyId: parseInt(e.target.value) })}
                        style={inputStyle('customerCompanyId')}
                    >
                        <option value="">Выберите компанию</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.customerCompanyId && <div style={errorStyle}>{errors.customerCompanyId}</div>}
                </div>

                <div>
                    <label>Компания-исполнитель:</label>
                    <select
                        value={editingProject.executorCompanyId || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, executorCompanyId: parseInt(e.target.value) })}
                        style={inputStyle('executorCompanyId')}
                    >
                        <option value="">Выберите компанию</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.executorCompanyId && <div style={errorStyle}>{errors.executorCompanyId}</div>}
                </div>

                <div>
                    <label>Руководитель:</label>
                    <select
                        value={editingProject.projectManagerId || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, projectManagerId: parseInt(e.target.value) || null })}
                        style={inputStyle('projectManagerId')}
                    >
                        <option value="">Без руководителя</option>
                        {workers.map(w => (
                            <option key={w.id} value={w.id}>{w.firstName} {w.lastName}</option>
                        ))}
                    </select>
                    {errors.projectManagerId && <div style={errorStyle}>{errors.projectManagerId}</div>}
                </div>

                <div>
                    <label>Исполнители (Ctrl для выбора нескольких):</label>
                    <select
                        multiple
                        value={editingProject.executorIds || []}
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
                            setEditingProject({ ...editingProject, executorIds: selected });
                        }}
                        style={{ minHeight: '100px', width: '100%', borderColor: errors.executorIds ? 'red' : '#ccc' }}
                    >
                        {workers.map(w => (
                            <option key={w.id} value={w.id}>{w.firstName} {w.lastName}</option>
                        ))}
                    </select>
                    {errors.executorIds && <div style={errorStyle}>{errors.executorIds}</div>}
                </div>

                <ProjectFileManager projectId={editingProject.id} />

                <button onClick={saveEdit}>Сохранить</button>
                <button onClick={onClose}>Отмена</button>
            </div>
        </div>
    );
};

export default ProjectEditModal;