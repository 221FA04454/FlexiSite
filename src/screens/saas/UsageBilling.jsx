import React from 'react';
import { useUsageStore } from '../../store/saas/usageStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { 
    Card, CardContent, Button, Chip, 
    LinearProgress, Divider 
} from '@mui/material';
import { 
    Zap, HardDrive, MousePointer2, Layout, 
    CreditCard, ArrowUpRight, CheckCircle2,
    BarChart3, ShieldCheck
} from 'lucide-react';

const UsageBilling = () => {
    const { activeTenantId, tenants } = useTenantStore();
    const { usage } = useUsageStore();

    const currentTenant = tenants[activeTenantId] || {};
    const currentUsage = usage[activeTenantId] || {};
    const limits = currentTenant.limits || {};

    const metrics = [
        { label: 'Published Builds', used: currentUsage.buildsUsed || 0, limit: limits.builds || 100, icon: Zap, color: 'bg-indigo-600' },
        { label: 'Cloud Storage', used: 2.4, limit: parseFloat(limits.storageQuota) || 10, unit: 'GB', icon: HardDrive, color: 'bg-pink-500' },
        { label: 'Analytics Events', used: currentUsage.analyticsEvents || 0, limit: limits.analyticsQuota || 100000, icon: BarChart3, color: 'bg-emerald-500' },
        { label: 'Project Count', used: currentUsage.projects || 0, limit: limits.projects || 10, icon: Layout, color: 'bg-blue-600' }
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resource Quotas & Billing</h1>
                    <p className="text-slate-500 mt-1">Scale your infrastructure and manage enterprise subscriptions.</p>
                </div>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowUpRight size={18} />}
                    className="!bg-indigo-600 !rounded-xl !px-6 !py-2.5 !normal-case !font-semibold !shadow-lg !shadow-indigo-500/20"
                >
                    Upgrade to Scale
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Usage Detail */}
                <Card className="lg:col-span-2 !border-none !shadow-sm !rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                        <h3 className="font-bold text-xl mb-6">Current Cycle Usage</h3>
                        <div className="space-y-8">
                            {metrics.map((m, i) => {
                                const percent = (m.used / m.limit) * 100;
                                return (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${m.color} text-white`}><m.icon size={16} /></div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{m.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-500">
                                                {m.used}{m.unit} / {m.limit}{m.unit}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${m.color} transition-all duration-1000`} 
                                                style={{ width: `${Math.min(percent, 100)}%` }} 
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                {percent >= 100 ? 'Quota Exceeded' : `${Math.round(percent)}% Consumed`}
                                            </span>
                                            {percent > 80 && (
                                                <span className="text-[10px] text-pink-500 font-bold flex items-center gap-1">
                                                    Action Required <ArrowUpRight size={10} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <ShieldCheck size={16} className="text-indigo-500" /> 
                            Consumption resets in <span className="text-slate-800 font-bold">12 days</span>
                        </div>
                        <Button className="!normal-case !font-bold !text-indigo-600">Download Detailed Report</Button>
                    </div>
                </Card>

                {/* Billing Summary */}
                <div className="space-y-6">
                    <Card className="!border-none !shadow-lg !shadow-indigo-500/10 !rounded-3xl bg-indigo-600 text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                         <CardContent className="p-8 relative">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-white/20 rounded-2xl"><CreditCard size={28} /></div>
                                <Chip label="Enterprise" size="small" className="!bg-white/20 !text-white !font-bold" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Scale Plan</h3>
                            <p className="text-indigo-100 text-sm mb-6">Unlimited throughput & Priority support.</p>
                            
                            <div className="text-4xl font-bold mb-8 flex items-baseline gap-1">
                                $499 <span className="text-lg font-medium text-indigo-200">/mo</span>
                            </div>

                            <Divider className="!border-white/10 !mb-6" />
                            
                            <div className="space-y-3 mb-8">
                                {[
                                    '99.9% Uptime SLA',
                                    'Custom Domain Branding',
                                    'Advanced RBAC Support',
                                    '24/7 Dedicated Support'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-indigo-100">
                                        <CheckCircle2 size={14} className="text-indigo-300" /> {feature}
                                    </div>
                                ))}
                            </div>

                            <Button fullWidth variant="contained" className="!bg-white !text-indigo-600 !rounded-xl !py-3 !font-bold !normal-case hover:!bg-indigo-50">
                                Manager Subscription
                            </Button>
                         </CardContent>
                    </Card>

                    <Card className="!border-none !shadow-sm !rounded-3xl">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Payment Methods</h3>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">💳</div>
                                    <div>
                                        <p className="text-sm font-bold truncate">•••• •••• •••• 4242</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Expires 04/28</p>
                                    </div>
                                </div>
                                <Chip label="Primary" size="small" className="!bg-indigo-50 !text-indigo-600 !text-[8px] !font-bold" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UsageBilling;
