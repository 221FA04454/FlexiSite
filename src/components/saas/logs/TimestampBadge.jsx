import React from 'react';
import { Clock } from 'lucide-react';

const TimestampBadge = ({ timestamp, showLabel = true }) => {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    return (
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] font-medium">
            <Clock size={12} className="shrink-0" />
            <span className="whitespace-nowrap">
                {dateStr} <span className="opacity-50">•</span> {timeStr}
            </span>
        </div>
    );
};

export default TimestampBadge;
