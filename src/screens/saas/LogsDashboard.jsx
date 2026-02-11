import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Button, CircularProgress, 
    Typography, IconButton, Tooltip 
} from '@mui/material';
import { 
    Activity, ShieldCheck, Download, 
    RefreshCw, Layers, Terminal, AlertCircle
} from 'lucide-react';
import { useLogStore } from '../../store/saas/logStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';

import LogFilters from '../../components/saas/logs/LogFilters';
import LogListTable from '../../components/saas/logs/LogListTable';

import LogDetailsDrawer from '../../components/saas/logs/LogDetailsDrawer';
import DeleteLogModal from '../../components/saas/logs/DeleteLogModal';
import ExportLogsButton from '../../components/saas/logs/ExportLogsButton';
import LiveLogToggle from '../../components/saas/logs/LiveLogToggle';

const LogsDashboard = () => {
    const { activeTenantId } = useTenantStore();
    const { 
        logs, filters, search, fetchLogs, 
        deleteLog, loading, selectedLogId, setSelectedLog 
    } = useLogStore();
    

    const [deleteQueued, setDeleteQueued] = useState(null);

    // Permission check
    const canViewLogs = usePermission('analytics');
    const canDeleteLogs = usePermission('billing'); // Typically owners/admins

    useEffect(() => {
        if (activeTenantId) fetchLogs(activeTenantId);
    }, [activeTenantId, fetchLogs]);

    // Filtering Logic
    const tenantLogs = logs[activeTenantId] || [];
    const filteredLogs = tenantLogs.filter(log => {
        const matchesSearch = log.title.toLowerCase().includes(search.toLowerCase()) || 
                             log.description.toLowerCase().includes(search.toLowerCase());
        const matchesType = filters.type === 'all' || log.type === filters.type;
        const matchesSource = filters.source === 'all' || log.source === filters.source;
        return matchesSearch && matchesType && matchesSource;
    });

    if (!canViewLogs) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
                <p className="text-slate-500 max-w-sm mt-2">Only Workspace Administrators can access the secure audit infrastructure and system event logs.</p>
            </div>
        );
    }

    const selectedLog = tenantLogs.find(l => l.id === selectedLogId);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Infrastructure Logs</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time audit trail for deployments, security events, and multi-tenant operations.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <LiveLogToggle />
                    <ExportLogsButton />
                    <Button 
                        variant="contained" 
                        startIcon={<RefreshCw size={18} className={loading ? 'animate-spin' : ''} />}
                        onClick={() => fetchLogs(activeTenantId)}
                        className="!bg-indigo-600 !text-white !font-black !px-8 !py-3 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20"
                    >
                        Force Sync
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Event Velocity', val: '24/hr', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Security Alerts', val: tenantLogs.filter(l => l.type === 'security').length, icon: ShieldCheck, color: 'text-pink-600', bg: 'bg-pink-50' },
                    { label: 'Active Builds', val: '1', icon: Terminal, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Audit Status', val: 'Verified', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' }
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

            <LogFilters />

            {/* Log Content */}
            {loading && filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <CircularProgress className="!text-indigo-600" />
                    <p className="text-slate-400 font-black animate-pulse uppercase tracking-[0.2em] text-xs">Deciphering Immutable Audit Logs...</p>
                </div>
            ) : filteredLogs.length > 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden">
                    <LogListTable 
                        logs={filteredLogs} 
                        onSelect={setSelectedLog} 
                        onDelete={(id) => canDeleteLogs ? setDeleteQueued(id) : alert('Insufficient permissions to delete audit records.')} 
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="p-8 bg-white dark:bg-slate-800 rounded-full shadow-2xl mb-8">
                        <Terminal size={64} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">Empty Audit Trail</h3>
                    <p className="text-slate-500 max-w-sm text-center mt-2 font-medium">No system events matched your current filters. Try expanding your search or frequency.</p>
                    <Button 
                        onClick={() => fetchLogs(activeTenantId)} 
                        className="mt-8 !text-indigo-600 !font-black hover:!bg-indigo-50 !px-10 !py-3 !rounded-2xl border-2 border-indigo-100"
                    >
                        Refresh Pipeline
                    </Button>
                </div>
            )}

            {/* Drawers and Modals */}
            <LogDetailsDrawer 
                log={selectedLog} 
                open={!!selectedLog} 
                onClose={() => setSelectedLog(null)}
                onDelete={(id) => {
                    setSelectedLog(null);
                    setDeleteQueued(id);
                }}
            />

            {deleteQueued && (
                <DeleteLogModal 
                    open={!!deleteQueued}
                    onClose={() => setDeleteQueued(null)}
                    onConfirm={() => {
                        deleteLog(activeTenantId, deleteQueued);
                        setDeleteQueued(null);
                    }}
                    logId={deleteQueued}
                />
            )}
        </div>
    );
};

export default LogsDashboard;
