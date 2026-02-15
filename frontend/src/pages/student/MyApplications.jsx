import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiCheckCircle, FiClock, FiXCircle, FiFileText } from 'react-icons/fi';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/my-applications');
                setApplications(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        const statusMap = {
            'Applied': 'bg-blue-100 text-blue-700 border-blue-300',
            'Shortlisted': 'bg-purple-100 text-purple-700 border-purple-300',
            'Interview Scheduled': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            'Interviewed': 'bg-indigo-100 text-indigo-700 border-indigo-300',
            'Selected': 'bg-green-100 text-green-700 border-green-300',
            'Rejected': 'bg-red-100 text-red-700 border-red-300',
            'On Hold': 'bg-gray-100 text-gray-700 border-gray-300',
            'LOI Issued': 'bg-teal-100 text-teal-700 border-teal-300',
            'Offer Released': 'bg-emerald-100 text-emerald-700 border-emerald-300'
        };
        return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const getStatusIcon = (status) => {
        if (['Selected', 'LOI Issued', 'Offer Released'].includes(status)) {
            return <FiCheckCircle className="inline mr-1" />;
        } else if (status === 'Rejected') {
            return <FiXCircle className="inline mr-1" />;
        }
        return <FiClock className="inline mr-1" />;
    };

    const getRoundStatus = (round) => {
        if (round.status === 'cleared') return 'text-green-600';
        if (round.status === 'rejected') return 'text-red-600';
        return 'text-yellow-600';
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-text-muted">Loading your applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">My Applications</h1>

            {applications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <FiFileText className="mx-auto text-6xl text-text-muted mb-4" />
                    <p className="text-xl text-text-muted">You haven't applied to any drives yet.</p>
                    <p className="text-text-muted mt-2">Visit the dashboard to explore active placement drives!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {applications.map(app => (
                        <div key={app._id} className="bg-white rounded-lg shadow-md border-l-4 border-primary overflow-hidden">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-dark">{app.job?.title || 'N/A'}</h2>
                                        <p className="text-lg text-accent font-medium">{app.job?.company?.name || 'N/A'}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(app.status)}`}>
                                        {getStatusIcon(app.status)}
                                        {app.status}
                                    </span>
                                </div>

                                {/* Application Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-background/50 p-3 rounded-lg">
                                        <p className="text-xs text-text-muted font-bold uppercase">Applied On</p>
                                        <p className="text-sm font-medium text-text-dark">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-background/50 p-3 rounded-lg">
                                        <p className="text-xs text-text-muted font-bold uppercase">Location</p>
                                        <p className="text-sm font-medium text-text-dark">{app.job?.location || 'N/A'}</p>
                                    </div>
                                    <div className="bg-background/50 p-3 rounded-lg">
                                        <p className="text-xs text-text-muted font-bold uppercase">Package</p>
                                        <p className="text-sm font-medium text-text-dark">{app.job?.package || 'Not Disclosed'}</p>
                                    </div>
                                </div>

                                {/* Interview Rounds */}
                                {app.rounds && app.rounds.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="font-bold text-primary mb-2">Interview Rounds</h3>
                                        <div className="space-y-2">
                                            {app.rounds.map((round, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-background/30 p-3 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-text-dark">{round.name}</p>
                                                        {round.date && <p className="text-xs text-text-muted">Date: {new Date(round.date).toLocaleDateString()}</p>}
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRoundStatus(round)}`}>
                                                        {round.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recruiter Note */}
                                {app.recruiterNote && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                        <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Recruiter Note</p>
                                        <p className="text-sm text-yellow-900">{app.recruiterNote}</p>
                                    </div>
                                )}

                                {/* LOI / Offer Status */}
                                {(['LOI Issued', 'Offer Released'].includes(app.status)) && (
                                    <div className="mt-4 bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                                        <p className="font-bold text-green-800 flex items-center">
                                            <FiCheckCircle className="mr-2" />
                                            {app.status === 'LOI Issued' ? 'Letter of Intent Issued!' : 'Offer Letter Released!'}
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">Congratulations! Please check your email for further details.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
