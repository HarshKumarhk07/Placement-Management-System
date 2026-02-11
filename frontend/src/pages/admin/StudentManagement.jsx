import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/admin/students');
            setStudents(data.data || []);
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student? This action is irreversible.')) return;
        try {
            await axios.delete(`/admin/student/${id}`);
            toast.success('Student deleted successfully');
            fetchStudents();
        } catch (error) {
            toast.error('Failed to delete student');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
                <p className="text-gray-500">{students.length} Registered Students</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                    <div key={student._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <FiUser size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{student.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize">{student.profile?.course || 'No Course'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(student._id)}
                                className="text-red-400 hover:text-red-600 transition"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiMail className="text-gray-400" />
                                <span>{student.email}</span>
                            </div>
                            {student.profile?.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FiPhone className="text-gray-400" />
                                    <span>{student.profile.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiCalendar className="text-gray-400" />
                                <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                Batch: {student.profile?.year || 'N/A'}
                            </span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                CGPA: {student.profile?.cgpa || 'N/A'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {students.length === 0 && !loading && (
                <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No students registered yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
