import React from 'react';
import { Chip } from '@mui/material';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { SSL_STATUS } from '../../store/saas/domainStore';

const SSLStatusBadge = ({ status }) => {
    switch (status) {
        case SSL_STATUS.ACTIVE:
            return (
                <Chip 
                    icon={<ShieldCheck size={14} className="text-emerald-600" />} 
                    label="SSL Active" 
                    size="small" 
                    className="!bg-emerald-50 !text-emerald-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case SSL_STATUS.PENDING:
            return (
                <Chip 
                    icon={<Shield size={14} className="text-amber-600 animate-pulse" />} 
                    label="Provisioning" 
                    size="small" 
                    className="!bg-amber-50 !text-amber-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case SSL_STATUS.ERROR:
            return (
                <Chip 
                    icon={<ShieldAlert size={14} className="text-red-600" />} 
                    label="SSL Error" 
                    size="small" 
                    className="!bg-red-50 !text-red-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        default:
            return null;
    }
};

export default SSLStatusBadge;
