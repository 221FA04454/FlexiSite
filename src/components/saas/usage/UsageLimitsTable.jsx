import React from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const UsageLimitsTable = ({ usage, plan }) => {
    const limits = [
        { resource: 'Project Sites', key: 'projectsCreated', limitKey: 'sites', desc: 'Total number of websites in the workspace' },
        { resource: 'Pages per Site', key: 'pagesCreated', limitKey: 'pagesPerSite', desc: 'Max pages allowed in a single project' },
        { resource: 'Build Frequency', key: 'buildsTriggered', limitKey: 'buildsPerMonth', desc: 'Successful production publishes per month' },
        { resource: 'Analytics Volume', key: 'analyticsEvents', limitKey: 'analyticsEventsPerMonth', desc: 'Total tracked user interaction events' },
        { resource: 'Cloud Storage', key: 'storageUsedMB', limitKey: 'storageMB', desc: 'Assets, images, and static file capacity' },
        { resource: 'Custom Domains', key: 'domainsConnected', limitKey: 'domains', desc: 'Connected edge-network custom hostnames' },
        { resource: 'Team Seats', key: 'membersInvited', limitKey: 'members', desc: 'Active workspace collaborators' },
        { resource: 'API Infrastructure', key: 'apiKeysCreated', limitKey: 'apiKeys', desc: 'Active secure authentication keys' }
    ];

    return (
        <TableContainer component={Paper} className="!border-none !shadow-sm !rounded-[2.5rem] !bg-white dark:!bg-slate-900 overflow-hidden">
            <Table>
                <TableHead className="!bg-slate-50 dark:!bg-slate-800/50">
                    <TableRow>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest !py-6 !pl-8">Resource Vector</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Active Usage</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Plan Entitlement</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Compliance</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest text-right !pr-8">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {limits.map((row) => {
                        const current = usage[row.key] || 0;
                        const limit = plan.limits[row.limitKey];
                        const percent = (current / limit) * 100;
                        
                        let status = { label: 'Compliant', color: 'emerald', icon: <CheckCircle2 size={14} /> };
                        if (percent >= 100) status = { label: 'Locked', color: 'pink', icon: <XCircle size={14} /> };
                        else if (percent >= 80) status = { label: 'Pressure', color: 'amber', icon: <AlertCircle size={14} /> };

                        return (
                            <TableRow key={row.key} className="hover:!bg-slate-50/50 dark:hover:!bg-slate-800/20 transition-colors">
                                <TableCell className="!py-5 !pl-8">
                                    <p className="font-black text-slate-900 dark:text-white">{row.resource}</p>
                                    <p className="text-[11px] text-slate-400 font-medium">{row.desc}</p>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{current.toLocaleString()}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-sm font-black text-slate-900 dark:text-white">{limit.toLocaleString()}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-${status.color}-500 transition-all`}
                                            style={{ width: `${Math.min(100, percent)}%` }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right !pr-8">
                                    <Chip 
                                        icon={status.icon}
                                        label={status.label} 
                                        size="small"
                                        className={`!bg-${status.color}-50 !text-${status.color}-700 !font-black !uppercase !text-[10px] !tracking-tighter !py-1 !px-2`}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsageLimitsTable;
