import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../components/ui/ExpandableSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background flex overflow-hidden">
                {/* Modern SaaS Sidebar */}
                <AdminSidebar />

                {/* Main Dashboard Area */}
                <div className="flex-1 flex flex-col min-w-0 h-screen">
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                        <div className="max-w-7xl mx-auto w-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;
