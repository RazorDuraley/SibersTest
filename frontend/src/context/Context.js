import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const Context = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        await axios.post('/api/auth/login', { email, password });
        await fetchUser();
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <Context.Provider value={{ user, loading, login, logout, fetchUser }}>
            {children}
        </Context.Provider>
    );
};

export const useAuth = () => useContext(Context);

export default Context;