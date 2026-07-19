import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Context';

const Workers = () => {
    const { user } = useAuth();
    const [workers, setWorkers] = useState([]);
    const [newWorker, setNewWorker] = useState({ firstName: '', lastName: '', email: '' });
    const [editingWorker, setEditingWorker] = useState(null);
    const isAdmin = user?.roles?.includes('Admin');

    const fetchWorkers = () => {
        axios.get('/api/workers')
            .then(response => setWorkers(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const createWorker = () => {
        if (!newWorker.firstName || !newWorker.lastName) {
            alert('Имя и фамилия обязательны');
            return;
        }
        axios.post('/api/workers', {
            firstName: newWorker.firstName,
            lastName: newWorker.lastName,
            email: newWorker.email
        })
            .then(() => {
                setNewWorker({ firstName: '', lastName: '', email: '' });
                fetchWorkers();
            })
            .catch(error => console.error(error));
    };

    const deleteWorker = (id) => {
        if (window.confirm('Удалить сотрудника?')) {
            axios.delete(`/api/workers/${id}`)
                .then(() => fetchWorkers())
                .catch(error => console.error(error));
        }
    };

    const saveWorker = () => {
        const workerData = {
            id: editingWorker.id,
            firstName: editingWorker.firstName,
            lastName: editingWorker.lastName,
            patronymic: editingWorker.patronymic || null,
            email: editingWorker.email
        };

        axios.put(`/api/workers/${editingWorker.id}`, workerData)
            .then(() => {
                setEditingWorker(null);
                fetchWorkers();
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h2>Сотрудники</h2>

            {isAdmin && (
                <div>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={newWorker.firstName}
                        onChange={(e) => setNewWorker({ ...newWorker, firstName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={newWorker.lastName}
                        onChange={(e) => setNewWorker({ ...newWorker, lastName: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newWorker.email}
                        onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                    />
                    <button onClick={createWorker}>Добавить сотрудника</button>
                </div>
            )}

            <ul>
                {workers.map(worker => (
                    <li key={worker.id}>
                        {worker.firstName} {worker.lastName} {worker.patronymic} — {worker.email}
                        {isAdmin && (
                            <div>
                                <button onClick={() => setEditingWorker(worker)}>Редактировать</button>
                                <button onClick={() => deleteWorker(worker.id)}>Удалить</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {editingWorker && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setEditingWorker(null)}>×</button>
                        <h2>Редактировать сотрудника</h2>

                        <input
                            type="text"
                            placeholder="Имя"
                            value={editingWorker.firstName || ''}
                            onChange={(e) => setEditingWorker({ ...editingWorker, firstName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Фамилия"
                            value={editingWorker.lastName || ''}
                            onChange={(e) => setEditingWorker({ ...editingWorker, lastName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Отчество"
                            value={editingWorker.patronymic || ''}
                            onChange={(e) => setEditingWorker({ ...editingWorker, patronymic: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingWorker.email || ''}
                            onChange={(e) => setEditingWorker({ ...editingWorker, email: e.target.value })}
                        />

                        <button onClick={saveWorker}>Сохранить</button>
                        <button onClick={() => setEditingWorker(null)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workers;