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
import { useSaaSStore } from '../../store/saasStore';

const AdminDashboard = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('deployments');
    const tenant = useSaaSStore(state => state.tenants[state.activeTenantId]);
    const createKey = useSaaSStore(state => state.createApiKey);

    const SidebarItem = ({ id, label, icon }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-7xl h-[90vh] rounded-[48px] shadow-2xl flex border border-white/20 overflow-hidden">
                
                {/* --- Left Sidebar --- */}
                <div className="w-72 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-10">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black shadow-lg">S</div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tighter">SaaS Admin</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enterprise v2.0</span>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1">
                        <SidebarItem id="deployments" label="Builds & Edge" icon={<RocketIcon sx={{ fontSize: 18 }} />} />
                        <SidebarItem id="domains" label="Custom Domains" icon={<LanguageIcon sx={{ fontSize: 18 }} />} />
                        <SidebarItem id="apikeys" label="API Infrastructure" icon={<VpnKeyIcon sx={{ fontSize: 18 }} />} />
                        <div className="my-6 h-px bg-slate-100 dark:bg-slate-800"></div>
                        <SidebarItem id="tenants" label="Workspace Settings" icon={<CorporateFareIcon sx={{ fontSize: 18 }} />} />
                        <SidebarItem id="logs" label="System Audit" icon={<HistoryIcon sx={{ fontSize: 18 }} />} />
                    </div>

                    <button 
                        onClick={onClose}
                        className="flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                        Exit Dashboard
                    </button>
                </div>

                {/* --- Main Content --- */}
                <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
                    
                    {/* Top Bar */}
                    <div className="h-20 px-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            {activeTab.replace(/([A-Z])/g, ' $1')}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</span>
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10">
                        
                        {/* Tab: Deployments */}
                        {activeTab === 'deployments' && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-8 rounded-[40px] border border-emerald-500/20 flex flex-col justify-between h-56">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg"><RocketIcon /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase mb-1">Live Version</div>
                                            <div className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">v.1.2.4</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 h-56">
                                        <div className="text-[11px] font-black text-slate-400 uppercase mb-6">Build Stats</div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <span>Total Builds</span>
                                                <span className="text-slate-800 dark:text-white">142</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <span>Success Rate</span>
                                                <span className="text-slate-800 dark:text-white">99.2%</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <span>Avg. Deploy Time</span>
                                                <span className="text-slate-800 dark:text-white">4.2s</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed px-1">Recent Activity Log</h3>
                                        <div className="text-[9px] font-black uppercase text-indigo-600 hover:underline cursor-pointer">Download CSV</div>
                                    </div>
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {tenant.deployments.map(build => (
                                            <div key={build.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-slate-800 dark:text-white">Build #{build.id.split('_')[1]}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(build.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-12">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Version: {build.version}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 italic">{build.url}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">
                                                        <CheckCircleIcon sx={{ fontSize: 10 }} />
                                                        Live
                                                    </div>
                                                    <button className="p-2 opacity-0 group-hover:opacity-100 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                                        <RocketIcon sx={{ fontSize: 16 }} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: API Infrastructure */}
                        {activeTab === 'apikeys' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-400">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-2">Access Credentials</h3>
                                        <p className="text-xs font-medium text-slate-400">Securely authenticate your external integrations and apps.</p>
                                    </div>
                                    <button 
                                        onClick={createKey}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                                    >
                                        + Generate Live Key
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {tenant.apiKeys.map(key => (
                                        <div key={key.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                    <VpnKeyIcon />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Main Production Key</span>
                                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase">Active</span>
                                                    </div>
                                                    <div className="text-xs font-mono text-slate-400">{key.value}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                                                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                                                </button>
                                                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all">
                                                    <CloseIcon sx={{ fontSize: 18 }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-8 rounded-[40px] border border-indigo-100 dark:border-indigo-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600"><SettingsIcon fontSize="small" /></div>
                                        <div>
                                            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Integration Documentation</h4>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                                                Use these keys to authenticate your **Widget Engine** requests. Learn how to listen for `postMessage` events like `formSubmitted` or `nodeClicked` in your host application (e.g. EduMon Dashboard).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other tabs as placeholders */}
                        {(activeTab === 'domains' || activeTab === 'tenants' || activeTab === 'logs') && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 filter grayscale">
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8">
                                    <SettingsIcon sx={{ fontSize: 48 }} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">Phase 2 Module</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm leading-relaxed">
                                    This advanced enterprise module is specified in **ARCHITECTURE_SAAS.md** and will be activated in the next development cycle.
                                </p>
                            </div>
                        )}

                    </div>
                    
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
