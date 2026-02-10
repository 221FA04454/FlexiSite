import React from 'react';
import { 
    Drawer, Box, Typography, IconButton, 
    Button, Divider, Chip 
} from '@mui/material';
import { X, Download, Trash2, Cpu, User, Calendar, Tag, ShieldCheck, Code } from 'lucide-react';
import TypeBadge from './TypeBadge';
import SourceBadge from './SourceBadge';
import TimestampBadge from './TimestampBadge';

const LogDetailsDrawer = ({ log, open, onClose, onDelete }) => {
    if (!log) return null;

    return (
        <Drawer 
            anchor="right" 
            open={open} 
            onClose={onClose}
            PaperProps={{ className: '!w-full !max-w-xl !border-none !shadow-2xl' }}
        >
            <div className="h-full flex flex-col bg-white dark:bg-slate-900">
                {/* Header */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <TypeBadge type={log.type} />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">{log.title}</h2>
                        <TimestampBadge timestamp={log.createdAt} />
                    </div>
                    <IconButton onClick={onClose} className="!bg-white dark:!bg-slate-800 shadow-sm"><X size={20} /></IconButton>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4 border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {log.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin Source</p>
                                <SourceBadge source={log.source} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User / Identity</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <User size={14} className="text-indigo-600" />
                                    {log.userId || 'System Process'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Explorer */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Code size={18} className="text-indigo-600" />
                                Extended Metadata
                            </h3>
                            <Button size="small" startIcon={<Download size={14} />} className="!text-slate-500 !font-bold !normal-case">Copy JSON</Button>
                        </div>
                        <div className="bg-slate-950 rounded-2xl p-6 overflow-hidden shadow-inner">
                            <pre className="text-indigo-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Internal IDs for compliance */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-2xl flex gap-3">
                        <ShieldCheck className="text-amber-600 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest">Audit Verification</p>
                            <p className="text-[11px] text-amber-800 dark:text-amber-500 font-medium mt-1">
                                Log verified on Immutable Core Network. Trace ID: <span className="font-mono bg-amber-200/50 dark:bg-amber-800/30 px-1 rounded">{log.id}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-800 flex gap-3 bg-white dark:bg-slate-900">
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        color="error"
                        startIcon={<Trash2 size={18} />}
                        onClick={() => onDelete(log.id)}
                        className="!rounded-xl !py-3 !font-bold !normal-case"
                    >
                        Delete Log Entry
                    </Button>
                    <Button 
                        fullWidth 
                        variant="contained"
                        className="!bg-slate-900 dark:!bg-white dark:!text-slate-900 !rounded-xl !py-3 !font-bold !normal-case"
                        onClick={onClose}
                    >
                        Close Details
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default LogDetailsDrawer;
