import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await login(email, password);
            toast.success('Login successful!');

            // Redirect based on role
            if (data.role === 'admin') navigate('/admin/dashboard');
            else if (data.role === 'recruiter') navigate('/recruiter/dashboard');
            else navigate('/student/dashboard');

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-primary">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Login to Portal</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-dark mb-1 text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:border-primary bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-text-dark mb-1 text-sm font-medium">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:border-primary bg-background pr-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-text-muted hover:text-primary transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light transition-colors font-bold shadow-md cursor-pointer"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-text-muted">
                    Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register (Student)</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
