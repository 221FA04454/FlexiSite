import React from 'react';
import { useTenantStore } from '../../store/saas/tenantStore';
import TenantSwitcher from '../saas/TenantSwitcher';
import { 
    Avatar, IconButton, Badge, Tooltip 
} from '@mui/material';
import { 
    Notifications as BellIcon,
    Search as SearchIcon,
    HelpOutline as HelpIcon,
    CloudDone as StatusIcon
} from '@mui/icons-material';

const TopBar = () => {
    const { tenants, activeTenantId } = useTenantStore();
    const activeTenant = tenants[activeTenantId];

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors">
            <div className="flex items-center gap-6">
                <TenantSwitcher />

                <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />
                
                <div className="flex items-center gap-2 text-slate-400">
                    <StatusIcon sx={{ fontSize: 18 }} className="text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Global Edge: Online</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative group mr-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" sx={{ fontSize: 20 }} />
                    <input 
                        type="text" 
                        placeholder="Global command (cmd+K)" 
                        className="bg-slate-50 dark:bg-slate-800 rounded-full py-2 pl-10 pr-4 text-xs font-medium w-64 border-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                <Tooltip title="Documentation">
                    <IconButton size="small" className="!text-slate-400"><HelpIcon /></IconButton>
                </Tooltip>
                
                <Badge variant="dot" color="error" overlap="circular" className="mx-2">
                    <IconButton size="small" className="!text-slate-400"><BellIcon /></IconButton>
                </Badge>

                <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Architect AI</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">System Owner</p>
                    </div>
                    <Avatar 
                        sx={{ width: 32, height: 32 }} 
                        className="!bg-gradient-to-br !from-indigo-600 !to-pink-500 !text-xs !font-bold"
                    >
                        AD
                    </Avatar>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
