import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMapPin, FiClock, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const StudentDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/active-jobs');
            setJobs(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch active drives:", error);
            setError(error.response?.data?.message || 'Failed to load active drives');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-primary mb-8">Active Placement Drives</h1>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                    <p className="mt-6 text-text-muted text-lg">Loading active drives...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-primary mb-8">Active Placement Drives</h1>
                <div className="bg-white rounded-lg shadow-md p-12 text-center border-l-4 border-red-500">
                    <FiAlertCircle className="mx-auto text-6xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-text-dark mb-2">Oops! Something went wrong</h2>
                    <p className="text-text-muted mb-6">{error}</p>
                    <button
                        onClick={fetchJobs}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition font-bold shadow-md"
                    >
                        <FiRefreshCw /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty State
    if (jobs.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-primary mb-8">Active Placement Drives</h1>
                <div className="bg-white rounded-lg shadow-md p-12 text-center border-t-4 border-accent">
                    <div className="mb-6">
                        <div className="inline-block p-6 bg-accent/20 rounded-full">
                            <FiBriefcase className="text-6xl text-primary" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-dark mb-3">No Active Drives Yet</h2>
                    <p className="text-text-muted text-lg mb-2">
                        New placement drives will appear here when companies post them.
                    </p>
                    <p className="text-text-muted">
                        Make sure your profile is complete and resume is uploaded to be ready!
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/profile"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition font-bold shadow-md"
                        >
                            Complete Your Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success State - Display Drives
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Active Placement Drives</h1>
                <div className="flex items-center gap-2 text-text-muted">
                    <span className="bg-accent/20 text-primary px-3 py-1 rounded-full font-bold text-sm">
                        {jobs.length} {jobs.length === 1 ? 'Drive' : 'Drives'} Available
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                    <div key={job._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-dark">{job.title}</h2>
                            {job.company?.logo && (
                                <img
                                    src={job.company.logo}
                                    alt={job.company.name}
                                    className="h-12 w-12 object-contain rounded"
                                />
                            )}
                        </div>

                        <h3 className="text-lg font-medium text-accent mb-4">{job.company?.name || 'Company'}</h3>

                        <div className="space-y-2 mb-6 text-text-muted text-sm">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-primary" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiBriefcase className="text-primary" />
                                <span className="font-medium text-primary">{job.package || 'Not Disclosed'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiClock className="text-primary" />
                                <span>
                                    Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Vacancies Badge */}
                        {job.vacancies && (
                            <div className="mb-4">
                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}
                                </span>
                            </div>
                        )}

                        <Link
                            to={`/student/jobs/${job._id}`}
                            className="block text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-light transition shadow font-bold"
                        >
                            View Details & Apply
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
