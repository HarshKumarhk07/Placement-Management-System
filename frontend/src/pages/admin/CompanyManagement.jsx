import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        website: '',
        recruiterName: '',
        recruiterEmail: '',
        recruiterPassword: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { data } = await axios.get('/companies'); // public endpoint? or admin specific?
            // Since public /api/companies returns all, we can use that for now.
            // Ideally should be /api/admin/companies to see everything + details.
            setCompanies(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/company', formData);
            toast.success('Company & Recruiter created successfully!');
            setIsModalOpen(false);
            fetchCompanies();
            // Reset form
            setFormData({
                companyName: '', location: '', website: '',
                recruiterName: '', recruiterEmail: '', recruiterPassword: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating company');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will soft delete the company and recruiter.')) return;
        try {
            await axios.delete(`/admin/company/${id}`);
            toast.success('Company deleted');
            fetchCompanies();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Company Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                >
                    <FiPlus /> Add Company
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Company</th>
                            <th className="p-4 font-semibold text-gray-600">Location</th>
                            <th className="p-4 font-semibold text-gray-600">Recruiter</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {companies.map((company) => (
                            <tr key={company._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{company.name}</td>
                                <td className="p-4 text-gray-600">{company.location}</td>
                                <td className="p-4 text-gray-600">
                                    {company.email || 'N/A'}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(company._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    No companies found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add New Company</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="font-semibold text-gray-600 border-b pb-1">Company Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="companyName" placeholder="Company Name" required
                                    className="border p-2 rounded w-full" onChange={handleInputChange} />
                                <input name="location" placeholder="Location" required
                                    className="border p-2 rounded w-full" onChange={handleInputChange} />
                            </div>
                            <input name="website" placeholder="Website"
                                className="border p-2 rounded w-full" onChange={handleInputChange} />

                            <h3 className="font-semibold text-gray-600 border-b pb-1 mt-4">Recruiter Credentials</h3>
                            <input name="recruiterName" placeholder="Recruiter Name" required
                                className="border p-2 rounded w-full" onChange={handleInputChange} />
                            <input name="recruiterEmail" type="email" placeholder="Recruiter Email" required
                                className="border p-2 rounded w-full" onChange={handleInputChange} />
                            <input name="recruiterPassword" type="password" placeholder="Password" required
                                className="border p-2 rounded w-full" onChange={handleInputChange} />

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;
