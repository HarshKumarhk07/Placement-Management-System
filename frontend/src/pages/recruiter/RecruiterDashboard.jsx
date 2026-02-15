import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiBriefcase, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDrives: 0,
        activePositions: 0,
        totalApplications: 0 // This would need backend aggregation ideally
    });

    useEffect(() => {
        const fetchJobs = async () => {
            if (user?.profile?.companyId) {
                try {
                    const res = await api.get(`/jobs/company/${user.profile.companyId}`);
                    const fetchedJobs = res.data.data || [];
                    setJobs(fetchedJobs);

                    // Calculate active positions
                    const activePositions = fetchedJobs.reduce((acc, job) => acc + (job.vacancies || 0), 0);
                    setStats({
                        totalDrives: fetchedJobs.length,
                        activePositions,
                        totalApplications: 0 // Placeholder
                    });

                } catch (error) {
                    console.error("Failed to fetch jobs");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user]);

    if (loading) return <div className="flex h-screen items-center justify-center text-primary">Loading Dashboard...</div>

    return (
        <div className="container mx-auto px-6 py-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg">Manage your recruitment drives and talent pool efficiently.</p>
                </div>
                {user?.profile?.companyId ? (
                    <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 text-blue-700 font-medium text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Verified Recruiter for Organization
                    </div>
                ) : (
                    <div className="bg-red-50 px-4 py-2 rounded-full border border-red-100 text-red-700 font-medium text-sm">
                        Access Restricted: No Company Linked
                    </div>
                )}
            </div>

            {!user?.profile?.companyId ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
                    <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-yellow-600">
                        <FiClock size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Linkage</h3>
                    <p className="text-gray-500 mb-6">Your account is not yet linked to any registered company. Please contact the administrator to map your profile to your organization.</p>
                    <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">Contact Support</button>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatsCard
                            icon={<FiBriefcase className="text-purple-600" size={24} />}
                            title="Total Drives"
                            value={stats.totalDrives}
                            color="bg-purple-50"
                        />
                        <StatsCard
                            icon={<FiUsers className="text-blue-600" size={24} />}
                            title="Active Openings"
                            value={stats.activePositions}
                            color="bg-blue-50"
                        />
                        <StatsCard
                            icon={<FiTrendingUp className="text-green-600" size={24} />}
                            title="Engagement Rate"
                            value="High"
                            color="bg-green-50"
                        />
                    </div>

                    {/* Drives Section */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiCalendar className="text-gray-400" />
                        Active Recruitment Drives
                    </h2>

                    {jobs.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <p className="text-gray-500 text-lg">No active drives found. Contact admin to post a new opening.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {jobs.map(job => (
                                <div key={job._id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FiBriefcase className="mr-2 text-gray-400" />
                                            {job.vacancies} Positions Available
                                        </div>
                                        {job.package && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="w-4 h-4 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600">₹</span>
                                                {job.package}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to={`/recruiter/jobs/${job._id}/applications`}
                                        className="w-full block text-center bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-primary transition-colors hover:shadow-lg"
                                    >
                                        Manage Applications
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const StatsCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
        </div>
    </div>
);

export default RecruiterDashboard;
