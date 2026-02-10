import React from 'react';
import { Chip } from '@mui/material';

const PermissionTag = ({ permission }) => {
    const getColor = (p) => {
        if (p.includes('publish') || p.includes('manage')) return '!bg-indigo-50 !text-indigo-600';
        if (p.includes('read')) return '!bg-emerald-50 !text-emerald-600';
        if (p.includes('write')) return '!bg-amber-50 !text-amber-600';
        return '!bg-slate-50 !text-slate-600';
    };

    return (
        <Chip 
            label={permission.replace('_', ' ')} 
            size="small" 
            className={`!text-[10px] !font-bold !uppercase !rounded-lg border !border-current/10 ${getColor(permission)}`} 
        />
    );
};

export default PermissionTag;
