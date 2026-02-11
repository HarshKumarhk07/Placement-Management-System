import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateJob = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        description: '',
        requirements: '',
        vacancies: '',
        location: '',
        package: '',
        deadline: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/companies');
                setCompanies(res.data);
            } catch (error) {
                console.error("Failed to fetch companies");
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', formData);
            toast.success('Job Drive created successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create job');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Create Placement Drive</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-dark mb-1 font-medium">Select Company</label>
                            <select name="company" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange}>
                                <option value="">-- Select Company --</option>
                                {companies.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 font-medium">Job Title / Role</label>
                            <input type="text" name="title" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} placeholder="e.g. Software Engineer" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-text-dark mb-1 font-medium">Job Description</label>
                        <textarea name="description" required rows="4" className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label className="block text-text-dark mb-1 font-medium">Requirements / Qualifications</label>
                        <textarea name="requirements" required rows="2" className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} placeholder="e.g. B.Tech CS/IT, >60%"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-dark mb-1 font-medium">Vacancies</label>
                            <input type="number" name="vacancies" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 font-medium">Location</label>
                            <input type="text" name="location" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-dark mb-1 font-medium">Salary Package (LPA)</label>
                            <input type="text" name="package" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} placeholder="e.g. 8 LPA" />
                        </div>
                        <div>
                            <label className="block text-text-dark mb-1 font-medium">Application Deadline</label>
                            <input type="date" name="deadline" required className="w-full px-4 py-2 border border-input-border rounded" onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-opacity-90 font-bold mt-4">Launch Drive</button>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
