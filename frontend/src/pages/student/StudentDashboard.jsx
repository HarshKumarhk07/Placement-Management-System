import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';

const StudentDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                setJobs(res.data);
            } catch (error) {
                console.error("Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Active Placement Drives</h1>

            {loading ? (
                <p>Loading drives...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-text-dark">{job.title}</h2>
                                {job.company.logo && <img src={job.company.logo} alt={job.company.name} className="h-10 w-10 object-contain" />}
                            </div>
                            <h3 className="text-lg font-medium text-accent mb-2">{job.company.name}</h3>

                            <div className="space-y-2 mb-4 text-text-muted text-sm">
                                <div className="flex items-center gap-2">
                                    <FiMapPin /> {job.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiBriefcase /> {job.package || 'Not Disclosed'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClock /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                                </div>
                            </div>

                            <Link to={`/student/jobs/${job._id}`} className="block text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition shadow cursor-pointer">
                                View Details & Apply
                            </Link>
                        </div>
                    ))}

                    {jobs.length === 0 && (
                        <p className="col-span-3 text-center text-text-muted">No active drives at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
