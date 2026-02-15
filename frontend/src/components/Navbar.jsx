import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-[#E0D7D5] sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div
                    to={!user ? '/' : user.role === 'admin' ? '/admin/dashboard' : user.role === 'recruiter' ? '/recruiter/dashboard' : '/student/dashboard'}
                    className="flex items-center gap-3"
                >
                    <img src="/avani_enterprises_logo.jpg" alt="Logo" className="h-10 w-10 object-cover rounded shadow-sm border border-[#D7CCC8]" />
                    <span className="text-lg font-black tracking-tighter text-[#3E2723] uppercase leading-none" style={{ fontFamily: 'serif' }}>
                        PLACEMENT <br /> PORTAL
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    {!user ? (
                        <div className="flex gap-6 items-center">
                            <Link to="/login" className="text-[#3E2723] text-sm font-bold tracking-wide hover:opacity-70 transition">Login</Link>
                            <Link to="/register" className="bg-[#3E2723] text-[#FAF9F8] px-5 py-2 rounded font-bold text-sm shadow-md hover:bg-[#3E2723]/90 transition">Register</Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block leading-none">
                                <p className="text-sm font-bold text-[#3E2723]">{user.name}</p>
                                <p className="text-[10px] uppercase tracking-widest text-[#3E2723]/60 mt-1">{user.role}</p>
                            </div>
                            <div className="flex items-center gap-2 pl-4 border-l border-[#E0D7D5]">
                                <Link
                                    to={user.role === 'admin' ? '/admin/profile' : user.role === 'recruiter' ? '/recruiter/dashboard' : '/profile'}
                                    className="p-2 text-[#3E2723] hover:bg-[#FAF9F8] rounded-full transition"
                                >
                                    <FiUser size={20} />
                                </Link>
                                <button onClick={handleLogout} className="p-2 text-red-700 hover:bg-red-50 rounded-full transition">
                                    <FiLogOut size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;