import React from 'react';
import { Card, CardContent, IconButton, Tooltip, Button } from '@mui/material';
import { 
    ExternalLink, Settings, Globe, CheckCircle2, 
    AlertCircle, Clock, Trash2 
} from 'lucide-react';
import SSLStatusBadge from './SSLStatusBadge';
import DomainHealthBadge from './DomainHealthBadge';
import { DOMAIN_STATUS } from '../../store/saas/domainStore';

const DomainCard = ({ domain, onManage, onDelete }) => {
    const isVerified = domain.dnsStatus === DOMAIN_STATUS.VERIFIED;
    
    return (
        <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isVerified ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-400'}`}>
                            <Globe size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                    {domain.domainName}
                                </h3>
                                {domain.isPrimary && (
                                    <div className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest border border-indigo-100">
                                        Primary
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {isVerified ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                    {isVerified ? 'DNS Verified' : 'Checking DNS...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Tooltip title="Open live site">
                            <IconButton 
                                size="small" 
                                component="a" 
                                href={`https://${domain.domainName}`} 
                                target="_blank"
                                className="!text-slate-400 hover:!text-indigo-600 hover:!bg-indigo-50"
                            >
                                <ExternalLink size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove domain">
                            <IconButton size="small" onClick={onDelete} className="!text-slate-300 hover:!text-red-500 hover:!bg-red-50">
                                <Trash2 size={18} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 mb-6 flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Mapped Project</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-none">
                            {domain.lastDeploymentVersion ? `Production (${domain.lastDeploymentVersion})` : 'Awaiting Deployment'}
                        </p>
                    </div>
                    <DomainHealthBadge status={domain.health} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                    <SSLStatusBadge status={domain.sslStatus} />
                    <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<Settings size={14} />}
                        onClick={onManage}
                        className="!bg-slate-900 dark:!bg-white dark:!text-slate-900 !text-white !font-bold !rounded-xl !px-4 !py-1.5 !normal-case !text-xs shadow-md"
                    >
                        Manage
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default DomainCard;
