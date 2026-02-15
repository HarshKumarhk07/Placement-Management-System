import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        website: '',
        recruiterName: '',
        recruiterEmail: '',
        recruiterPassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/company', formData);
            toast.success('Company and Recruiter created successfully!');
            navigate('/admin/companies');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create company');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Company</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Company Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Company Name</label>
                                <input type="text" name="companyName" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Headquarters Location</label>
                                <input type="text" name="location" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Website URL</label>
                                <input type="url" name="website"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Recruiter Credentials</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Recruiter Name</label>
                                <input type="text" name="recruiterName" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Recruiter Email</label>
                                <input type="email" name="recruiterEmail" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Password</label>
                                <input type="password" name="recruiterPassword" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg">
                            Create Company & Recruiter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
