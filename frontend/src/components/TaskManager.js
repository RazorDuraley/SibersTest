import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = ({ project, workers, onClose }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        name: '',
        comment: '',
        priority: 5,
        status: 0,
        executorId: ''
    });

    const fetchTasks = () => {
        axios.get(`/api/tasks?projectId=${project.id}`)
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchTasks();
    }, [project.id]);

    const createTask = () => {
        if (!newTask.name) {
            alert('Название задачи обязательно');
            return;
        }

        const taskData = {
            name: newTask.name,
            comment: newTask.comment,
            priority: parseInt(newTask.priority),
            status: parseInt(newTask.status),
            projectId: project.id,
            authorId: 1,
            executorId: newTask.executorId ? parseInt(newTask.executorId) : null
        };

        axios.post('/api/tasks', taskData)
            .then(() => {
                setNewTask({ name: '', comment: '', priority: 5, status: 0, executorId: '' });
                fetchTasks();
            })
            .catch(error => console.error(error));
    };

    const updateTaskStatus = (taskId, newStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updatedTask = { ...task, status: newStatus };
        axios.put(`/api/tasks/${taskId}`, updatedTask)
            .then(() => fetchTasks())
            .catch(error => console.error(error));
    };

    const deleteTask = (taskId) => {
        if (window.confirm('Удалить задачу?')) {
            axios.delete(`/api/tasks/${taskId}`)
                .then(() => fetchTasks())
                .catch(error => console.error(error));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '700px' }}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Задачи проекта: {project.name}</h2>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Название задачи"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Комментарий"
                        value={newTask.comment}
                        onChange={(e) => setNewTask({ ...newTask, comment: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Приоритет"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        min="1"
                        max="10"
                    />
                    <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: parseInt(e.target.value) })}
                    >
                        <option value="0">ToDo</option>
                        <option value="1">InProgress</option>
                        <option value="2">Done</option>
                    </select>
                    <select
                        value={newTask.executorId}
                        onChange={(e) => setNewTask({ ...newTask, executorId: e.target.value })}
                    >
                        <option value="">Без исполнителя</option>
                        {workers.map(w => (
                            <option key={w.id} value={w.id}>{w.firstName} {w.lastName}</option>
                        ))}
                    </select>
                    <button onClick={createTask}>Добавить задачу</button>
                </div>

                <ul>
                    {tasks.map(task => (
                        <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{task.name}</strong> — Приоритет: {task.priority}
                                <span style={{ marginLeft: '10px', color: task.status === 2 ? 'green' : task.status === 1 ? 'orange' : 'gray' }}>
                                    {task.status === 0 ? 'ToDo' : task.status === 1 ? 'InProgress' : 'Done'}
                                </span>
                            </div>
                            <div>
                                <button onClick={() => updateTaskStatus(task.id, task.status === 2 ? 0 : task.status + 1)}>
                                    {task.status === 2 ? '↺' : '→'}
                                </button>
                                <button onClick={() => deleteTask(task.id)}>🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskManager;