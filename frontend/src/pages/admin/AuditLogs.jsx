import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FiClock, FiUser, FiActivity, FiSearch } from 'react-icons/fi';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/admin/audit-logs');
            setLogs(data.data || []);
        } catch (error) {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-800';
            case 'UPDATE': return 'bg-blue-100 text-blue-800';
            case 'DELETE': return 'bg-red-100 text-red-800';
            case 'EXPORT': return 'bg-purple-100 text-purple-800';
            case 'LOGIN': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full border p-2 pl-8 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-2.5 top-2.5 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-gray-600 font-semibold text-sm">Action</th>
                            <th className="p-4 text-gray-600 font-semibold text-sm">Resource</th>
                            <th className="p-4 text-gray-600 font-semibold text-sm">User</th>
                            <th className="p-4 text-gray-600 font-semibold text-sm">Details</th>
                            <th className="p-4 text-gray-600 font-semibold text-sm">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-medium">{log.resource}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px]">
                                            <FiUser />
                                        </div>
                                        <span className="text-sm">{log.user?.email || 'System'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <code className="text-[10px] bg-gray-50 p-1 rounded block max-w-xs truncate">
                                        {JSON.stringify(log.details)}
                                    </code>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <FiClock className="text-gray-400" />
                                        {new Date(log.createdAt).toLocaleString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No logs matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
