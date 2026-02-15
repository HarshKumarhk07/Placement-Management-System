import React, { useMemo } from 'react';
import {
    LayoutDashboard,
    Users,
    Building,
    Briefcase,
    FileText,
    Shield,
    LogOut
} from 'lucide-react';
import { ExpandableSidebar } from '../ui/ExpandableSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = useMemo(() => [
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            path: '/admin/students',
            label: 'Students',
            icon: Users
        },
        {
            path: '/admin/companies',
            label: 'Companies',
            icon: Building
        },
        {
            path: '/admin/drives',
            label: 'Placement Drives',
            icon: Briefcase
        },
        {
            path: '/admin/applications',
            label: 'Applications',
            icon: FileText
        },
        {
            path: '/admin/logs',
            label: 'Audit Logs',
            icon: Shield
        },
    ], []);

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

export default AdminSidebar;
