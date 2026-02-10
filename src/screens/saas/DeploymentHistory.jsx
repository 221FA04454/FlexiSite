import React, { useState, useEffect } from 'react';
import { 
    Button, Grid, Box, CircularProgress, 
    Typography, IconButton, Tooltip, Alert
} from '@mui/material';
import { 
    Rocket, Plus, Search, Filter, 
    Activity, HardDrive, Cpu, Terminal,
    Download, RefreshCw, Layers
} from 'lucide-react';
import { useDeploymentStore, DEPLOY_STATUS } from '../../store/saas/deploymentStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';
import { useNavigate } from 'react-router-dom';
import { useLogStore } from '../../store/saas/logStore';
import { useUsageStore } from '../../store/saas/usageStore';
import LimitWarningModal from '../../components/saas/usage/LimitWarningModal';
import UpgradePlanModal from '../../components/saas/usage/UpgradePlanModal';
import DeploymentCard from '../../components/saas/DeploymentCard';
import TriggerDeploymentModal from '../../components/saas/TriggerDeploymentModal';
import RollbackModal from '../../components/saas/RollbackModal';
import DeploymentLogsViewer from '../../components/saas/DeploymentLogsViewer';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const DeploymentHistory = () => {
    const { activeTenantId } = useTenantStore();
    const { deployments, fetchDeployments, rollbackDeployment, loading } = useDeploymentStore();
    const { addLog } = useLogStore();
    const { checkLimit, getTenantPlan } = useUsageStore();
    const [showTrigger, setShowTrigger] = useState(false);
    const [showLimitWarning, setShowLimitWarning] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [rollbackTarget, setRollbackTarget] = useState(null);
    const [viewLogsDep, setViewLogsDep] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const projectId = 'proj_1'; // Assuming corporate site for demo
    const canDeploy = usePermission('publish');

    useEffect(() => {
        if (projectId) fetchDeployments(projectId);
    }, [projectId]);

    const projectDeps = deployments[projectId] || [];
    const filteredDeps = projectDeps.filter(d => 
        d.version.toLowerCase().includes(search.toLowerCase()) ||
        d.status.toLowerCase().includes(search.toLowerCase())
    );

    if (loading && projectDeps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <CircularProgress className="!text-indigo-600" />
                <p className="text-slate-400 font-bold animate-pulse">Syncing Build History...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Deployment Pipeline</h1>
                    <p className="text-slate-500 font-medium mt-1">Immutable build history, instant rollbacks, and CDN orchestration.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                        variant="outlined"
                        startIcon={<Layers size={18} />}
                        className="!border-slate-200 !text-slate-600 !font-bold !rounded-2xl !px-6 !normal-case h-12"
                    >
                        Build Artifacts
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Rocket size={20} />}
                        onClick={() => {
                            const check = checkLimit(activeTenantId, 'buildsTriggered');
                            if (check.allowed) {
                                setShowTrigger(true);
                            } else {
                                setShowLimitWarning(true);
                            }
                        }}
                        disabled={!canDeploy}
                        className="!bg-indigo-600 !text-white !font-black !px-8 !py-3 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20 flex-1 md:flex-none"
                    >
                        Publish Production
                    </Button>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Builds', val: projectDeps.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Build Success', val: '98.5%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg Build Time', val: '14.2s', icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Storage Used', val: '1.2 GB', icon: HardDrive, color: 'text-slate-600', bg: 'bg-slate-50' }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm">
                        <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white mt-1 leading-none">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

             {/* Search & Filter */}
             <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search deployments by version..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <Button variant="outlined" className="!rounded-2xl !border-slate-200 !text-slate-600 !font-bold !normal-case !px-6 h-12">
                    <Filter size={18} className="mr-2" /> Filter
                </Button>
            </div>

            {/* Deployment List */}
            {filteredDeps.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredDeps.map((dep, i) => (
                        <Grid item xs={12} key={dep.id}>
                            <DeploymentCard 
                                deployment={dep} 
                                isLive={i === projectDeps.findIndex(d => d.status === DEPLOY_STATUS.SUCCESS)}
                                onLogs={() => setViewLogsDep(dep)}
                                onRollback={() => setRollbackTarget(dep)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6">
                        <Rocket size={48} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Deployments Found</h3>
                    <p className="text-slate-500 max-w-xs text-center mt-2">Scale your project to the global edge network by triggering your first production build.</p>
                    <Button 
                        onClick={() => setShowTrigger(true)} 
                        className="mt-6 !text-indigo-600 !font-black hover:!bg-indigo-50 !px-8 !py-2 !rounded-xl"
                    >
                        Publish Your Project
                    </Button>
                </Box>
            )}

            {/* Modals */}
            <TriggerDeploymentModal 
                open={showTrigger} 
                onClose={() => setShowTrigger(false)} 
                projectId={projectId}
                tenantId={activeTenantId}
            />

            <RollbackModal 
                open={!!rollbackTarget}
                onClose={() => setRollbackTarget(null)}
                targetVersion={rollbackTarget?.version}
                onConfirm={() => {
                    rollbackDeployment(projectId, rollbackTarget?.id);
                    addLog(activeTenantId, {
                        source: 'user',
                        type: 'deployment',
                        title: `Instant Rollback: ${rollbackTarget?.version}`,
                        description: `User triggered an immediate rollback to version ${rollbackTarget?.version} for project ${projectId}.`,
                        metadata: { projectId, version: rollbackTarget?.version, deploymentId: rollbackTarget?.id }
                    });
                }}
            />

            <Dialog 
                open={!!viewLogsDep} 
                onClose={() => setViewLogsDep(null)}
                PaperProps={{ className: '!rounded-3xl !max-w-3xl !w-full' }}
            >
                <DialogTitle className="!font-black text-xl flex justify-between items-center">
                    <span>Build Logs: {viewLogsDep?.version}</span>
                    <Button 
                        startIcon={<Download size={14} />}
                        className="!text-slate-500 !normal-case !font-bold"
                    >
                        Raw Log
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <DeploymentLogsViewer logs={viewLogsDep?.logs} />
                    <p className="text-[10px] text-slate-400 mt-4 text-center font-bold tracking-widest uppercase">
                        FlexiSite Build Worker Node: f81d4fae-7dec-11d0
                    </p>
                </DialogContent>
            </Dialog>

            <LimitWarningModal 
                open={showLimitWarning}
                onClose={() => setShowLimitWarning(false)}
                onUpgrade={() => {
                    setShowLimitWarning(false);
                    setShowUpgradeModal(true);
                }}
                resourceName="Monthly Builds"
                limitValue={getTenantPlan(activeTenantId).limits.buildsPerMonth}
            />

            <UpgradePlanModal 
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                currentPlanId={getTenantPlan(activeTenantId).id}
                onUpgrade={(planId) => {
                    // upgrade logic would be handled by a more global store usually,
                    // but for this demo we call it here.
                    setShowUpgradeModal(false);
                }}
            />
        </div>
    );
};

export default DeploymentHistory;
