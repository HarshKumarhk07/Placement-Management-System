import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        // No propagation needed if we use button correctly
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'recruiter') return '/recruiter/dashboard';
        if (user.role === 'student') return '/student/dashboard';
        return '/';
    };

    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to={getDashboardLink()} className="text-xl font-bold flex items-center gap-3">
                    <img src="/logo.png" alt="Avani Logo" className="h-10 w-10 object-contain bg-white rounded-full p-1" />
                    <div className="leading-tight">
                        <span className="block text-lg tracking-wide">AVANI</span>
                        <span className="block text-xs text-accent font-normal tracking-wider">ENTERPRISES</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-accent transition">Login</Link>
                            <Link to="/register" className="bg-accent text-primary px-4 py-2 rounded font-medium hover:bg-white transition">Register</Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-1 hover:text-accent transition" title="Profile">
                                <FiUser /> <span className="hidden md:inline">Profile</span>
                            </Link>
                            <span className="text-sm text-accent hidden md:block">
                                {user.name} ({user.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 hover:text-red-300 transition cursor-pointer"
                                title="Logout"
                            >
                                <FiLogOut />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
