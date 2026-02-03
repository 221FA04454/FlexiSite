import React from 'react';
import { useTheme } from '@context/ThemeContext';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Avatar, Badge } from '@mui/material';

const Topbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group hidden md:block">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 w-64 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
                    <IconButton onClick={toggleTheme} className="transition-transform hover:rotate-12">
                        {theme === 'dark' ? (
                            <LightModeIcon className="text-yellow-400" />
                        ) : (
                            <DarkModeIcon className="text-slate-600" />
                        )}
                    </IconButton>

                    <IconButton>
                        <Badge badgeContent={4} color="primary">
                            <NotificationsIcon className="text-slate-600 dark:text-slate-300" />
                        </Badge>
                    </IconButton>

                    <div className="ml-2 cursor-pointer hover:ring-2 ring-indigo-500 rounded-full transition-all">
                        <Avatar
                            alt="User"
                            src="https://i.pravatar.cc/150?img=32"
                            sx={{ width: 32, height: 32 }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
