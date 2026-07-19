import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/Context';
import Projects from './components/Projects';
import Workers from './components/Workers';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const AppContent = () => {
    const { user, loading, logout } = useAuth();

    if (loading) return <div>Загрузка...</div>;

    if (!user) {
        return (
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }

    const canManageWorkers = user?.roles?.some(r => r === 'Admin' || r === 'ProjectManager');

    return (
        <>
            <nav style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/">Проекты</Link>
                {canManageWorkers && (
                    <Link to="/workers">Сотрудники</Link>
                )}
                <span style={{ marginLeft: 'auto' }}>{user.email} ({user.roles?.join(', ')})</span>
                <button onClick={logout}>Выйти</button>
            </nav>
            <Routes>
                <Route path="/" element={<Projects />} />
                {canManageWorkers && (
                    <Route path="/workers" element={<Workers />} />
                )}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;