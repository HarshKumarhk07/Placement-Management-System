import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, config);
            if (data.success) {
                setNotifications(data.data);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Optimistic update
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));

            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, config);
        } catch (error) {
            console.error("Error marking notification as read:", error);
            fetchNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);

            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {}, config);
        } catch (error) {
            console.error("Error marking all as read:", error);
            fetchNotifications();
        }
    };

    // Initial fetch and poller
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 60 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
