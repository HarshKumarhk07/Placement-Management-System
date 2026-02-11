import { useState, useEffect } from 'react';
import api from '../../api/axios';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'selected': return 'text-green-600 bg-green-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            case 'shortlisted': return 'text-blue-600 bg-blue-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">My Applications</h1>

            {loading ? (
                <p>Loading applications...</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="p-4">Company</th>
                                <th className="p-4">Job Role</th>
                                <th className="p-4">Applied On</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-input-border">
                            {applications.map(app => (
                                <tr key={app._id} className="hover:bg-background transition">
                                    <td className="p-4 font-medium">{app.job?.company?.name || 'N/A'}</td>
                                    <td className="p-4">{app.job?.title}</td>
                                    <td className="p-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-text-muted">You haven't applied to any drives yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
