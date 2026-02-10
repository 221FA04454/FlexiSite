import React from 'react';
import { FormControl, Select, MenuItem, Button, ButtonGroup } from '@mui/material';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { useAnalyticsStore } from '../../store/saas/analyticsStore';

const AnalyticsFilters = ({ onRefresh }) => {
    const { dateRange, setDateRange, exportAnalytics } = useAnalyticsStore();

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
                <ButtonGroup variant="outlined" className="!rounded-2xl overflow-hidden !border-slate-200">
                    {[
                        { id: '24h', label: '24H' },
                        { id: '7d', label: '7D' },
                        { id: '30d', label: '30D' },
                        { id: '90d', label: '90D' }
                    ].map((range) => (
                        <Button 
                            key={range.id}
                            onClick={() => setDateRange(range.id)}
                            className={`!border-slate-100 !text-xs !font-bold !px-6 !py-2 !normal-case ${dateRange === range.id ? '!bg-indigo-600 !text-white !border-indigo-600' : '!text-slate-500 hover:!bg-slate-50'}`}
                        >
                            {range.label}
                        </Button>
                    ))}
                </ButtonGroup>
                
                <Button 
                    variant="outlined"
                    startIcon={<Calendar size={16} />}
                    className="!border-slate-100 !text-slate-500 !text-xs !font-bold !rounded-2xl !px-4 !py-2 !normal-case hover:!bg-slate-50"
                >
                    Custom Range
                </Button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                    onClick={onRefresh}
                    startIcon={<RefreshCw size={16} />}
                    className="!text-indigo-600 !text-xs !font-black !normal-case hover:!bg-indigo-50 !px-4"
                >
                    Refresh Data
                </Button>
                <div className="h-6 w-px bg-slate-100 mx-2 hidden md:block" />
                <Button 
                    onClick={() => exportAnalytics('csv')}
                    startIcon={<Download size={16} />}
                    className="!bg-slate-900 !text-white !text-xs !font-black !px-6 !py-2.5 !rounded-2xl !normal-case shadow-lg shadow-slate-900/10"
                >
                    Export Report
                </Button>
            </div>
        </div>
    );
};

export default AnalyticsFilters;
