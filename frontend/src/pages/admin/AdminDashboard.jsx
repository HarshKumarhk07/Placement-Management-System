import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import FullscreenLoader from '../../components/FullscreenLoader';
import { FiUsers, FiBriefcase, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    axios.get('/admin/stats'),
                    axios.get('/admin/audit-logs')
                ]);
                setStats(statsRes.data.data);
                setAuditLogs(logsRes.data.data);
            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <FullscreenLoader />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`p-4 rounded-full ${color} text-white`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={<FiUsers size={24} />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Drives"
                    value={stats.activeDrives}
                    icon={<FiBriefcase size={24} />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Selections"
                    value={stats.selectedCandidates}
                    icon={<FiCheckCircle size={24} />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Applications"
                    value={stats.totalApplications}
                    icon={<FiTrendingUp size={24} />}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Platform Metrics */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Platform Metrics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Total Companies</span>
                            <span className="font-bold">{stats.totalCompanies}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Total Drives posted</span>
                            <span className="font-bold">{stats.totalDrives}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-gray-600">Placement Success Rate</span>
                            <span className="font-bold text-green-600">
                                {stats.totalApplications > 0
                                    ? ((stats.selectedCandidates / stats.totalApplications) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Recent Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 text-gray-600">Action</th>
                                    <th className="p-3 text-gray-600">Resource</th>
                                    <th className="p-3 text-gray-600">User</th>
                                    <th className="p-3 text-gray-600">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {auditLogs.map(log => (
                                    <tr key={log._id}>
                                        <td className="p-3 font-medium">
                                            <span className={`px-2 py-1 rounded text-xs ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                                                log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-3">{log.resource}</td>
                                        <td className="p-3 text-gray-600">{log.user?.email || 'Unknown'}</td>
                                        <td className="p-3 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {auditLogs.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-500">No recent activity</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
