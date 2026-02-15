import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FiTrash2 } from 'react-icons/fi';

const ApplicationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [companies, setCompanies] = useState([]); // New
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    // Check for 'job' filter in URL
    const queryParams = new URLSearchParams(window.location.search);
    const initialJob = queryParams.get('job') || '';

    const [filterCompany, setFilterCompany] = useState(initialJob); // New
    const [searchTerm, setSearchTerm] = useState(''); // New
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        fetchCompanies();
        // Clear query param from URL after reading to avoid sticky filtering on manual refresh? 
        // Actually, better to keep it for bookmarking/navigation.
    }, []);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchApplications();
    }, [filterStatus, filterCompany, debouncedSearch]);

    const fetchCompanies = async () => {
        try {
            const { data } = await axios.get('/companies'); // Public or Admin route
            setCompanies(data.data || []);
        } catch (error) {
            toast.error('Failed to load companies');
        }
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (filterCompany) params.append('company', filterCompany);
            if (debouncedSearch) params.append('search', debouncedSearch);

            const { data: responseData } = await axios.get(`/admin/applications?${params.toString()}`);
            setApplications(responseData.data || []);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/admin/application/${id}/status`, { status: newStatus });
            toast.success('Status updated');
            fetchApplications();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            await axios.delete(`/admin/application/${id}`);
            toast.success('Application deleted');
            fetchApplications();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('/admin/export/applications', {
                responseType: 'blob', // Important for file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const statusColors = {
        'Applied': 'bg-gray-100 text-gray-800',
        'Shortlisted': 'bg-blue-100 text-blue-800',
        'Interview Scheduled': 'bg-purple-100 text-purple-800',
        'Interviewed': 'bg-indigo-100 text-indigo-800',
        'Selected': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
        'On Hold': 'bg-orange-100 text-orange-800',
        'LOI Issued': 'bg-teal-100 text-teal-800',
        'Offer Released': 'bg-yellow-100 text-yellow-800'
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Applications</h1>

                {/* Filters & Actions */}
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search student, company..."
                            className="border p-2 pl-8 rounded w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
                    </div>

                    {/* Company Filter */}
                    <select
                        className="border p-2 rounded"
                        value={filterCompany}
                        onChange={(e) => setFilterCompany(e.target.value)}
                    >
                        <option value="">All Companies</option>
                        {companies.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option> // Sending ID
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        className="border p-2 rounded"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                        <option value="On Hold">On Hold</option>
                        <option value="LOI Issued">LOI Issued</option>
                        <option value="Offer Released">Offer Released</option>
                    </select>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Student</th>
                            <th className="p-4 font-semibold text-gray-600">Company</th>
                            <th className="p-4 font-semibold text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium">{app.student?.name}</div>
                                    <div className="text-xs text-gray-500">{app.student?.email}</div>
                                </td>
                                <td className="p-4">{app.job?.company?.name}</td>
                                <td className="p-4">{app.job?.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[app.status] || 'bg-gray-100'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-2">
                                    <select
                                        className="text-sm border rounded p-1"
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Shortlisted">Shortlisted</option>
                                        <option value="Interview Scheduled">Interview Scheduled</option>
                                        <option value="Interviewed">Interviewed</option>
                                        <option value="Selected">Selected</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="LOI Issued">LOI Issued</option>
                                        <option value="Offer Released">Offer Released</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Delete Application"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {applications.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No applications found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationManagement;
