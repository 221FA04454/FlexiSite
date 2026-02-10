import React from 'react';
import { Button, Divider } from '@mui/material';
import { 
    Zap, Calendar, Clock, Sparkles, 
    ArrowUpCircle, Info, ShieldCheck 
} from 'lucide-react';

const PlanInfoCard = ({ plan, onUpgrade }) => {
    return (
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 opacity-20 blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500 opacity-10 blur-[80px] -ml-24 -mb-24" />

            <div className="relative z-10 space-y-8 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-500/30">
                            <Zap size={12} />
                            Active Infrastructure
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">{plan.name}</h2>
                        <p className="text-indigo-200/60 font-medium mt-2">Workspace initialized on FlexiSite Cloud v2.4</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pricing Model</p>
                        <p className="text-2xl font-black">${plan.price}<span className="text-xs text-indigo-400">/mo</span></p>
                    </div>
                </div>

                <Divider className="!border-white/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl"><Calendar size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Next Reset</p>
                            <p className="text-sm font-bold mt-1">March 01, 2026</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><ShieldCheck size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Security Status</p>
                            <p className="text-sm font-bold mt-1">Enterprise Shield Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-600/20 border border-indigo-500/30 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-indigo-300" size={20} />
                        <h4 className="font-black text-sm uppercase tracking-widest">Included Entitlements</h4>
                    </div>
                    <ul className="grid grid-cols-2 gap-3">
                        {[
                            'Global CDN Edge',
                            'Asset Optimization',
                            'SSL Orchestration',
                            'Audit Logging',
                            'Advanced RBAC',
                            'API Framework'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-indigo-100">
                                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-10 relative z-10">
                <Button 
                    fullWidth
                    variant="contained"
                    startIcon={<ArrowUpCircle size={20} />}
                    onClick={onUpgrade}
                    className="!bg-white !text-slate-900 !rounded-2xl !py-4 !font-black !normal-case !text-lg hover:!bg-indigo-50 shadow-2xl shadow-indigo-500/30"
                >
                    Expand Infrastructure
                </Button>
                <p className="text-[10px] text-center text-white/40 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Info size={12} />
                    Upgrade any time to unlock higher resource vectors
                </p>
            </div>
        </div>
    );
};

export default PlanInfoCard;
