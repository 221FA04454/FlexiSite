import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/Key';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import HubIcon from '@mui/icons-material/Hub';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useProjectStore } from '../../store/projectStore';

const IntegrationPanel = ({ onClose }) => {
    const activePageId = useProjectStore((state) => state.activePageId);
    const activePage = useProjectStore((state) => state.pages[activePageId]);
    const [copied, setCopied] = useState(false);
    const [apiKey] = useState(() => `fs_live_${Math.random().toString(36).substr(2, 16)}`);

    const embedCode = `
<script 
  src="https://cdn.flexisite.com/embed.js" 
  data-project-id="flexi_proj_882" 
  data-page-id="${activePageId}"
  async
></script>
<!-- Container where FlexiSite will render -->
<div id="flexisite-mount"></div>
    `.trim();

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[70vh] rounded-[48px] shadow-2xl flex flex-col border border-white/20 overflow-hidden">
                
                {/* Header */}
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 rotate-6">
                            <HubIcon fontSize="large" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Integrations</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Multi-Tenant API & Embed Layer
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-90"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Embed Script Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <CodeIcon className="text-indigo-600" />
                            <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tighter uppercase">Universal Embed</h3>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Inject this page into any external application (EduMon, CarTrack, etc.) using a simple script tag.
                        </p>
                        
                        <div className="relative group">
                            <pre className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 overflow-x-auto">
                                {embedCode}
                            </pre>
                            <button 
                                onClick={() => handleCopy(embedCode)}
                                className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all"
                            >
                                {copied ? <CheckCircleIcon className="text-emerald-500" fontSize="small" /> : <ContentCopyIcon fontSize="small" className="text-slate-400" />}
                            </button>
                        </div>
                        
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                Async Loading
                            </span>
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                Auto-Resize
                            </span>
                        </div>
                    </div>

                    {/* API & Security Section */}
                    <div className="space-y-10">
                        {/* API Key */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <KeyIcon className="text-indigo-600" />
                                <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tighter uppercase">Live API Key</h3>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-slate-400">{apiKey}</span>
                                <button onClick={() => handleCopy(apiKey)} className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Regenerate</button>
                            </div>
                        </div>

                        {/* Allowed Domains */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <LanguageIcon className="text-indigo-600" />
                                <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tighter uppercase">CORS Whitelist</h3>
                            </div>
                            <div className="space-y-2">
                                {['*.edumon.com', 'cartrack.app', 'localhost:3000'].map(domain => (
                                    <div key={domain} className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-500 flex items-center justify-between">
                                        {domain}
                                        <button className="text-red-500 opacity-0 group-hover:opacity-100 hover:underline">Remove</button>
                                    </div>
                                ))}
                                <button className="w-full py-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                    + Add New Domain
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Advice */}
                <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        Pro Tip: Use <span className="text-indigo-600">postMessage</span> events to sync data between FlexiSite widgets <br/> and your host application dashboard.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default IntegrationPanel;
