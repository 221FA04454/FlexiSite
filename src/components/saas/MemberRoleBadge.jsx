import React from 'react';
import { Chip } from '@mui/material';
import { Shield, ShieldAlert, User, PenTool } from 'lucide-react';
import { ROLES } from '../../store/saas/tenantStore';

const MemberRoleBadge = ({ role }) => {
    switch (role) {
        case ROLES.OWNER:
            return (
                <Chip 
                    icon={<ShieldAlert size={14} className="text-pink-600" />} 
                    label="Owner" 
                    size="small" 
                    className="!bg-pink-50 !text-pink-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case ROLES.ADMIN:
            return (
                <Chip 
                    icon={<Shield size={14} className="text-indigo-600" />} 
                    label="Admin" 
                    size="small" 
                    className="!bg-indigo-50 !text-indigo-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        case ROLES.EDITOR:
            return (
                <Chip 
                    icon={<PenTool size={14} className="text-emerald-600" />} 
                    label="Editor" 
                    size="small" 
                    className="!bg-emerald-50 !text-emerald-700 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
        default:
            return (
                <Chip 
                    icon={<User size={14} className="text-slate-500" />} 
                    label="Viewer" 
                    size="small" 
                    className="!bg-slate-100 !text-slate-600 !font-bold !text-[10px] uppercase tracking-tighter" 
                />
            );
    }
};

export default MemberRoleBadge;
