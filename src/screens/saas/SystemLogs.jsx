import React, { useState } from 'react';
import { useLogStore } from '../../store/saas/logStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { 
    Card, CardContent, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton,
    TextField, Dialog, DialogTitle, DialogContent, Button
} from '@mui/material';
import { 
    Search, Filter, Clock, AlertCircle, Info, 
    ShieldAlert, Zap, Globe, MoreHorizontal, Rocket 
} from 'lucide-react';
import { usePermission } from '../../hooks/usePermission';

const SystemLogs = () => {
    const { activeTenantId } = useTenantStore();
    const { logs } = useLogStore();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);
    const canViewLogs = usePermission('analytics');

    if (!canViewLogs) {
        return <div className="p-20 text-center font-bold text-red-500">Access Denied: You do not have permissions to view system logs.</div>;
    }

    const tenantLogs = (logs[activeTenantId] || []).filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || log.type === filter;
        return matchesSearch && matchesFilter;
    });

    const getIcon = (type) => {
        switch(type) {
            case 'publish': return <Rocket size={16} className="text-emerald-500" />;
            case 'api': return <Zap size={16} className="text-amber-500" />;
            case 'security': return <ShieldAlert size={16} className="text-indigo-500" />;
            case 'error': return <AlertCircle size={16} className="text-pink-500" />;
            default: return <Info size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Events & Monitoring</h1>
                    <p className="text-slate-500 mt-1">Audit trail for all publishing, security, and API activities.</p>
                </div>
            </div>

            <Card className="!border-none !shadow-sm !rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Filter by message..." 
                                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 text-sm w-64 shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'publish', 'api', 'security', 'error'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        filter === t 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                        : 'bg-white text-slate-500 hover:bg-slate-100'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow className="bg-slate-50/30">
                                <TableCell className="!font-bold !text-slate-500">Timestamp</TableCell>
                                <TableCell className="!font-bold !text-slate-500">Event Type</TableCell>
                                <TableCell className="!font-bold !text-slate-500">Message</TableCell>
                                <TableCell className="!font-bold !text-slate-500 text-right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tenantLogs.map((log) => (
                                <TableRow key={log.id} hover className="cursor-pointer" onClick={() => setSelectedLog(log)}>
                                    <TableCell className="!py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            icon={getIcon(log.type)}
                                            label={log.type} 
                                            size="small" 
                                            className={`!font-bold !uppercase !text-[10px] ${
                                                log.type === 'error' ? '!bg-pink-50 !text-pink-700' :
                                                log.type === 'publish' ? '!bg-emerald-50 !text-emerald-700' : '!bg-indigo-50 !text-indigo-700'
                                            }`} 
                                        />
                                    </TableCell>
                                    <TableCell className="!font-medium text-slate-700 dark:text-slate-200">
                                        {log.message}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <IconButton size="small"><MoreHorizontal size={16} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Log Detail Dialog */}
            <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} PaperProps={{ className: '!rounded-2xl w-full max-w-md' }}>
                <DialogTitle className="!font-bold flex items-center gap-3">
                    {selectedLog && getIcon(selectedLog.type)}
                    Event Details
                </DialogTitle>
                <DialogContent className="space-y-4 !pt-2">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                            <span className="text-xs text-slate-500 font-bold uppercase">Event ID</span>
                            <span className="text-xs font-mono font-bold">{selectedLog?.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                            <span className="text-xs text-slate-500 font-bold uppercase">Timestamp</span>
                            <span className="text-xs font-mono text-slate-700">{selectedLog && new Date(selectedLog.timestamp).toISOString()}</span>
                        </div>
                        <div className="pt-2">
                            <span className="text-xs text-slate-500 font-bold uppercase block mb-2">Extended Metadata</span>
                            <pre className="text-[10px] bg-slate-950 text-indigo-300 p-3 rounded-lg overflow-x-auto">
                                {JSON.stringify(selectedLog?.details || { status: 'OK', origin: 'API_GATEWAY_V2' }, null, 2)}
                            </pre>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="!p-4 border-t">
                    <Button onClick={() => setSelectedLog(null)} variant="contained" className="!bg-indigo-600 !rounded-lg w-full">Close Logs</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SystemLogs;
