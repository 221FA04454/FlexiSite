import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import MouseIcon from '@mui/icons-material/Mouse';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white dark:bg-slate-800/40 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
            </span>
        </div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</div>
    </div>
);

const AnalyticsDashboard = ({ onClose }) => {
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-[48px] shadow-2xl flex flex-col border border-white/20 overflow-hidden">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 items-center justify-center">
                            <BarChartIcon fontSize="large" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Insights & Metrics</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time performance analytics for your site</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                            {['24h', '7d', '30d', '90d'].map(range => (
                                <button 
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/30 dark:bg-slate-900/50">
                    
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Visitors" value="12,842" change={12} icon={<PeopleIcon />} color="bg-indigo-500" />
                        <StatCard title="Avg. Time on Page" value="4m 32s" change={-3} icon={<AccessTimeIcon />} color="bg-orange-500" />
                        <StatCard title="Conversion Rate" value="3.24%" change={8} icon={<TrendingUpIcon />} color="bg-emerald-500" />
                        <StatCard title="Interaction Hits" value="48.9k" change={24} icon={<MouseIcon />} color="bg-violet-500" />
                    </div>

                    {/* Main Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Traffic Overview Mockup */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800/40 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">Traffic Overview</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Returning</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Simulated Visual Chart */}
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {[40, 60, 45, 90, 65, 80, 50, 70, 85, 40, 55, 75, 95, 60, 40].map((h, i) => (
                                    <div key={i} className="flex-1 space-y-2 group cursor-pointer">
                                        <div className="relative h-full flex flex-col justify-end">
                                            <div style={{ height: `${h}%` }} className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl group-hover:bg-indigo-500/20 transition-all"></div>
                                            <div style={{ height: `${h * 0.7}%` }} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl shadow-lg shadow-indigo-500/20 group-hover:scale-y-105 transition-all"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between px-2">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                                    <span key={d} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
                                ))}
                            </div>
                        </div>

                        {/* Top Pages List */}
                        <div className="bg-white dark:bg-slate-800/40 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 flex flex-col">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-8">Top Performing Pages</h3>
                            <div className="space-y-6 flex-1">
                                {[
                                    { name: 'Home Landing', slug: '/', views: '4.2k' },
                                    { name: 'Pricing Plans', slug: '/pricing', views: '2.8k' },
                                    { name: 'Contact Us', slug: '/contact', views: '1.5k' },
                                    { name: 'Product Gallery', slug: '/shop', views: '1.2k' },
                                ].map(page => (
                                    <div key={page.slug} className="flex items-center justify-between group cursor-pointer">
                                        <div>
                                            <div className="text-xs font-black text-slate-700 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{page.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 font-mono italic">{page.slug}</div>
                                        </div>
                                        <div className="text-sm font-black text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{page.views}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-800">
                                View Full Report
                            </button>
                        </div>

                    </div>

                </div>

                {/* Footer Insight */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center justify-center gap-3">
                        <AutoAwesomeIcon sx={{ fontSize: 14 }} className="text-indigo-500" />
                        AI Insight: Your "Pricing Plans" page has an 8% higher bounce rate on Mobile viewports.
                    </p>
                </div>

            </div>
        </div>
    );
};

// Simplified AutoAwesomeIcon for the mockup
const AutoAwesomeIcon = ({ className, sx }) => (
    <svg className={className} style={sx} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
);

export default AnalyticsDashboard;
