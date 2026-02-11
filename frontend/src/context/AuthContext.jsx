import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Verify token with backend
                const { data } = await api.get('/auth/me');
                const profileData = data.data || data;
                setUser({ ...profileData, token });
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
            setLoading(false);
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        checkUser();

        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        const userData = data.data || data;
        localStorage.setItem('token', userData.accessToken);
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        const newUser = data.data || data;
        localStorage.setItem('token', newUser.accessToken);
        setUser(newUser);
        return newUser;
    };

    const logout = async () => {
        try {
            // Call backend to clear refresh token cookie
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local state even if backend call fails
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};
