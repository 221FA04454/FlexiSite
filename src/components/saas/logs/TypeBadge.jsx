import React from 'react';
import { 
    Info, AlertTriangle, XCircle, ShieldAlert, 
    Rocket, Globe, Activity, Share2, Users 
} from 'lucide-react';

const TypeBadge = ({ type }) => {
    const config = {
        info: { color: '!bg-blue-50 !text-blue-700 !border-blue-100', icon: Info },
        warn: { color: '!bg-amber-50 !text-amber-700 !border-amber-100', icon: AlertTriangle },
        error: { color: '!bg-pink-50 !text-pink-700 !border-pink-100', icon: XCircle },
        security: { color: '!bg-indigo-600 !text-white !border-indigo-700', icon: ShieldAlert },
        deployment: { color: '!bg-emerald-50 !text-emerald-700 !border-emerald-100', icon: Rocket },
        domain: { color: '!bg-sky-50 !text-sky-700 !border-sky-100', icon: Globe },
        analytics: { color: '!bg-violet-50 !text-violet-700 !border-violet-100', icon: Activity },
        integration: { color: '!bg-orange-50 !text-orange-700 !border-orange-100', icon: Share2 },
        tenant: { color: '!bg-slate-900 !text-white !border-slate-800', icon: Users }
    };

    const { color, icon: Icon } = config[type] || config.info;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${color}`}>
            <Icon size={12} />
            {type}
        </span>
    );
};

export default TypeBadge;
