import React from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, IconButton, Tooltip, Paper 
} from '@mui/material';
import { MoreHorizontal, ExternalLink, Trash2 } from 'lucide-react';
import { useLogStore } from '../../../store/saas/logStore';
import TypeBadge from './TypeBadge';
import SourceBadge from './SourceBadge';
import TimestampBadge from './TimestampBadge';

const LogListTable = ({ logs, onSelect, onDelete }) => {
    return (
        <TableContainer component={Paper} className="!border-none !shadow-none !bg-transparent">
            <Table>
                <TableHead>
                    <TableRow className="!bg-slate-50/50">
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Time</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Type</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Origin</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest">Event</TableCell>
                        <TableCell className="!font-black !text-slate-400 !uppercase !text-[10px] !tracking-widest !text-right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow 
                            key={log.id} 
                            hover 
                            className="group cursor-pointer transition-colors"
                            onClick={() => onSelect(log.id)}
                        >
                            <TableCell className="!py-4">
                                <TimestampBadge timestamp={log.createdAt} />
                            </TableCell>
                            <TableCell>
                                <TypeBadge type={log.type} />
                            </TableCell>
                            <TableCell>
                                <SourceBadge source={log.source} />
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{log.title}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-md">{log.description}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Tooltip title="View JSON Details">
                                        <IconButton size="small" className="!text-slate-400 hover:!text-indigo-600">
                                            <ExternalLink size={14} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Permanently">
                                        <IconButton size="small" className="!text-slate-400 hover:!text-pink-600" onClick={(e) => { e.stopPropagation(); onDelete(log.id); }}>
                                            <Trash2 size={14} />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton size="small" className="!text-slate-400"><MoreHorizontal size={14} /></IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LogListTable;
