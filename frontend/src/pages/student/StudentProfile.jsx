import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUpload, FiFileText } from 'react-icons/fi';

const StudentProfile = () => {
    const { user, checkUser } = useAuth();
    const [profile, setProfile] = useState({});
    const [resume, setResume] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/auth/me');
                const userData = res.data.data || res.data;
                console.log('Profile Data:', userData);
                setProfile(userData.profile || {});
                setEditData(userData.profile || {});
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
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
            const uploadRes = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await axios.put('/auth/profile', { resumeUrl: uploadRes.data.secure_url });

            setProfile(prev => ({ ...prev, resumeUrl: uploadRes.data.secure_url }));

            // Refresh user context to update resume URL
            await checkUser();

            toast.success("Resume uploaded successfully!");
            setResume(null);

        } catch (error) {
            toast.error("Failed to upload resume");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/auth/profile', editData);
            const userData = res.data.data || res.data;
            setProfile(userData.profile);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-text-muted">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">My Profile</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-light transition shadow-md"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl border-t-4 border-primary">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-inner">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-dark">{user?.name}</h2>
                        <p className="text-text-muted">{user?.email}</p>
                        <span className="inline-block bg-accent/20 text-primary-light px-3 py-1 rounded-full text-xs font-bold mt-1 uppercase tracking-wider border border-accent/30">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-text-dark mb-1">Course</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-input-border rounded focus:ring-1 focus:ring-primary outline-none"
                                    value={editData.course || ''}
                                    onChange={(e) => setEditData({ ...editData, course: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-dark mb-1">College</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-input-border rounded focus:ring-1 focus:ring-primary outline-none"
                                    value={editData.college || ''}
                                    onChange={(e) => setEditData({ ...editData, college: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-dark mb-1">Year</label>
                                <select
                                    className="w-full p-2 border border-input-border rounded focus:ring-1 focus:ring-primary outline-none bg-white"
                                    value={editData.year || ''}
                                    onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st">1st Year</option>
                                    <option value="2nd">2nd Year</option>
                                    <option value="3rd">3rd Year</option>
                                    <option value="4th">4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-dark mb-1">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-input-border rounded focus:ring-1 focus:ring-primary outline-none"
                                    value={Array.isArray(editData.skills) ? editData.skills.join(', ') : editData.skills || ''}
                                    onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(',').map(s => s.trim()) })}
                                    placeholder="e.g. React, Node.js"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="bg-accent text-primary px-6 py-2 rounded-lg font-bold hover:bg-secondary transition border border-accent"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditData(profile);
                                    setIsEditing(false);
                                }}
                                className="bg-gray-100 text-text-dark px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-background/50 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Course</h3>
                                <p className="text-lg font-medium text-text-dark">{profile.course || 'Not set'}</p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-1">College</h3>
                                <p className="text-lg font-medium text-text-dark">{profile.college || 'Not set'}</p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Year</h3>
                                <p className="text-lg font-medium text-text-dark">{profile.year || 'Not set'}</p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill, i) => (
                                            <span key={i} className="bg-white px-2 py-1 rounded border border-input-border text-xs text-primary-light font-medium">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-text-muted text-sm">No skills added</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                <FiFileText /> Resume / CV
                            </h3>

                            {profile.resumeUrl ? (
                                <div className="flex items-center justify-between gap-4 mb-6 bg-cream p-4 rounded-2xl border border-accent/20">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-accent/20 p-2 rounded-lg">
                                            <FiFileText className="text-xl text-primary" />
                                        </div>
                                        <span className="font-bold text-primary text-sm">Current Resume.pdf</span>
                                    </div>
                                    <a
                                        href={profile.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-light hover:text-primary underline text-sm font-bold"
                                    >
                                        View File
                                    </a>
                                </div>
                            ) : (
                                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center mb-6">
                                    <p className="text-text-muted text-sm italic">No resume uploaded yet. Recruiter will see this as N/A.</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex-1 w-full bg-background rounded-xl p-1 border border-input-border relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <FiUpload className="text-accent" />
                                        <span className="text-sm text-text-muted truncate">
                                            {resume ? resume.name : 'Choose file...'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpload}
                                    disabled={!resume || uploading}
                                    className="w-full sm:w-auto bg-accent text-primary px-8 py-3 rounded-xl font-bold hover:bg-secondary transition disabled:opacity-50 shadow-sm border border-accent"
                                >
                                    {uploading ? 'Processing...' : 'Upload New'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
