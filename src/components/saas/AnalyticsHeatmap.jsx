import React from 'react';
import { Box, Chip } from '@mui/material';
import { MousePointer2, Sparkles, Lock } from 'lucide-react';

const AnalyticsHeatmap = ({ pageName = "/home" }) => {
    const heatDots = React.useMemo(() => [...Array(50)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        scale: Math.random() * 2,
        opacity: Math.random()
    })), []);

    return (
        <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 group h-[500px]">
            {/* Mock Page Content */}
            <div className="absolute inset-0 p-8 opacity-20 filter blur-sm grayscale pointer-events-none">
                <div className="h-12 w-48 bg-slate-300 rounded mb-8" />
                <div className="grid grid-cols-3 gap-8 mb-8">
                    <div className="h-40 bg-slate-300 rounded-2xl" />
                    <div className="h-40 bg-slate-300 rounded-2xl" />
                    <div className="h-40 bg-slate-300 rounded-2xl" />
                </div>
                <div className="h-64 bg-slate-200 rounded-3xl" />
            </div>

            {/* Heatmap Overlay Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
                <div className="w-20 h-20 bg-indigo-600/10 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 ring-4 ring-white shadow-xl">
                    <Sparkles size={40} className="animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Precision Heatmaps</h3>
                <p className="text-slate-500 max-w-sm mt-3 font-medium">
                    Visualize where your users click, scroll, and hover with millisecond precision tracking.
                </p>

                <div className="flex gap-4 mt-8">
                    <Chip 
                        icon={<MousePointer2 size={14} />} 
                        label="Click Density" 
                        className="!bg-white !text-slate-600 !font-bold shadow-sm"
                    />
                    <Chip 
                        icon={<Lock size={14} className="text-indigo-600" />} 
                        label="Enterprise Pro Feature" 
                        className="!bg-indigo-600 !text-white !font-black !px-4"
                    />
                </div>

                <div className="mt-12 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Joining 4,200+ Alpha Labs</span>
                </div>
            </div>
            
            {/* Random Dots (Heat points) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {heatDots.map((dot) => (
                    <div 
                        key={dot.id}
                        className="absolute w-4 h-4 bg-orange-400 rounded-full blur-md"
                        style={{
                            left: dot.left,
                            top: dot.top,
                            transform: `scale(${dot.scale})`,
                            opacity: dot.opacity
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnalyticsHeatmap;
