import React from 'react';
import { useLogStore } from '../../../store/saas/logStore';
import { Search, Filter, Calendar } from 'lucide-react';
import { Button, MenuItem, Select, TextField, InputAdornment } from '@mui/material';

const LogFilters = () => {
    const { filters, setFilters, search, setSearch } = useLogStore();

    const types = [
        { val: 'all', label: 'All Types' },
        { val: 'deployment', label: 'Deployments' },
        { val: 'security', label: 'Security' },
        { val: 'error', label: 'Errors' },
        { val: 'api_key', label: 'API Keys' },
        { val: 'domain', label: 'Domains' },
        { val: 'tenant', label: 'Tenant' }
    ];

    const sources = [
        { val: 'all', label: 'All Sources' },
        { val: 'system', label: 'System' },
        { val: 'user', label: 'User Action' },
        { val: 'api_key', label: 'API Gateway' },
        { val: 'integration', label: 'Integrations' }
    ];

    return (
        <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800">
            {/* Search */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by event title or description..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Type Filter */}
                <Select
                    value={filters.type}
                    onChange={(e) => setFilters({ type: e.target.value })}
                    size="small"
                    className="!bg-slate-50 !border-none !rounded-2xl !text-xs !font-bold min-w-[140px]"
                    sx={{ '& fieldset': { border: 'none' } }}
                >
                    {types.map(t => <MenuItem key={t.val} value={t.val}>{t.label}</MenuItem>)}
                </Select>

                {/* Source Filter */}
                <Select
                    value={filters.source}
                    onChange={(e) => setFilters({ source: e.target.value })}
                    size="small"
                    className="!bg-slate-50 !border-none !rounded-2xl !text-xs !font-bold min-w-[140px]"
                    sx={{ '& fieldset': { border: 'none' } }}
                >
                    {sources.map(s => <MenuItem key={s.val} value={s.val}>{s.label}</MenuItem>)}
                </Select>

                {/* Date Filter (Simulated) */}
                <Button 
                    variant="outlined" 
                    startIcon={<Calendar size={16} />}
                    className="!rounded-2xl !border-slate-100 !text-slate-500 !font-bold !normal-case h-10 px-4 whitespace-nowrap"
                >
                    All Time
                </Button>

                <Button 
                    variant="outlined" 
                    startIcon={<Filter size={16} />}
                    className="!rounded-2xl !border-indigo-100 !text-indigo-600 !font-black !normal-case h-10 px-4"
                >
                    Advanced
                </Button>
            </div>
        </div>
    );
};

export default LogFilters;
