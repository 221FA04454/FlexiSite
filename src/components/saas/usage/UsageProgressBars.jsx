import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

const UsageProgressBars = ({ usage, plan }) => {
    const items = [
        { label: 'Site Creation', current: usage.projectsCreated, limit: plan.limits.sites, unit: 'Sites' },
        { label: 'Build Execution', current: usage.buildsTriggered, limit: plan.limits.buildsPerMonth, unit: 'Builds' },
        { label: 'Analytics Pipeline', current: usage.analyticsEvents, limit: plan.limits.analyticsEventsPerMonth, unit: 'Events' },
        { label: 'Cloud Storage', current: usage.storageUsedMB, limit: plan.limits.storageMB, unit: 'MB' }
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                Quota Saturation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {items.map((item, i) => {
                    const percent = Math.min(100, (item.current / item.limit) * 100);
                    const isWarning = percent >= 80;
                    const isCritical = percent >= 95;

                    return (
                        <div key={i} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{item.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.current.toLocaleString()} {item.unit} consumed</p>
                                </div>
                                <span className={`text-sm font-black ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-indigo-600'}`}>
                                    {percent.toFixed(1)}%
                                </span>
                            </div>
                            
                            <Box sx={{ width: '100%', position: 'relative' }}>
                                <div className="h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            isCritical ? 'bg-gradient-to-r from-red-500 to-pink-500' : 
                                            isWarning ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 
                                            'bg-gradient-to-r from-indigo-500 to-blue-500'
                                        }`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                {isCritical && (
                                    <div className="flex items-center gap-1.5 mt-2 transition-all animate-in fade-in slide-in-from-top-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Critical: Capacity Exhausted</p>
                                    </div>
                                )}
                            </Box>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsageProgressBars;
