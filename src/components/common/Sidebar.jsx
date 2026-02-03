import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WebIcon from '@mui/icons-material/Web';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@context/ThemeContext'; // Assuming alias works

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { name: 'Builder', icon: <WebIcon />, path: '/builder' },
        { name: 'Components', icon: <LayersIcon />, path: '/components' },
        { name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    return (
        <aside className="h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                    F
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                    FlexiSite
                </span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        <span className="group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                        </span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                    onClick={() => {
                        if(window.confirm('Log out of FlexiSite?')) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                    <LogoutIcon />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
