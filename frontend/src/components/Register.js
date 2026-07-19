import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password.length < 4) {
            setError('Пароль должен быть не короче 4 символов');
            return;
        }

        try {
            await axios.post('/api/auth/register', form);
            navigate('/');
        } catch {
            setError('Ошибка регистрации. Проверьте данные');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Регистрация</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Имя"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Фамилия"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль (минимум 4 символа)"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <button type="submit">Зарегистрироваться</button>
            </form>
            <p>
                Уже есть аккаунт? <a href="/">Войти</a>
            </p>
        </div>
    );
};

export default Register;