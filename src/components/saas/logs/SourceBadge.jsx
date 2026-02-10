import React from 'react';
import { Cpu, User, Key, Zap, Share2 } from 'lucide-react';

const SourceBadge = ({ source }) => {
    const config = {
        system: { label: 'System', icon: Cpu, color: 'text-slate-500 bg-slate-100' },
        user: { label: 'User', icon: User, color: 'text-blue-600 bg-blue-50' },
        api_key: { label: 'API Key', icon: Key, color: 'text-indigo-600 bg-indigo-50' },
        runtime: { label: 'Runtime', icon: Zap, color: 'text-amber-600 bg-amber-50' },
        integration: { label: 'Integration', icon: Share2, color: 'text-emerald-600 bg-emerald-50' }
    };

    const { label, icon: Icon, color } = config[source] || config.system;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold ${color}`}>
            <Icon size={12} />
            {label}
        </div>
    );
};

export default SourceBadge;
