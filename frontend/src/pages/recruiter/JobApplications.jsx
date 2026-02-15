import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiFilter, FiDownload, FiCheck, FiX, FiClock, FiUserCheck } from 'react-icons/fi';

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [stats, setStats] = useState({ total: 0, shortlisted: 0, selected: 0 });

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get(`/applications/job/${jobId}`);
                const data = res.data.data || [];
                setApplications(data);

                // Calculate quick stats
                setStats({
                    total: data.length,
                    shortlisted: data.filter(app => app.status === 'Shortlisted').length,
                    selected: data.filter(app => app.status === 'Selected').length
                });

            } catch (error) {
                toast.error("Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [jobId]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            toast.success(`Candidate status updated to ${newStatus}`);
            // Update local state
            setApplications(apps => apps.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Selected': return 'bg-green-100 text-green-700 border-green-200';
            case 'Shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Interview Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const filteredApplications = filter === 'All'
        ? applications
        : applications.filter(app => app.status === filter);

    return (
        <div className="container mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Applicant Pool</h1>
                        <p className="text-gray-500 mt-1">Review and manage candidate applications.</p>
                    </div>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total</span>
                        <span className="font-bold text-xl text-gray-900">{stats.total}</span>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Shortlisted</span>
                        <span className="font-bold text-xl text-blue-900">{stats.shortlisted}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-2 items-center">
                <FiFilter className="text-gray-400 mr-2" />
                {['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === status
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div></div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Education</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Skills</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredApplications.map(app => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {app.student.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{app.student.name}</div>
                                                    <div className="text-sm text-gray-500">{app.student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{app.student.profile.course}</div>
                                            <div className="text-xs text-gray-500">{app.student.profile.year}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {app.student.profile.skills?.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {app.student.profile.skills?.length > 3 && (
                                                    <span className="text-xs text-gray-500 self-center">+{app.student.profile.skills.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {app.resumeUrl && (
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                                    title="View Resume"
                                                >
                                                    <FiDownload className="mr-1" /> Resume
                                                </a>
                                            )}

                                            <div className="relative">
                                                <select
                                                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm font-medium cursor-pointer"
                                                    value={app.status === 'Applied' ? '' : app.status} // Hack to show placeholder if needed, or just show current status
                                                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                >
                                                    <option value="" disabled>Update Status</option>
                                                    <option value="Shortlisted">Shortlist</option>
                                                    <option value="Interview Scheduled">Schedule Interview</option>
                                                    <option value="Selected">Select Candidate</option>
                                                    <option value="Rejected">Reject</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApplications.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <FiUserCheck size={48} className="mb-4 opacity-50" />
                                                <p className="text-lg font-medium text-gray-500">No applicants found matching this filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplications;
