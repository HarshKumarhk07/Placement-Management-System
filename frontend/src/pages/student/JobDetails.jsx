import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data.data);
            } catch (error) {
                toast.error("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        // Check if user has uploaded resume
        if (!user?.profile?.resumeUrl) {
            toast.error('Please upload your resume in your profile before applying');
            navigate('/profile');
            return;
        }

        // Confirm before applying
        if (!window.confirm("Are you sure you want to apply for this position?")) return;

        try {
            await api.post('/applications', { jobId: id });
            toast.success('Application submitted successfully!');
            navigate('/student/applications');
        } catch (error) {
            // Display specific error message efficiently
            toast.error(error.response?.data?.message || 'Failed to apply');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!job) return <div className="p-8 text-center">Job not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">{job.title}</h1>
                        <h2 className="text-xl text-accent font-medium">{job.company?.name || 'Company Name'}</h2>
                    </div>
                    {job.company?.logo && <img src={job.company.logo} alt={job.company.name} className="h-16 w-16 object-contain" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-text-dark">Location</h3>
                            <p className="text-text-muted">{job.location}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-text-dark">Package</h3>
                            <p className="text-text-muted">{job.package || 'Not Disclosed'}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-text-dark">Vacancies</h3>
                            <p className="text-text-muted">{job.vacancies}</p>
                        </div>
                        {job.minCGPA > 0 && (
                            <div>
                                <h3 className="font-bold text-text-dark">Minimum CGPA</h3>
                                <p className="text-red-500 font-bold">{job.minCGPA}</p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-text-dark">Application Deadline</h3>
                            <p className="text-text-muted">{new Date(job.deadline).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-text-dark">Company Website</h3>
                            <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{job.company.website || 'N/A'}</a>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-3">Job Description</h3>
                    <div className="text-text-dark whitespace-pre-wrap">{job.description}</div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-3">Requirements</h3>
                    <div className="text-text-dark whitespace-pre-wrap">{job.requirements}</div>
                </div>

                <div className="flex justify-end pt-6 border-t border-input-border">
                    <button
                        onClick={handleApply}
                        className="bg-primary text-white px-8 py-3 rounded text-lg font-bold hover:bg-opacity-90 transition"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
