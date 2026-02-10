import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { Activity, Radio } from 'lucide-react';

const LiveLogToggle = () => {
    const [isLive, setIsLive] = useState(false);

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all border ${isLive ? 'bg-emerald-50 border-emerald-100 ring-4 ring-emerald-500/5' : 'bg-slate-50 border-slate-100'}`}>
            <div className={`relative flex items-center justify-center ${isLive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isLive ? <Radio size={18} className="animate-pulse" /> : <Activity size={18} />}
                {isLive && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />}
            </div>
            
            <span className={`text-xs font-black uppercase tracking-widest ${isLive ? 'text-emerald-700' : 'text-slate-500'}`}>
                {isLive ? 'Live Stream Active' : 'Real-time feed'}
            </span>

            <Switch 
                size="small"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className={isLive ? '!text-emerald-600' : ''}
            />
        </div>
    );
};

export default LiveLogToggle;
