import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiPlus, FiBriefcase } from 'react-icons/fi';

const DriveManagement = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDrives = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/jobs'); // Standardized data.data
            setDrives(data.data || []);
        } catch (error) {
            toast.error('Failed to load drives');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
        try {
            await axios.put(`/admin/drive/${id}/status`, { status: newStatus });
            toast.success(`Drive ${newStatus}`);
            fetchDrives();
        } catch (error) {
            toast.error('Failed to update drive status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Placement Drives</h1>
                <Link
                    to="/admin/jobs/create"
                    // Better: Open modal to pick company then create job
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                >
                    <FiPlus /> New Drive
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map(drive => (
                    <div key={drive._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{drive.title}</h3>
                                <p className="text-sm text-gray-500">{drive.company?.name || 'Unknown Company'}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${drive.status === 'Active' ? 'bg-green-100 text-green-700' :
                                drive.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {drive.status || 'Active'}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <p>💰 {drive.package}</p>
                            <p>📍 {drive.location}</p>
                            <p>📅 Deadline: {new Date(drive.deadline).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                to={`/admin/applications?job=${drive._id}`}
                                className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-medium text-center"
                            >
                                View Applicants
                            </Link>
                            <button
                                onClick={() => handleStatusToggle(drive._id, drive.status)}
                                className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm font-medium"
                            >
                                {drive.status === 'Active' ? 'Close Drive' : 'Open Drive'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriveManagement;
