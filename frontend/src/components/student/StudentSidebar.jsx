import React, { useMemo } from 'react';
import {
    LayoutDashboard,
    FileText,
    Bell,
    User,
    LogOut
} from 'lucide-react';
import { ExpandableSidebar } from '../ui/ExpandableSidebar';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { unreadCount } = useNotifications();

    const menuItems = useMemo(() => [
        {
            path: '/student/dashboard',
            label: 'Active Drives',
            icon: LayoutDashboard
        },
        {
            path: '/student/applications',
            label: 'My Applications',
            icon: FileText
        },
        {
            path: '/student/notifications',
            label: 'Notifications',
            icon: Bell,
            badge: unreadCount // Add badge count
        },
        {
            path: '/profile',
            label: 'My Profile',
            icon: User
        },
    ], [unreadCount]); // Re-memoize when unreadCount changes

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const footerItem = {
        label: 'Logout',
        icon: LogOut,
        onClick: handleLogout
    };

    return (
        <ExpandableSidebar
            sidebarItems={menuItems}
            footerItem={footerItem}
        />
    );
};

export default StudentSidebar;
