import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiX, FiUser, FiMail, FiPhone, FiBookOpen, FiAward, FiPlus, FiLock } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        course: '', college: '', year: '',
        skills: [], projects: [], internships: [],
        socialLinks: { linkedin: '', github: '', portfolio: '' },
        academics: { cgpa: '', tenthMarks: '', twelfthMarks: '' }
    });

    const [skillInput, setSkillInput] = useState('');
    const [otherCourse, setOtherCourse] = useState(''); // State for "Other" course input
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        let value = e.target.value;

        // Phone: Remove spaces and non-numeric chars
        if (e.target.name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }

        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleCourseChange = (e) => {
        const value = e.target.value;
        if (value === 'Other') {
            setFormData({ ...formData, course: '' }); // Clear course if Other selected initially
        } else {
            setFormData({ ...formData, course: value });
        }
        setOtherCourse(value === 'Other' ? 'Other' : '');
    };

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

    const handleAddSkill = (skillName, level) => {
        if (skillName.trim()) {
            if (!formData.skills.some(s => s.name === skillName.trim())) {
                setFormData({ ...formData, skills: [...formData.skills, { name: skillName.trim(), level }] });
                setSkillInput('');
            } else {
                toast.warning('Skill already added');
            }
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({ ...formData, skills: formData.skills.filter(skill => skill.name !== skillToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Finalize "Other" course
        const finalData = { ...formData };
        if (otherCourse === 'Other') {
            // We expect the user to have typed into formData.course via the text input
            // No extra logic needed if the text input updates formData.course
        }

        if (!validateEmail(finalData.email)) return toast.error('Please enter a valid Gmail address');
        if (!validatePhone(finalData.phone)) return toast.error('Please enter a valid Indian phone number');

        setIsLoading(true);
        try {
            await register(finalData);
            toast.success('Registration successful!');
            navigate('/student/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate available years based on course
    const getYearOptions = () => {
        const course = otherCourse === 'Other' ? 'Other' : formData.course;

        if (course === 'B.Tech') return ['1st', '2nd', '3rd', '4th'];
        if (['MCA', 'MBA', 'M.Tech'].includes(course)) return ['1st', '2nd'];
        return ['1st', '2nd', '3rd', '4th']; // Default
    };

    // Professional Input Style Constant
    const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] outline-none transition-all text-[#3E2723]";
    const labelStyle = "block text-[#3E2723]/70 mb-1.5 text-xs font-bold uppercase tracking-wider";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F8] px-4 py-12">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#E0D7D5]">

                {/* Header Banner */}
                <div className="bg-[#3E2723] p-8 text-center border-b border-[#D7CCC8]">
                    <img src="/avani_enterprises_logo.jpg" alt="Logo" className="h-16 w-16 mx-auto rounded-xl border-2 border-[#D7CCC8] mb-4 shadow-lg" />
                    <h2 className="text-2xl font-serif font-bold text-[#FAF9F8] tracking-tight">Student Enrollment</h2>
                    <p className="text-[#D7CCC8]/80 text-sm mt-1 uppercase tracking-[0.2em]">Placement Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">

                    {/* Section 1: Personal Details */}
                    <div className="space-y-4">
                        <h3 className="text-[#3E2723] font-bold text-sm flex items-center gap-2 border-b border-[#FAF9F8] pb-2">
                            <FiUser className="text-[#D7CCC8]" /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className={labelStyle}>Full Name *</label>
                                <FiUser className="absolute left-3 top-[38px] text-[#3E2723]/40" />
                                <input type="text" name="name" required className={inputStyle} value={formData.name} onChange={handleChange} placeholder="John Doe" />
                            </div>
                            <div className="relative">
                                <label className={labelStyle}>Gmail Address *</label>
                                <FiMail className="absolute left-3 top-[38px] text-[#3E2723]/40" />
                                <input type="email" name="email" required className={inputStyle} value={formData.email} onChange={handleChange} placeholder="name@gmail.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className={labelStyle}>Password *</label>
                                <FiLock className="absolute left-3 top-[38px] text-[#3E2723]/40" />
                                <input type={showPassword ? "text" : "password"} name="password" required className={inputStyle} value={formData.password} onChange={handleChange} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-[#3E2723]/40 hover:text-[#3E2723]">
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            <div className="relative">
                                <label className={labelStyle}>Phone Number *</label>
                                <FiPhone className="absolute left-3 top-[38px] text-[#3E2723]/40" />
                                <input type="text" name="phone" required className={inputStyle} value={formData.phone} onChange={handleChange} maxLength="10" placeholder="9876543210" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Academic Info */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-[#3E2723] font-bold text-sm flex items-center gap-2 border-b border-[#FAF9F8] pb-2">
                            <FiBookOpen className="text-[#D7CCC8]" /> Academic Background
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="md:col-span-1">
                                <label className={labelStyle}>Course</label>
                                <select
                                    name="course"
                                    className="w-full px-4 py-2.5 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:border-[#3E2723] outline-none text-[#3E2723]"
                                    value={otherCourse === 'Other' ? 'Other' : formData.course}
                                    onChange={handleCourseChange}
                                >
                                    <option value="">Select Course</option>
                                    <option value="B.Tech">B.Tech</option>
                                    <option value="MCA">MCA</option>
                                    <option value="MBA">MBA</option>
                                    <option value="M.Tech">M.Tech</option>
                                    <option value="Other">Other</option>
                                </select>
                                {otherCourse === 'Other' && (
                                    <input
                                        type="text"
                                        name="course"
                                        className={`mt-2 ${inputStyle.replace('pl-10', 'px-4')}`}
                                        value={formData.course}
                                        onChange={handleChange}
                                        placeholder="Enter Course Name"
                                        autoFocus
                                    />
                                )}
                            </div>

                            <div className="md:col-span-1">
                                <label className={labelStyle}>Year</label>
                                <select name="year" className="w-full px-4 py-2.5 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:border-[#3E2723] outline-none text-[#3E2723]" value={formData.year} onChange={handleChange}>
                                    <option value="">Select Year</option>
                                    {getYearOptions().map(yr => (
                                        <option key={yr} value={yr}>{yr} Year</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-1">
                                <label className={labelStyle}>College</label>
                                <input type="text" name="college" className={inputStyle.replace('pl-10', 'px-4')} value={formData.college} onChange={handleChange} placeholder="University Name" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className={labelStyle}>CGPA (Current)</label>
                                <input type="text" name="cgpa" className={inputStyle.replace('pl-10', 'px-4')} value={formData.academics?.cgpa || ''} onChange={(e) => setFormData({ ...formData, academics: { ...formData.academics, cgpa: e.target.value } })} placeholder="e.g. 8.5" />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelStyle}>12th Marks (%)</label>
                                <input type="text" name="twelfthMarks" className={inputStyle.replace('pl-10', 'px-4')} value={formData.academics?.twelfthMarks || ''} onChange={(e) => setFormData({ ...formData, academics: { ...formData.academics, twelfthMarks: e.target.value } })} placeholder="e.g. 92%" />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelStyle}>10th Marks (%)</label>
                                <input type="text" name="tenthMarks" className={inputStyle.replace('pl-10', 'px-4')} value={formData.academics?.tenthMarks || ''} onChange={(e) => setFormData({ ...formData, academics: { ...formData.academics, tenthMarks: e.target.value } })} placeholder="e.g. 95%" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Professional Skills */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-[#3E2723] font-bold text-sm flex items-center gap-2 border-b border-[#FAF9F8] pb-2">
                            <FiAward className="text-[#D7CCC8]" /> Skills & Proficiency
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className={labelStyle}>Skill Name</label>
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className={inputStyle.replace('pl-10', 'px-4')}
                                    placeholder="e.g. React"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelStyle}>Proficiency</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:border-[#3E2723] outline-none text-[#3E2723]"
                                    id="skillLevel"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (skillInput.trim()) {
                                            const level = document.getElementById('skillLevel').value;
                                            handleAddSkill(skillInput, level);
                                        }
                                    }}
                                    className="w-full bg-[#3E2723] text-white py-2.5 rounded-lg font-bold shadow-md hover:bg-[#3E2723]/90 transition-all"
                                >
                                    Add Skill
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <span key={`${skill.name}-${index}`} className="px-3 py-1 bg-[#3E2723] text-[#FAF9F8] rounded-full text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-200 shadow-md shadow-[#3E2723]/20">
                                    {skill.name} <span className="text-[#D7CCC8]/70 font-normal">({skill.level})</span>
                                    <button type="button" onClick={() => handleRemoveSkill(skill.name)} className="hover:text-red-400">
                                        <FiX size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Projects (Simplified for MVP) */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-[#3E2723] font-bold text-sm flex items-center gap-2 border-b border-[#FAF9F8] pb-2">
                            <FiPlus className="text-[#D7CCC8]" /> Top Project
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className={labelStyle}>Project Title</label>
                                <input type="text" onChange={(e) => {
                                    const newProjects = [...formData.projects];
                                    if (!newProjects[0]) newProjects[0] = {};
                                    newProjects[0].title = e.target.value;
                                    setFormData({ ...formData, projects: newProjects });
                                }} className={inputStyle.replace('pl-10', 'px-4')} placeholder="e.g. E-Commerce App" />
                            </div>
                            <div className="relative">
                                <label className={labelStyle}>Project Link</label>
                                <input type="text" onChange={(e) => {
                                    const newProjects = [...formData.projects];
                                    if (!newProjects[0]) newProjects[0] = {};
                                    newProjects[0].link = e.target.value;
                                    setFormData({ ...formData, projects: newProjects });
                                }} className={inputStyle.replace('pl-10', 'px-4')} placeholder="GitHub/Live Link" />
                            </div>
                            <div className="md:col-span-2 relative">
                                <label className={labelStyle}>Description</label>
                                <textarea rows="2" onChange={(e) => {
                                    const newProjects = [...formData.projects];
                                    if (!newProjects[0]) newProjects[0] = {};
                                    newProjects[0].description = e.target.value;
                                    setFormData({ ...formData, projects: newProjects });
                                }} className={inputStyle.replace('pl-10', 'px-4')} placeholder="Brief description of your project..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Social Links */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-[#3E2723] font-bold text-sm flex items-center gap-2 border-b border-[#FAF9F8] pb-2">
                            <FiAward className="text-[#D7CCC8]" /> Social Presence
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <label className={labelStyle}>LinkedIn URL</label>
                                <input type="text" name="linkedin" className={inputStyle.replace('pl-10', 'px-4')} value={formData.socialLinks?.linkedin || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })} placeholder="linkedin.com/in/..." />
                            </div>
                            <div className="relative">
                                <label className={labelStyle}>GitHub URL</label>
                                <input type="text" name="github" className={inputStyle.replace('pl-10', 'px-4')} value={formData.socialLinks?.github || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })} placeholder="github.com/..." />
                            </div>
                            <div className="relative">
                                <label className={labelStyle}>Portfolio URL</label>
                                <input type="text" name="portfolio" className={inputStyle.replace('pl-10', 'px-4')} value={formData.socialLinks?.portfolio || ''} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })} placeholder="myportfolio.com" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#3E2723] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#3E2723]/20 hover:bg-[#3E2723]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-[#D7CCC8] border-t-white rounded-full animate-spin" />
                        ) : 'Create My Account'}
                    </button>
                </form>

                <div className="bg-[#FAF9F8] py-6 text-center border-t border-[#E0D7D5]">
                    <p className="text-sm text-[#3E2723]/60">
                        Already have an account? <Link to="/login" className="text-[#3E2723] font-black hover:underline ml-1">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};



export default Register;