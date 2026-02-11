import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCompany = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        website: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/companies', formData);
            toast.success('Company created successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create company');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Add New Company</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-dark mb-1 font-medium">Company Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-text-dark mb-1 font-medium">Headquarters Location</label>
                        <input type="text" name="location" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-text-dark mb-1 font-medium">Website URL</label>
                        <input type="url" name="website" className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} />
                    </div>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90">Create Company</button>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
