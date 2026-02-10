import React from 'react';
import { 
    Dialog, DialogContent, Button, Grid, 
    IconButton, Typography, Divider 
} from '@mui/material';
import { X, Check, Zap, Rocket, Building2, Globe, Sparkles } from 'lucide-react';
import { PLAN_CONFIGS, PLANS } from '../../../store/saas/usageStore';

const UpgradePlanModal = ({ open, onClose, currentPlanId, onUpgrade }) => {
    const plans = [
        { 
            ...PLAN_CONFIGS[PLANS.FREE], 
            icon: Sparkles, 
            color: 'slate', 
            features: ['1 Project', '1 Domain', 'Community Support', 'Basic Analytics'] 
        },
        { 
            ...PLAN_CONFIGS[PLANS.PRO], 
            icon: Rocket, 
            color: 'indigo', 
            features: ['5 Projects', '50 Build/mo', 'Email Support', 'Advanced Analytics', '5 API Keys'],
            popular: true
        },
        { 
            ...PLAN_CONFIGS[PLANS.BUSINESS], 
            icon: Building2, 
            color: 'violet', 
            features: ['25 Projects', '500 Build/mo', 'Priority Support', 'Full API Access', 'Team Management'] 
        },
        { 
            ...PLAN_CONFIGS[PLANS.ENTERPRISE], 
            icon: Globe, 
            color: 'emerald', 
            features: ['Unlimited Scale', 'Dedicated Manager', 'Custom SLA', 'Security White-labeling', 'SIEM Integration'] 
        }
    ];

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xl"
            PaperProps={{ className: '!rounded-[3rem] !bg-slate-50 overflow-hidden !m-4' }}
        >
            <div className="absolute top-6 right-6 z-20">
                <IconButton onClick={onClose} className="!bg-white shadow-sm"><X size={24} /></IconButton>
            </div>

            <DialogContent className="!p-0">
                <div className="bg-white p-12 text-center space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">Evolve Your Infrastructure</h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Scale your resource vectors and unlock enterprise-grade deployment orchestration.</p>
                </div>

                <div className="p-8 lg:p-16">
                    <Grid container spacing={4} alignItems="stretch">
                        {plans.map((p) => {
                            const isCurrent = p.id === currentPlanId;
                            const isFree = p.id === PLANS.FREE;

                            return (
                                <Grid item xs={12} md={6} lg={3} key={p.id}>
                                    <div className={`h-full flex flex-col bg-white rounded-[2.5rem] p-8 border-2 transition-all relative ${
                                        p.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-500/10 scale-105 z-10' : 'border-transparent shadow-sm'
                                    }`}>
                                        {p.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                Most Recommended
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${p.color}-50 text-${p.color}-600`}>
                                                <p.icon size={28} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">{p.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-2">
                                                <p className="text-3xl font-black text-slate-900">${p.price}</p>
                                                <p className="text-slate-400 font-bold text-sm">/mo</p>
                                            </div>
                                        </div>

                                        <Divider />

                                        <ul className="my-8 space-y-4 flex-1">
                                            {p.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center bg-${p.color}-50 text-${p.color}-600 shrink-0`}>
                                                        <Check size={12} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600">{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button 
                                            fullWidth 
                                            variant={p.popular ? 'contained' : 'outlined'}
                                            disabled={isCurrent}
                                            onClick={() => onUpgrade(p.id)}
                                            className={`!py-3.5 !rounded-2xl !font-black !normal-case !text-base ${
                                                isCurrent ? '!bg-slate-100 !text-slate-400 !border-none' :
                                                p.popular ? '!bg-indigo-600 !text-white' : '!border-slate-200 !text-slate-900'
                                            }`}
                                        >
                                            {isCurrent ? 'Current Plan' : isFree ? 'Downgrade' : 'Select Plan'}
                                        </Button>
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>

                <div className="bg-indigo-900 p-12 text-center text-white space-y-6">
                    <p className="font-black text-indigo-300 uppercase tracking-widest text-xs">Trusted by 12,000+ Enterprise Teams</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale contrast-200">
                        {['AWS', 'Google Cloud', 'Cloudflare', 'GitHub'].map(name => (
                            <span key={name} className="text-3xl font-black tracking-tighter italic">{name}</span>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpgradePlanModal;
