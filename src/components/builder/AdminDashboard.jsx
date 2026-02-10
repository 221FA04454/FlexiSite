import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LanguageIcon from '@mui/icons-material/Language';
import RocketIcon from '@mui/icons-material/Rocket';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

import { useSaaSStore } from '../../store/saasStore';
import AnalyticsDashboard from './AnalyticsDashboard'; // We can reuse the view parts

const StatCard = ({ title, value, limit, unit = '' }) => {
    const percentage = limit ? Math.min((parseInt(value) / limit) * 100, 100) : 0;
    return (
        <div className="bg-white dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
            <div className="text-xl font-black text-slate-800 dark:text-white mb-3">
                {value}{unit}
                {limit && <span className="text-slate-400 text-xs font-bold ml-1">/ {limit}{unit}</span>}
            </div>
            {limit && (
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            )}
        </div>
    );
};

    const SidebarItem = ({ id, label, icon, isActive, onClick }) => (
        <button 
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
            {icon}
            <span className="flex-1 text-left">{label}</span>
        </button>
    );

const AdminDashboard = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const tenant = useSaaSStore(state => state.tenants[state.activeTenantId]);
    const allTenants = useSaaSStore(state => state.tenants);
    const switchTenant = useSaaSStore(state => state.switchTenant);
    const createKey = useSaaSStore(state => state.createApiKey);
    const addDomain = useSaaSStore(state => state.addDomain);
    const verifyDomain = useSaaSStore(state => state.verifyDomain);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-7xl h-[92vh] rounded-[48px] shadow-2xl flex border border-white/20 overflow-hidden">
                
                {/* --- Enterprise Sidebar --- */}
                <div className="w-80 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-8 bg-white dark:bg-slate-900">
                    
                    {/* Tenant Switcher */}
                    <div className="px-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Organization</label>
                        <select 
                            value={tenant.id}
                            onChange={(e) => switchTenant(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat"
                        >
                            {Object.values(allTenants).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 space-y-1.5 px-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block opacity-50">Management</label>
                        <SidebarItem id="overview" label="Overview" icon={<DashboardIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'overview'} onClick={setActiveTab} />
                        <SidebarItem id="tenants" label="Teams & Users" icon={<CorporateFareIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'tenants'} onClick={setActiveTab} />
                        <SidebarItem id="projects" label="Project Assets" icon={<HubIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'projects'} onClick={setActiveTab} />
                        
                        <div className="pt-6 pb-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block opacity-50">Operations</label>
                        </div>
                        <SidebarItem id="deployments" label="Builds & Edge" icon={<RocketIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'deployments'} onClick={setActiveTab} />
                        <SidebarItem id="domains" label="Custom Domains" icon={<LanguageIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'domains'} onClick={setActiveTab} />
                        <SidebarItem id="apikeys" label="API Infrastructure" icon={<VpnKeyIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'apikeys'} onClick={setActiveTab} />
                        <SidebarItem id="analytics" label="Site Insights" icon={<BarChartIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'analytics'} onClick={setActiveTab} />
                        
                        <div className="pt-6 pb-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block opacity-50">System</label>
                        </div>
                        <SidebarItem id="logs" label="Audit Logs" icon={<HistoryIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'logs'} onClick={setActiveTab} />
                        <SidebarItem id="settings" label="Billing & Quotas" icon={<SettingsIcon sx={{ fontSize: 18 }} />} isActive={activeTab === 'settings'} onClick={setActiveTab} />
                    </div>

                    <button 
                        onClick={onClose}
                        className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                        Return to Canvas
                    </button>
                </div>

                {/* --- Main Operational Console --- */}
                <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
                    
                    {/* Console Header */}
                    <div className="h-24 px-12 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                                {activeTab} Console
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                WorkSpace: {tenant.name} | Plan: <span className="text-indigo-600">{tenant.plan}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase">User Account</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase">Verified {tenant.ownerId === 'user_001' ? 'Owner' : 'Member'}</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Avatar" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12">
                        
                        {/* --- OVERVIEW TAB --- */}
                        {activeTab === 'overview' && (
                            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <StatCard title="Analytics Quota" value={tenant.usage.eventsThisMonth} limit={tenant.limits.analyticsQuota} />
                                    <StatCard title="Monthly Builds" value={tenant.usage.buildsThisMonth} limit={tenant.limits.buildsPerMonth} />
                                    <StatCard title="Bandwidth" value={tenant.usage.bandwidthUsed.replace('GB', '')} limit={10} unit="GB" />
                                    <StatCard title="Deployment Hub" value={tenant.deployments.length} unit=" Active" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <VerifiedIcon fontSize="large" />
                                            </div>
                                            <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">View All Domains</button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Production URL</h3>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-mono text-slate-400">https://{tenant.domains[0]?.domain || 'not-connected.com'}</div>
                                                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase">Live</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-600 p-8 rounded-[40px] flex flex-col justify-between text-white shadow-2xl shadow-indigo-600/30">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <RocketIcon fontSize="large" />
                                            </div>
                                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                                <CloudDownloadIcon />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black mb-1 uppercase tracking-tighter">Latest Release</h3>
                                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">v.1.2.4 • Success • 2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- DEPLOYMENTS TAB --- */}
                        {activeTab === 'deployments' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-400">
                                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white"><RocketIcon fontSize="large" /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Enterprise Build Pipeline</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Immutable Build History</p>
                                        </div>
                                    </div>
                                    <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                                        Trigger New Edge Build
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-50 dark:border-slate-800">
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Build ID</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Version</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployed At</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {tenant.deployments.map(build => (
                                                <tr key={build.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-500">#{build.id.split('_')[1]}</td>
                                                    <td className="px-8 py-6">
                                                        <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase px-3 py-1 bg-emerald-50 rounded-full w-fit">
                                                            <CheckCircleIcon sx={{ fontSize: 10 }} /> {build.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-xs font-black text-slate-800 dark:text-white">v.{build.version}</td>
                                                    <td className="px-8 py-6 text-xs font-bold text-slate-400">{new Date(build.date).toLocaleString()}</td>
                                                    <td className="px-8 py-6 flex gap-3">
                                                        <button 
                                                            title="Rollback to this build"
                                                            className="p-2 text-slate-400 hover:text-orange-500 transition-all active:rotate-180"
                                                        >
                                                            <HistoryIcon fontSize="small" />
                                                        </button>
                                                        <button 
                                                            title="Download ZIP Archive"
                                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                                        >
                                                            <CloudDownloadIcon fontSize="small" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* --- DOMAINS TAB --- */}
                        {activeTab === 'domains' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-2">Connected Domains</h3>
                                            <p className="text-sm font-medium text-slate-400">Manage DNS records and Edge-SSL certificates.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const d = prompt("Enter domain name (e.g. site.com):");
                                                if(d) addDomain(d);
                                            }}
                                            className="px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                                        >
                                            + Add Custom Domain
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {tenant.domains.map(dom => (
                                            <div key={dom.domain} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 group transition-all hover:border-indigo-500/30">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-14 h-14 rounded-2xl ${dom.status === 'verified' ? 'bg-emerald-500' : 'bg-orange-500'} flex items-center justify-center text-white shadow-lg`}>
                                                            <LanguageIcon fontSize="large" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xl font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tight">{dom.domain}</div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SSL: {dom.sslStatus}</span>
                                                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {dom.status}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        {dom.status === 'pending' && (
                                                            <button 
                                                                onClick={() => verifyDomain(dom.domain)}
                                                                className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase"
                                                            >
                                                                Verify Settings
                                                            </button>
                                                        )}
                                                        <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-red-500 border border-slate-100 dark:border-slate-700 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Type</label>
                                                        <div className="text-xs font-bold text-indigo-600">CNAME</div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Host</label>
                                                        <div className="text-xs font-bold">@ / www</div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Value</label>
                                                            <div className="text-xs font-bold font-mono">cname.flexisite.cdn</div>
                                                        </div>
                                                        <ContentCopyIcon fontSize="small" className="text-slate-300 hover:text-slate-600 cursor-pointer" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- API INFRASTRUCTURE TAB --- */}
                        {activeTab === 'apikeys' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-400">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-2">API Infrastructure</h3>
                                        <p className="text-sm font-medium text-slate-400">Enterprise authentication for head-less rendering & widgets.</p>
                                    </div>
                                    <button 
                                        onClick={() => createKey(['read_project', 'publish_build'])}
                                        className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[32px] text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                                    >
                                        + Generate Private Key
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {tenant.apiKeys.map(key => (
                                        <div key={key.id} className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-10">
                                                <div className="w-16 h-16 rounded-[24px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                    <VpnKeyIcon fontSize="large" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <span className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Production Access Key</span>
                                                        <span className={`px-3 py-1 ${key.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} rounded-full text-[10px] font-black uppercase`}>
                                                            {key.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs font-bold text-slate-500 border border-slate-100 dark:border-slate-800">
                                                            {key.value}
                                                        </div>
                                                        <div className="h-4 w-px bg-slate-200"></div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Used: {key.lastUsed ? new Date(key.lastUsed).toLocaleString() : 'Never'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className="p-4 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm">
                                                    <ContentCopyIcon fontSize="small" />
                                                </button>
                                                <button className="p-4 bg-slate-100 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm">
                                                    <CloseIcon fontSize="small" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- INTEGRATIONS TAB --- */}
                        {activeTab === 'integrations' && (
                            <div className="space-y-10 animate-in slide-in-from-right-4 duration-400">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    
                                    {/* Embed Script Generator */}
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                <CodeIcon />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Full Page Embed</h3>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                            Inject the entire FlexiSite page into your host application using the universal loader.
                                        </p>
                                        <div className="relative group">
                                            <pre className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-indigo-600 overflow-x-auto">
{`<script 
  src="https://cdn.flexisite.com/embed.js" 
  data-project="${tenant.id}" 
  data-page="home"
  async
></script>
<div id="fs-root"></div>`}
                                            </pre>
                                            <button className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                                                <ContentCopyIcon fontSize="small" className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Micro-Frontend Widget Generator */}
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                                <HubIcon />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Widget SDK</h3>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                            Export a single component as a micro-frontend module with tenant-aware theme injection.
                                        </p>
                                        <div className="relative group">
                                            <pre className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-orange-600 overflow-x-auto">
{`<script 
  src="https://cdn.flexisite.com/widget.js" 
  data-component="ContactForm"
  data-tenant="${tenant.id}"
></script>`}
                                            </pre>
                                            <button className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                                                <ContentCopyIcon fontSize="small" className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    
                                    {/* Webhook Management */}
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Outbound Webhooks</h3>
                                            <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">+ Add Hook</button>
                                        </div>
                                        <div className="space-y-4">
                                            {tenant.webhooks.map(wh => (
                                                <div key={wh.id} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><CheckCircleIcon fontSize="small" /></div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{wh.url}</div>
                                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Events: {wh.events.join(', ')}</div>
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] font-black text-red-500 uppercase">Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PostMessage Event Viewer */}
                                    <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 flex flex-col h-[400px]">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Runtime Event Bridge</h3>
                                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                Listening
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                                            <div className="text-emerald-400 opacity-80">[10:04:12] fs:ready - Runtime Handshake Complete</div>
                                            <div className="text-indigo-400 opacity-80">[10:04:15] fs:node_clicked - {`{ nodeId: "btn_01", type: "Button" }`}</div>
                                            <div className="text-orange-400 opacity-80">[10:04:18] fs:form_submit - {`{ formId: "contact_01", fields: 4 }`}</div>
                                            <div className="text-slate-500 italic mt-4">// Awaiting real-time triggers from embed sandbox...</div>
                                        </div>
                                        <button className="mt-6 w-full py-4 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all">
                                            Clear Bridge History
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* --- ANALYTICS TAB (Integrated) --- */}
                        {activeTab === 'analytics' && (
                            <div className="animate-in fade-in zoom-in duration-500">
                                {/* We can either port the AnalyticsDashboard logic here or render it embedded */}
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="bg-indigo-600 p-10 rounded-[48px] text-white flex flex-col justify-between h-72 shadow-2xl shadow-indigo-600/30">
                                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><BarChartIcon fontSize="large" /></div>
                                            <div>
                                                <div className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Project Reach</div>
                                                <div className="text-5xl font-black tracking-tighter">84.2k</div>
                                                <div className="text-xs font-bold text-indigo-100 mt-2 uppercase tracking-widest">+14% vs last month</div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[48px] flex flex-col justify-between h-72">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Device Breakdown</h4>
                                                <div className="flex gap-4">
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-slate-800 dark:text-white italic tracking-tighter">● Desktop 64%</span>
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-slate-800 dark:text-white italic tracking-tighter">● Mobile 32%</span>
                                                </div>
                                            </div>
                                            <div className="h-20 w-full flex items-center gap-2">
                                                <div className="h-full bg-indigo-500 rounded-2xl" style={{ width: '64%' }}></div>
                                                <div className="h-full bg-indigo-200 rounded-2xl" style={{ width: '32%' }}></div>
                                                <div className="h-full bg-slate-100 rounded-2xl flex-1"></div>
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-lg">
                                                Engagement is highest on Desktop viewports during operational hours (9am - 5pm UTC). Mobile traffic peaks between 6pm and 10pm.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 p-10">
                                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-10">Interaction Heat Map Pipeline</h3>
                                        <div className="h-64 bg-slate-50 dark:bg-slate-950 rounded-[32px] flex items-center justify-center text-slate-400 text-xs font-black uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-800">
                                            Interactive Data Stream Visualization Pipeline
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- LOGS TAB --- */}
                        {activeTab === 'logs' && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-6 transition-all duration-300">
                                <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">System Audit Log</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fontSize="small" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Filter logs..." 
                                                    className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {tenant.logs.map(log => (
                                            <div key={log.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-8">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.type === 'security' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {log.type === 'security' ? <SecurityIcon fontSize="small" /> : <HistoryIcon fontSize="small" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{log.message}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.type} event</div>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-slate-400 font-mono italic">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- SETTINGS & BILLING TAB --- */}
                        {activeTab === 'settings' && (
                            <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-400">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-8">Storage & Quotas</h3>
                                        <div className="space-y-8">
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                                    <span>Static Asset Storage</span>
                                                    <span>{tenant.usage.storageUsed} / 10GB</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 w-[12%]"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                                    <span>Monthly Data Transfer</span>
                                                    <span>{tenant.usage.bandwidthUsed} / 100GB</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 w-[2.4%]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-10 rounded-[48px] border border-slate-800 text-white shadow-2xl shadow-indigo-900/20">
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">Active Plan</span>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter mt-4">{tenant.plan} Subscription</h3>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center"><VerifiedIcon fontSize="large" /></div>
                                        </div>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed mb-8">
                                            Your next invoice will be generated on March 1, 2026. Auto-renew is enabled for the registered payment method.
                                        </p>
                                        <button className="w-full py-5 bg-white text-slate-900 rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                            Manage Billing & Subscriptions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- FALLBACKS --- */}
                        {(activeTab === 'tenants' || activeTab === 'projects') && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale saturate-0 scale-95">
                                <div className="w-24 h-24 rounded-[40px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 border-2 border-dashed border-slate-300">
                                    <CorporateFareIcon sx={{ fontSize: 48 }} className="text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-3">Enterprise Governance</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm leading-relaxed">
                                    The **{activeTab}** module is active for Enterprise-tier tenants. Connect your SSO provider to activate the full RBAC control center.
                                </p>
                                <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                    Contact Sales for Upgrade
                                </button>
                            </div>
                        )}

                    </div>
                    
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
