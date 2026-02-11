import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        course: '',
        college: '',
        year: '',
        skills: []
    });

    const [skillInput, setSkillInput] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gmail validation
    const validateEmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    // India phone validation
    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData({
                    ...formData,
                    skills: [...formData.skills, skillInput.trim()]
                });
                setSkillInput('');
            } else {
                toast.warning('Skill already added');
            }
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!validateEmail(formData.email)) {
            toast.error('Please enter a valid Gmail address');
            return;
        }

        if (!validatePhone(formData.phone)) {
            toast.error('Please enter a valid 10-digit Indian phone number (starting with 6-9)');
            return;
        }

        setIsLoading(true);
        try {
            await register(formData);
            toast.success('Registration successful!');
            navigate('/student/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedSkills = ['Java', 'Python', 'React', 'Node.js', 'MongoDB', 'SQL', 'DSA', 'DevOps', 'AWS', 'Docker'];

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border-t-4 border-primary">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Student Registration</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Gmail Address *</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="yourname@gmail.com"
                        />
                        <p className="text-xs text-text-muted mt-1">Only Gmail addresses are accepted</p>
                    </div>

                    <div className="relative">
                        <label className="block text-text-dark mb-1 text-sm font-medium">Password *</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-input-border rounded bg-background pr-12 focus:outline-none focus:border-primary"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-text-muted hover:text-primary transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">Phone Number *</label>
                            <input
                                type="text"
                                name="phone"
                                required
                                className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                maxLength="10"
                            />
                            <p className="text-xs text-text-muted mt-1">10 digits, starts with 6-9</p>
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">Year</label>
                            <select
                                name="year"
                                className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                <option value="">Select Year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">Course</label>
                            <input
                                type="text"
                                name="course"
                                className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech"
                            />
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">College</label>
                            <input
                                type="text"
                                name="college"
                                className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                                value={formData.college}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Skills</label>
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary"
                            placeholder="Type a skill and press Enter"
                        />
                        <p className="text-xs text-text-muted mt-1">Press Enter to add skills</p>

                        {/* Suggested Skills */}
                        <div className="mt-2">
                            <p className="text-xs text-text-muted mb-1">Suggested:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedSkills.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => {
                                            if (!formData.skills.includes(skill)) {
                                                setFormData({
                                                    ...formData,
                                                    skills: [...formData.skills, skill]
                                                });
                                            }
                                        }}
                                        className="px-2 py-1 bg-background border border-input-border rounded text-xs hover:bg-accent hover:border-primary transition"
                                    >
                                        + {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Skills */}
                        {formData.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {formData.skills.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center gap-2"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="hover:text-red-300"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light transition-colors font-bold shadow-md cursor-pointer mt-6"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-text-muted">
                    Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
