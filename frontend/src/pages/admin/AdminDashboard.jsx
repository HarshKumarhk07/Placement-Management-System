import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiLayers, FiPlus } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalJobs: 0,
        totalApplications: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-muted text-sm font-medium">Total Students</p>
                            <h3 className="text-3xl font-bold text-text-dark">{stats.totalStudents}</h3>
                        </div>
                        <FiUsers className="text-4xl text-accent" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-muted text-sm font-medium">Total Companies</p>
                            <h3 className="text-3xl font-bold text-text-dark">{stats.totalCompanies}</h3>
                        </div>
                        <FiLayers className="text-4xl text-accent" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-muted text-sm font-medium">Active Drives</p>
                            <h3 className="text-3xl font-bold text-text-dark">{stats.totalJobs}</h3>
                        </div>
                        <FiBriefcase className="text-4xl text-accent" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-muted text-sm font-medium">Total Applications</p>
                            <h3 className="text-3xl font-bold text-text-dark">{stats.totalApplications}</h3>
                        </div>
                        <FiLayers className="text-4xl text-accent" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-primary mb-4">Company Management</h2>
                    <p className="text-text-muted mb-4">Add new companies and assign recruiters.</p>
                    <Link to="/admin/companies/create" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition shadow">
                        <FiPlus /> Add Company
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <h2 className="text-xl font-bold text-primary mb-4">Placement Drives</h2>
                    <p className="text-text-muted mb-4">Create new participation drives for companies.</p>
                    <Link to="/admin/jobs/create" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition shadow">
                        <FiPlus /> Create Drive
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
