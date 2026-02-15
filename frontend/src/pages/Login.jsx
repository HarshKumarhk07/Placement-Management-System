import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useAuth(); // Get user state

    // Redirect if already logged in
    if (user) {
        if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (user.role === 'recruiter') navigate('/recruiter/dashboard', { replace: true });
        else navigate('/student/dashboard', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await login(email, password);
            toast.success('Login Successful');
            if (data.role === 'admin') navigate('/admin/dashboard');
            else if (data.role === 'recruiter') navigate('/recruiter/dashboard');
            else navigate('/student/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid Credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F8] px-4 font-sans">
            <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E0D7D5]">

                {/* Visual Side */}
                <div className="hidden md:flex w-1/2 bg-[#3E2723] p-12 flex-col justify-between text-[#FAF9F8]">
                    <div>
                        <img src="/avani_enterprises_logo.jpg" alt="Logo" className="h-12 w-12 rounded-lg border border-[#D7CCC8]" />
                        <h2 className="mt-8 text-3xl font-serif font-bold tracking-tight">Placement <br />Management <br />System</h2>
                        <p className="text-[#D7CCC8] text-xs uppercase tracking-widest mt-2 opacity-80">Powered by Avani Enterprises</p>
                    </div>
                    <div>
                        <p className="text-[#D7CCC8] text-sm leading-relaxed italic opacity-80">
                            "Connecting Potential with Possibilities."
                        </p>
                        <div className="h-1 w-12 bg-[#D7CCC8] mt-4"></div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 lg:p-12">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-[#3E2723]">Welcome Back</h2>
                        <p className="text-[#3E2723]/60 text-sm mt-1">Please log in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#3E2723]/60">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E2723]/40 group-focus-within:text-[#3E2723]" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:border-[#3E2723] outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#3E2723]/60">Password</label>
                            </div>
                            <div className="relative group">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E2723]/40 group-focus-within:text-[#3E2723]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:border-[#3E2723] outline-none transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E2723]/40 hover:text-[#3E2723]"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#3E2723] text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-[#3E2723]/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing...' : 'Login to Dashboard'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#3E2723]/60">
                        New student? <Link to="/register" className="text-[#3E2723] font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;