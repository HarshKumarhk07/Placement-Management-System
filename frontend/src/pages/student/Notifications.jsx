import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCircle, Briefcase, Info, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Notifications = () => {
    const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'new_drive': return <Briefcase className="text-blue-500" />;
            case 'application_status': return <CheckCircle className="text-green-500" />;
            case 'interview_scheduled': return <Calendar className="text-purple-500" />;
            default: return <Info className="text-gray-500" />;
        }
    };

    if (loading && notifications.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="w-6 h-6" /> Notifications
                </h1>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary hover:text-primary-dark underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No notifications yet.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <motion.div
                            key={notification._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border transition-all ${notification.isRead
                                    ? 'bg-white border-gray-100 text-gray-600'
                                    : 'bg-blue-50 border-blue-100 text-gray-800 shadow-sm'
                                }`}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                        >
                            <div className="flex gap-4">
                                <div className="mt-1 bg-white p-2 rounded-full shadow-sm h-fit">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold ${!notification.isRead && 'text-primary'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">{notification.message}</p>
                                    {!notification.isRead && (
                                        <div className="mt-2 text-xs font-medium text-primary flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
