import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProjectStore } from '../store/projectStore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    
    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data? This will clear your current projects.')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Personalize your builder experience</p>
            </div>

            <div className="space-y-8">
                {/* Appearance */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Appearance</h3>
                        <p className="text-sm text-slate-500">Customize how FlexiSite looks for you</p>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                {isDark ? <DarkModeIcon /> : <LightModeIcon />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">Theme Mode</p>
                                <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleTheme}
                             className={`w-14 h-8 rounded-full transition-colors relative ${isDark ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${isDark ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </section>

                {/* Storage & Data */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Storage & Data</h3>
                        <p className="text-sm text-slate-500">Manage your local data and backups</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                    <DeleteForeverIcon />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">Reset Application</p>
                                    <p className="text-sm text-slate-500 text-balance">Wipe all local changes and start fresh. This cannot be undone.</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleReset}
                                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
                            >
                                Reset Data
                            </button>
                        </div>
                    </div>
                </section>

                {/* Account Simulation */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Account Details</h3>
                            <p className="text-sm text-slate-500">Your profile information</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-medium text-sm">
                            <SaveIcon fontSize="small" />
                            Saved
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Creator Name</label>
                            <input 
                                type="text" 
                                defaultValue="FlexiUser_01" 
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            <input 
                                type="email" 
                                defaultValue="user@flexisite.io" 
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                                disabled
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
