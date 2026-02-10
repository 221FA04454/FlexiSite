import React from 'react';
import { Card, CardContent, IconButton, Tooltip, Button } from '@mui/material';
import { ExternalLink, Trash2, MoreHorizontal } from 'lucide-react';
import TypeBadge from './TypeBadge';
import SourceBadge from './SourceBadge';
import TimestampBadge from './TimestampBadge';

const LogCard = ({ log, onSelect, onDelete }) => {
    return (
        <Card 
            className="!border-none !shadow-sm hover:!shadow-md !rounded-3xl transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => onSelect(log.id)}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                log.type === 'error' ? 'bg-pink-500' : 
                log.type === 'security' ? 'bg-indigo-600' : 
                'bg-slate-100'
            }`} />
            
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <TypeBadge type={log.type} />
                            <SourceBadge source={log.source} />
                        </div>
                        <TimestampBadge timestamp={log.createdAt} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(log.id); }} className="hover:!text-pink-600">
                            <Trash2 size={16} />
                        </IconButton>
                    </div>
                </div>

                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {log.title}
                </h4>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {log.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">
                        {log.id}
                    </span>
                    <Button 
                        size="small" 
                        endIcon={<ExternalLink size={12} />} 
                        className="!text-indigo-600 !font-bold !normal-case !text-xs"
                    >
                        Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LogCard;
