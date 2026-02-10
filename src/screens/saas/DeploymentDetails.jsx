import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Button, Card, CardContent, Divider, 
    IconButton, Grid, Chip, Alert
} from '@mui/material';
import { 
    ArrowLeft, Download, RotateCcw, Monitor,
    HardDrive, Clock, ShieldCheck, Zap,
    Cpu, Activity, Globe, Terminal, ExternalLink
} from 'lucide-react';
import { useDeploymentStore, DEPLOY_STATUS } from '../../store/saas/deploymentStore';
import DeploymentStatusBadge from '../../components/saas/DeploymentStatusBadge';
import DeploymentLogsViewer from '../../components/saas/DeploymentLogsViewer';

const DeploymentDetails = () => {
    const { deploymentId } = useParams();
    const navigate = useNavigate();
    const { deployments } = useDeploymentStore();

    // Finding deployment across project keys (in a real app, we'd have a lookup)
    const projectId = 'proj_1';
    const deployment = deployments[projectId]?.find(d => d.id === deploymentId);

    if (!deployment) return <div className="p-20 text-center font-bold text-red-500">Deployment artifact not found.</div>;

    const isSuccess = deployment.status === DEPLOY_STATUS.SUCCESS;

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <IconButton onClick={() => window.history.back()} className="!bg-white dark:!bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                        <ArrowLeft size={20} />
                    </IconButton>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Build {deployment.version}</h1>
                            <DeploymentStatusBadge status={deployment.status} />
                        </div>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><Globe size={14} /> Global Edge</span>
                            <span className="flex items-center gap-1.5"><Cpu size={14} /> Worker: worker-prod-02</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outlined"
                        startIcon={<Download size={18} />}
                        className="!border-slate-200 !text-slate-600 !font-bold !rounded-2xl !px-6 !normal-case h-12"
                    >
                        Download Build
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={isSuccess ? <ExternalLink size={18} /> : <RotateCcw size={18} />}
                        className={`!font-bold !px-8 !rounded-2xl !normal-case shadow-xl ${isSuccess ? '!bg-slate-900' : '!bg-indigo-600'}`}
                    >
                        {isSuccess ? 'View Live Site' : 'Restart Build'}
                    </Button>
                </div>
            </div>

            <Grid container spacing={4}>
                {/* Statistics & Overview */}
                <Grid item xs={12} lg={4} className="space-y-6">
                    <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Technical Summary</h3>
                            
                            <div className="space-y-4">
                                {[
                                    { label: 'Artifact Size', val: `${(deployment.buildSize / 1024).toFixed(2)} MB`, icon: HardDrive },
                                    { label: 'Build Duration', val: '14.2s', icon: Clock },
                                    { label: 'Triggered By', val: deployment.triggeredBy.toUpperCase(), icon: Monitor },
                                    { label: 'Compression', val: 'Gzip (85%)', icon: Activity }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <item.icon size={16} />
                                            <span className="text-xs font-bold">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">{item.val}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Alert severity="success" icon={<ShieldCheck />} className="!rounded-2xl !bg-emerald-50 !text-emerald-800 !border-0 text-xs font-medium">
                                    Integrity check passed. File hashes match origin.
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="!border-none !shadow-sm !rounded-3xl bg-indigo-600 text-white overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Rocket size={120} />
                         </div>
                         <CardContent className="p-8 space-y-4">
                             <h3 className="text-xl font-black">Edge Sync Status</h3>
                             <p className="text-indigo-100/80 text-sm">Successfully synced across all 24 global regions.</p>
                             
                             <div className="space-y-3 pt-4">
                                 {['North America', 'Europe', 'Asia Pacific'].map(region => (
                                     <div key={region} className="flex justify-between items-center">
                                         <span className="text-xs font-bold">{region}</span>
                                         <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Active</span>
                                     </div>
                                 ))}
                             </div>
                         </CardContent>
                    </Card>
                </Grid>

                {/* Build Logs */}
                <Grid item xs={12} lg={8}>
                    <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden h-full flex flex-col">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-900 text-white rounded-xl"><Terminal size={18} /></div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Standard Output (stdout)</h3>
                            </div>
                            <Button size="small" className="!normal-case !font-bold !text-slate-400">Clear Terminal</Button>
                        </div>
                        <CardContent className="!p-0 flex-1 overflow-hidden">
                            <DeploymentLogsViewer logs={deployment.logs} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default DeploymentDetails;
