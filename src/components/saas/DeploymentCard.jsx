import React from 'react';
import { Card, CardContent, IconButton, Tooltip, Button, Chip } from '@mui/material';
import { 
    ExternalLink, Terminal, Download, 
    RotateCcw, MoreHorizontal, User, 
    Cpu, HardDrive, Clock
} from 'lucide-react';
import DeploymentStatusBadge from './DeploymentStatusBadge';

const DeploymentCard = ({ deployment, onLogs, onRollback, isLive }) => {
    return (
        <Card className={`!border-none !shadow-sm !rounded-2xl transition-all duration-300 hover:shadow-xl group relative overflow-hidden`}>
            {isLive && (
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            )}
            
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isLive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                            {deployment.triggeredBy === 'api_key' ? <Cpu size={24} /> : <User size={24} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                    {deployment.version}
                                </h3>
                                <DeploymentStatusBadge status={deployment.status} />
                                {isLive && (
                                    <div className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100">
                                        Live Production
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Triggered by {deployment.triggeredBy.replace('_', ' ')} • {new Date(deployment.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Tooltip title="View live artifacts">
                            <IconButton size="small" className="!text-slate-400 hover:!text-indigo-600">
                                <ExternalLink size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download build (ZIP)">
                            <IconButton size="small" className="!text-slate-400 hover:!text-slate-900">
                                <Download size={18} />
                            </IconButton>
                        </Tooltip>
                        <IconButton size="small" className="!text-slate-300">
                            <MoreHorizontal size={18} />
                        </IconButton>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl flex items-center gap-3">
                        <HardDrive size={14} className="text-slate-400" />
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Size</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                                {deployment.buildSize > 0 ? `${(deployment.buildSize / 1024).toFixed(2)} MB` : '--'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl flex items-center gap-3">
                        <Clock size={14} className="text-slate-400" />
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Time</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">14.2s</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl flex items-center gap-2">
                        <Globe size={14} className="text-slate-300 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                            {deployment.meta?.domainId ? 'flexisite.io' : 'No Domain'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                    <Button 
                        startIcon={<Terminal size={14} />}
                        onClick={onLogs}
                        className="!text-slate-500 !text-xs !font-bold !normal-case hover:!bg-slate-50"
                    >
                        Build Logs
                    </Button>
                    
                    {!isLive && deployment.status === 'success' && (
                        <Button 
                            variant="outlined"
                            size="small"
                            startIcon={<RotateCcw size={14} />}
                            onClick={onRollback}
                            className="!border-amber-200 !text-amber-600 !font-bold !rounded-xl !px-4 !py-1.5 !normal-case !text-xs"
                        >
                            Rollback
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Mock Globe icon for inline use
import { Globe } from 'lucide-react';

export default DeploymentCard;
