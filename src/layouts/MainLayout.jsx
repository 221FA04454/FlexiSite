import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/common/Sidebar';
import TopBar from '@components/common/TopBar';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar />
                <main className="flex-1 overflow-auto bg-white/40 dark:bg-black/20 backdrop-blur-3xl p-4 md:p-0">
                    <Suspense fallback={<div className="flex items-center justify-center h-full text-indigo-500 font-bold animate-pulse">Initializing FlexiSite Core...</div>}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
