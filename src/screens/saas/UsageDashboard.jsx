import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { 
    Zap, RefreshCw, Download, 
    ArrowUpCircle, Info, Activity, 
    Layers, LineChart as ChartIcon
} from 'lucide-react';
import { useUsageStore } from '../../store/saas/usageStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';

import UsageSummaryCards from '../../components/saas/usage/UsageSummaryCards';
import UsageProgressBars from '../../components/saas/usage/UsageProgressBars';
import UsageLimitsTable from '../../components/saas/usage/UsageLimitsTable';
import PlanInfoCard from '../../components/saas/usage/PlanInfoCard';
import UpgradePlanModal from '../../components/saas/usage/UpgradePlanModal';

const UsageDashboard = () => {
    const { activeTenantId } = useTenantStore();
    const { 
        getTenantUsage, getTenantPlan, upgradePlan, 
        loading, initTenantUsage 
    } = useUsageStore();

    const [showUpgrade, setShowUpgrade] = useState(false);
    const canManageBilling = usePermission('billing');

    useEffect(() => {
        if (activeTenantId) {
            initTenantUsage(activeTenantId);
        }
    }, [activeTenantId]);

    const usage = getTenantUsage(activeTenantId);
    const plan = getTenantPlan(activeTenantId);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <CircularProgress className="!text-indigo-600" />
                <p className="text-slate-400 font-bold animate-pulse">Syncing Resource Quotas...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:row justify-between lg:flex-row lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Infrastructure Usage</h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor your workspace resource vectors and capacity entitlements.</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outlined"
                        startIcon={<Download size={18} />}
                        className="!border-slate-200 !text-slate-600 !font-bold !rounded-2xl !px-6 !normal-case h-12"
                    >
                        Usage Report
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<ArrowUpCircle size={20} />}
                        onClick={() => setShowUpgrade(true)}
                        className="!bg-indigo-600 !text-white !font-black !px-8 !py-3 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20"
                    >
                        Expedite Scale
                    </Button>
                </div>
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} xl={8} className="space-y-8">
                    <UsageSummaryCards usage={usage} plan={plan} />
                    <UsageProgressBars usage={usage} plan={plan} />
                </Grid>
                <Grid item xs={12} xl={4}>
                    <PlanInfoCard plan={plan} onUpgrade={() => setShowUpgrade(true)} />
                </Grid>
            </Grid>

            {/* Detailed Table */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <Activity size={22} className="text-indigo-600" />
                        Granular Entitlements
                    </h3>
                    <div className="flex gap-2">
                        <Tooltip title="Refresh usage data from edge">
                            <IconButton size="small"><RefreshCw size={18} className="text-slate-400" /></IconButton>
                        </Tooltip>
                    </div>
                </div>
                <UsageLimitsTable usage={usage} plan={plan} />
            </div>

            {/* Trial / Notification Banner */}
            {plan.id === 'free' && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-indigo-500/20">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                            <Zap size={32} className="text-indigo-200" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black tracking-tight">Unleash Full Potential</h4>
                            <p className="text-indigo-100/70 font-medium">Upgrade to Pro to unlock 50 builds/mo, 100k analytics, and custom domain SSL orchestration.</p>
                        </div>
                    </div>
                    <Button 
                        variant="contained"
                        onClick={() => setShowUpgrade(true)}
                        className="!bg-white !text-indigo-600 !rounded-2xl !px-10 !py-4 !font-black !normal-case !text-lg hover:!bg-indigo-50 whitespace-nowrap"
                    >
                        Unlock Pro Features
                    </Button>
                </div>
            )}

            <UpgradePlanModal 
                open={showUpgrade} 
                onClose={() => setShowUpgrade(false)} 
                currentPlanId={plan.id}
                onUpgrade={(newPlanId) => {
                    upgradePlan(activeTenantId, newPlanId);
                    setShowUpgrade(false);
                }}
            />
        </div>
    );
};

export default UsageDashboard;
