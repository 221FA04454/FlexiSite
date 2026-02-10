import React from 'react';
import { HEALTH_STATUS } from '../../store/saas/domainStore';

const DomainHealthBadge = ({ status }) => {
    const isOnline = status === HEALTH_STATUS.ONLINE;
    
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-600' : 'text-red-600'}`}>
                {isOnline ? 'Edge Online' : 'Node Offline'}
            </span>
        </div>
    );
};

export default DomainHealthBadge;
