import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/common/Sidebar';
import Topbar from '@components/common/Topbar';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
