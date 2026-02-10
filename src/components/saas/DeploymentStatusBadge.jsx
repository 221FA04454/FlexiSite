import React from 'react';
import { Chip } from '@mui/material';
import { Rocket, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DEPLOY_STATUS } from '../../store/saas/deploymentStore';

const DeploymentStatusBadge = ({ status }) => {
    switch (status) {
        case DEPLOY_STATUS.SUCCESS:
            return (
                <Chip 
                    icon={<CheckCircle2 size={14} className="text-emerald-600" />} 
                    label="Live" 
                    size="small" 
                    className="!bg-emerald-50 !text-emerald-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case DEPLOY_STATUS.BUILDING:
            return (
                <Chip 
                    icon={<Loader2 size={14} className="text-indigo-600 animate-spin" />} 
                    label="Building" 
                    size="small" 
                    className="!bg-indigo-50 !text-indigo-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case DEPLOY_STATUS.PENDING:
            return (
                <Chip 
                    icon={<Clock size={14} className="text-slate-500" />} 
                    label="Queued" 
                    size="small" 
                    className="!bg-slate-100 !text-slate-600 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case DEPLOY_STATUS.FAILED:
            return (
                <Chip 
                    icon={<AlertCircle size={14} className="text-red-600" />} 
                    label="Failed" 
                    size="small" 
                    className="!bg-red-50 !text-red-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        default:
            return null;
    }
};

export default DeploymentStatusBadge;
