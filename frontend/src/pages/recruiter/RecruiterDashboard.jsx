import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiBriefcase } from 'react-icons/fi';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            if (user?.profile?.companyId) {
                try {
                    const res = await api.get(`/jobs/company/${user.profile.companyId}`);
                    setJobs(res.data);
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Recruiter Dashboard</h1>

            {!user?.profile?.companyId ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded text-yellow-700">
                    <p>You are not assigned to any company yet. Please contact the administrator.</p>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold text-text-dark mb-4">Your Assigned Drives</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map(job => (
                                <div key={job._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
                                    <h3 className="text-xl font-bold text-text-dark mb-2">{job.title}</h3>
                                    <p className="text-text-muted text-sm mb-4">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <FiBriefcase /> {job.vacancies} Vacancies
                                        </div>
                                    </div>

                                    <Link to={`/recruiter/jobs/${job._id}/applications`} className="mt-4 block text-center bg-accent text-primary font-bold py-2 rounded hover:bg-white border-2 border-accent transition">
                                        View Applications
                                    </Link>
                                </div>
                            ))}
                            {jobs.length === 0 && (
                                <p className="col-span-3 text-text-muted">No active drives assigned to your company.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RecruiterDashboard;
