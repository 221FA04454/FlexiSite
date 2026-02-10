import React from 'react';

const MaskedKeyDisplay = ({ prefix = "fs_live_" }) => {
    return (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
            <span className="text-slate-600 font-bold">{prefix}</span>
            <span>••••••••••••••••</span>
        </div>
    );
};

export default MaskedKeyDisplay;
