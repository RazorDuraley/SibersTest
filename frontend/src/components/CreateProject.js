import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';
import WorkerSearch from './WorkerSearch';

const CreateProject = ({ onProjectCreated, workers }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [priority, setPriority] = useState(5);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectManagerId, setProjectManagerId] = useState('');
    const [customerCompanyId, setCustomerCompanyId] = useState('');
    const [executorCompanyId, setExecutorCompanyId] = useState('');
    const [selectedExecutors, setSelectedExecutors] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('/api/companies')
            .then(response => setCompanies(response.data))
            .catch(error => console.error(error));
    }, []);

    const validateStep = () => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!name.trim()) newErrors.name = 'Название обязательно';
                if (!startDate) newErrors.startDate = 'Дата начала обязательна';
                if (!endDate) newErrors.endDate = 'Дата окончания обязательна';
                if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                    newErrors.endDate = 'Дата начала не может быть позже даты окончания';
                }
                if (!priority || priority < 1 || priority > 10) {
                    newErrors.priority = 'Приоритет должен быть от 1 до 10';
                }
                break;

            case 2:
                if (!customerCompanyId) newErrors.customerCompanyId = 'Выберите компанию-заказчика';
                if (!executorCompanyId) newErrors.executorCompanyId = 'Выберите компанию-исполнителя';
                if (customerCompanyId && executorCompanyId && customerCompanyId === executorCompanyId) {
                    newErrors.executorCompanyId = 'Компании не могут совпадать';
                }
                break;

            case 3:
                if (!projectManagerId) newErrors.projectManagerId = 'Выберите руководителя';
                break;

            case 4:
                if (!selectedExecutors || selectedExecutors.length === 0) {
                    newErrors.selectedExecutors = 'Выберите хотя бы одного исполнителя';
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
            setErrors({});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        const newProject = {
            name,
            priority: parseInt(priority),
            startDate,
            endDate,
            customerCompanyId: customerCompanyId ? parseInt(customerCompanyId) : 1,
            executorCompanyId: executorCompanyId ? parseInt(executorCompanyId) : 1,
            projectManagerId: projectManagerId ? parseInt(projectManagerId) : null,
            executorIds: selectedExecutors.map(w => w.id)
        };

        axios.post('/api/projects', newProject)
            .then(() => {
                setName('');
                setPriority(5);
                setStartDate('');
                setEndDate('');
                setProjectManagerId('');
                setCustomerCompanyId('');
                setExecutorCompanyId('');
                setSelectedExecutors([]);
                setUploadedFiles([]);
                setStep(1);
                setErrors({});
                onProjectCreated();
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
        <form onSubmit={handleSubmit}>
            <h2>Создать проект</h2>

            {step === 1 && (
                <>
                    <h3>Шаг 1: Основные данные</h3>
                    <input
                        type="text"
                        placeholder="Название"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle('name')}
                    />
                    {errors.name && <div style={errorStyle}>{errors.name}</div>}

                    <input
                        type="number"
                        placeholder="Приоритет (1-10)"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        min="1"
                        max="10"
                        style={inputStyle('priority')}
                    />
                    {errors.priority && <div style={errorStyle}>{errors.priority}</div>}

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={inputStyle('startDate')}
                    />
                    {errors.startDate && <div style={errorStyle}>{errors.startDate}</div>}

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={inputStyle('endDate')}
                    />
                    {errors.endDate && <div style={errorStyle}>{errors.endDate}</div>}

                    <button type="button" onClick={nextStep}>Далее</button>
                </>
            )}

            {step === 2 && (
                <>
                    <h3>Шаг 2: Компании</h3>
                    <div>
                        <label>Компания-заказчик:</label>
                        <select
                            value={customerCompanyId}
                            onChange={(e) => setCustomerCompanyId(e.target.value)}
                            style={inputStyle('customerCompanyId')}
                        >
                            <option value="">Выберите компанию</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                        {errors.customerCompanyId && <div style={errorStyle}>{errors.customerCompanyId}</div>}
                    </div>

                    <div>
                        <label>Компания-исполнитель:</label>
                        <select
                            value={executorCompanyId}
                            onChange={(e) => setExecutorCompanyId(e.target.value)}
                            style={inputStyle('executorCompanyId')}
                        >
                            <option value="">Выберите компанию</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                        {errors.executorCompanyId && <div style={errorStyle}>{errors.executorCompanyId}</div>}
                    </div>

                    <button type="button" onClick={() => setStep(1)}>Назад</button>
                    <button type="button" onClick={nextStep}>Далее</button>
                </>
            )}

            {step === 3 && (
                <>
                    <h3>Шаг 3: Руководитель</h3>
                    <div>
                        <label>Руководитель проекта:</label>
                        <select
                            value={projectManagerId}
                            onChange={(e) => setProjectManagerId(e.target.value)}
                            style={inputStyle('projectManagerId')}
                        >
                            <option value="">Без руководителя</option>
                            {workers && workers.map(worker => (
                                <option key={worker.id} value={worker.id}>
                                    {worker.firstName} {worker.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.projectManagerId && <div style={errorStyle}>{errors.projectManagerId}</div>}
                    </div>

                    <button type="button" onClick={() => setStep(2)}>Назад</button>
                    <button type="button" onClick={nextStep}>Далее</button>
                </>
            )}

            {step === 4 && (
                <>
                    <h3>Шаг 4: Исполнители</h3>
                    <WorkerSearch
                        selected={selectedExecutors}
                        onSelect={(worker) => setSelectedExecutors([...selectedExecutors, worker])}
                        onRemove={(id) => setSelectedExecutors(selectedExecutors.filter(w => w.id !== id))}
                        placeholder="Введите имя или email..."
                    />
                    <button type="button" onClick={() => setStep(3)}>Назад</button>
                    <button type="button" onClick={nextStep}>Далее</button>
                </>
            )}

            {step === 5 && (
                <>
                    <h3>Шаг 5: Загрузка документов</h3>
                    <FileUploader onFilesUploaded={(files) => {
                        setUploadedFiles(files);
                    }} />
                    <button type="button" onClick={() => setStep(4)}>Назад</button>
                    <button type="submit">Создать проект</button>
                </>
            )}
        </form>
    );
};

export default CreateProject;