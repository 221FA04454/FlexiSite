import React from 'react';
import { 
    Activity, Rocket, Database, Layers, 
    Layout, Key, Globe, Users 
} from 'lucide-react';

const UsageSummaryCards = ({ usage, plan }) => {
    const stats = [
        { label: 'Projects', val: usage.projectsCreated, limit: plan.limits.sites, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pages', val: usage.pagesCreated, limit: plan.limits.pagesPerSite, icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Builds (Monthly)', val: usage.buildsTriggered, limit: plan.limits.buildsPerMonth, icon: Rocket, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Analytics Events', val: usage.analyticsEvents, limit: plan.limits.analyticsEventsPerMonth, icon: Activity, color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: 'Storage (MB)', val: usage.storageUsedMB, limit: plan.limits.storageMB, icon: Database, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Custom Domains', val: usage.domainsConnected, limit: plan.limits.domains, icon: Globe, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'API Keys', val: usage.apiKeysCreated, limit: plan.limits.apiKeys, icon: Key, color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Team Members', val: usage.membersInvited, limit: plan.limits.members, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
                const percent = Math.min(100, (stat.val / stat.limit) * 100);
                const isNearLimit = percent >= 80;
                const isOverLimit = percent >= 100;

                return (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} opacity-20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform`} />
                        
                        <div className="relative flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                                    <stat.icon size={22} />
                                </div>
                                {isOverLimit ? (
                                    <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Exceeded</span>
                                ) : isNearLimit ? (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest text-xs">Near Limit</span>
                                ) : null}
                            </div>

                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stat.val.toLocaleString()}</h4>
                                    <span className="text-slate-400 font-bold text-xs">/ {stat.limit.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-4 w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : stat.color.replace('text', 'bg')}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UsageSummaryCards;
