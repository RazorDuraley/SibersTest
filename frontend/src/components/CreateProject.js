import React, { useState } from 'react';
import axios from 'axios';


const CreateProject = ({ onProjectCreated }) => {
    const [name, setName] = useState('');
    const [priority, setPriority] = useState(5);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProject = {
            name,
            priority: parseInt(priority),
            startDate,
            endDate,
            customerCompanyId: 1, // временно, пока нет выбора
            executorCompanyId: 1,
        };

        axios.post('/api/projects', newProject)
            .then(() => {
                setName('');
                setPriority(5);
                setStartDate('');
                setEndDate('');
                onProjectCreated(); // обновляем список
            })
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Создать проект</h2>
            <input
                type="text"
                placeholder="Название"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Приоритет (1-10)"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                min="1"
                max="10"
            />
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
            <button type="submit">Создать проект</button>
        </form>
    );
};

export default CreateProject;