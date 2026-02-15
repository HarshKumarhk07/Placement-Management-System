import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const { data } = await api.put('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (data.success) {
                toast.success(data.message);
                await logout();
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#E0D7D5] overflow-hidden">
                <div className="p-6 border-b border-[#E0D7D5]">
                    <h2 className="text-xl font-bold text-[#3E2723]">Change Password</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#3E2723] flex items-center gap-2">
                                <FiLock /> Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:outline-none focus:border-[#3E2723] transition-colors"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3E2723]"
                                >
                                    {showPassword.current ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#3E2723] flex items-center gap-2">
                                <FiLock /> New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:outline-none focus:border-[#3E2723] transition-colors"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3E2723]"
                                >
                                    {showPassword.new ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#3E2723] flex items-center gap-2">
                                <FiLock /> Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#E0D7D5] rounded-lg focus:outline-none focus:border-[#3E2723] transition-colors"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3E2723]"
                                >
                                    {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#3E2723] text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-[#3E2723]/90 hover:shadow-lg transform active:scale-95 transition-all flex items-center gap-2"
                        >
                            {loading ? 'Updating...' : <><FiLock /> Change Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
