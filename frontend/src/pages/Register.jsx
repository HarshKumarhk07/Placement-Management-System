import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        course: '',
        college: '',
        year: '',
    });

    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border-t-4 border-primary">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Student Registration</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Full Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2 border border-input-border rounded bg-background" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Email Address</label>
                        <input type="email" name="email" required className="w-full px-4 py-2 border border-input-border rounded bg-background" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Password</label>
                        <input type="password" name="password" required className="w-full px-4 py-2 border border-input-border rounded bg-background" onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">Phone</label>
                            <input type="text" name="phone" className="w-full px-4 py-2 border border-input-border rounded bg-background" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">Year</label>
                            <select name="year" className="w-full px-4 py-2 border border-input-border rounded bg-background" onChange={handleChange}>
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
                            <input type="text" name="course" className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary" onChange={handleChange} placeholder="e.g. B.Tech" />
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 text-sm font-medium">College</label>
                            <input type="text" name="college" className="w-full px-4 py-2 border border-input-border rounded bg-background focus:outline-none focus:border-primary" onChange={handleChange} />
                        </div>
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
