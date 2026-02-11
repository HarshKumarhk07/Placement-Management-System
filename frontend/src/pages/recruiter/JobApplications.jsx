import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get(`/applications/job/${jobId}`);
                setApplications(res.data);
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
            toast.success(`Status updated to ${newStatus}`);
            // Update local state
            setApplications(apps => apps.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Manage Applications</h1>

            {loading ? (
                <p>Loading candidates...</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="p-4">Candidate Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Course/Year</th>
                                <th className="p-4">Skills</th>
                                <th className="p-4">Resume</th>
                                <th className="p-4">Current Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-input-border">
                            {applications.map(app => (
                                <tr key={app._id} className="hover:bg-background transition">
                                    <td className="p-4 font-medium">{app.student.name}</td>
                                    <td className="p-4 max-w-xs truncate">{app.student.email}</td>
                                    <td className="p-4">{app.student.profile.course} - {app.student.profile.year}</td>
                                    <td className="p-4 max-w-xs truncate">{app.student.profile.skills && app.student.profile.skills.join(', ')}</td>
                                    <td className="p-4">
                                        {app.resumeUrl ? (
                                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">View Resume</a>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${app.status === 'selected' ? 'bg-green-100 text-green-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            className="border border-input-border rounded px-2 py-1 text-sm bg-white"
                                            value={app.status}
                                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="interview_scheduled">Interview Scheduled</option>
                                            <option value="selected">Selected</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="on_hold">On Hold</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-text-muted">No applications received yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default JobApplications;
