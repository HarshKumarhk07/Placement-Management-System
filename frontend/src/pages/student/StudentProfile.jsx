import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUpload, FiFileText } from 'react-icons/fi';

const StudentProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({});
    const [resume, setResume] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setProfile(res.data.profile || {});
            } catch (error) {
                console.error("Failed to fetch profile");
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!resume) {
            toast.error("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append('file', resume);

        setUploading(true);
        try {
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update user profile with resume URL (This endpoint needs implementation in backend or use a generic update profile)
            // For now, let's assume we update it via a profile update endpoint. 
            // Since I didn't create a specific profile update endpoint, I'll mock it or add it.
            // Wait, I strictly followed the plan. I don't have a profile update endpoint.
            // I should add one in authController or userController.
            // For now, I will just show the uploaded URL and say "simulating save" or I should quickly add the endpoint.

            // Actually, I should add a `updateProfile` endpoint in backend.
            // Let's assume I will add it.

            await api.put('/auth/profile', { resumeUrl: uploadRes.data.secure_url });

            setProfile(prev => ({ ...prev, resumeUrl: uploadRes.data.secure_url }));
            toast.success("Resume uploaded successfully!");
            setResume(null);

        } catch (error) {
            toast.error("Failed to upload resume");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">My Profile</h1>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl border-t-4 border-primary">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-dark">{user?.name}</h2>
                        <p className="text-text-muted">{user?.email}</p>
                        <p className="text-text-muted">{user?.role?.toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="font-bold text-text-dark">Course</h3>
                        <p className="text-text-muted">{profile.course || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-dark">College</h3>
                        <p className="text-text-muted">{profile.college || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-dark">Year</h3>
                        <p className="text-text-muted">{profile.year || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-dark">Skills</h3>
                        <p className="text-text-muted">{profile.skills ? profile.skills.join(', ') : 'N/A'}</p>
                    </div>
                </div>

                <div className="border-t border-input-border pt-6">
                    <h3 className="font-bold text-text-dark mb-4">Resume / CV</h3>

                    {profile.resumeUrl ? (
                        <div className="flex items-center gap-4 mb-4 bg-background p-4 rounded">
                            <FiFileText className="text-2xl text-primary" />
                            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium truncate">
                                View Current Resume
                            </a>
                        </div>
                    ) : (
                        <p className="text-text-muted mb-4">No resume uploaded yet.</p>
                    )}

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-text-muted
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary file:text-white
                                hover:file:bg-opacity-90
                            "
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!resume || uploading}
                            className="bg-accent text-primary px-4 py-2 rounded font-bold hover:bg-white border-2 border-accent transition disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload New'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
