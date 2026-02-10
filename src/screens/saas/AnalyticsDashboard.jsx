import React, { useState, useEffect } from 'react';
import { 
    Grid, Box, Card, CardContent, Button, 
    IconButton, Tooltip, CircularProgress, Chip 
} from '@mui/material';
import { 
    Eye, Users, Clock, TrendingUp, 
    MousePointer2, Smartphone, Layout, 
    Activity, ArrowRight, Table, Sparkles
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/saas/analyticsStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';
import { useLogStore } from '../../store/saas/logStore';
import { useUsageStore } from '../../store/saas/usageStore';
import StatCard from '../../components/saas/AnalyticsOverviewCards';
import AnalyticsLineChart from '../../components/saas/AnalyticsLineChart';
import AnalyticsPieChart from '../../components/saas/AnalyticsPieChart';
import AnalyticsBarChart from '../../components/saas/AnalyticsBarChart';
import AnalyticsFilters from '../../components/saas/AnalyticsFilters';
import AnalyticsHeatmap from '../../components/saas/AnalyticsHeatmap';

const AnalyticsDashboard = () => {
    const { activeTenantId } = useTenantStore();
    const { overview, fetchOverview, loading } = useAnalyticsStore();
    const { addLog } = useLogStore();
    const { incrementUsage } = useUsageStore();
    const [view, setView] = useState('overview'); // overview, pages, components, heatmap

    const projectId = 'proj_1'; // Active project
    const data = overview[projectId];
    const canViewAnalytics = usePermission('analytics');

    useEffect(() => {
        if (projectId) fetchOverview(activeTenantId, projectId);
    }, [projectId, activeTenantId]);

    if (!canViewAnalytics) {
        return <div className="p-20 text-center font-bold text-red-500">Access Denied: You do not have permissions to view site intelligence.</div>;
    }

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <CircularProgress className="!text-indigo-600" />
                <p className="text-slate-400 font-bold animate-pulse">Aggregating Global Engagement Data...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Site Intelligence</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time behavior analysis and conversion architecture.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {['overview', 'pages', 'heatmap'].map((v) => (
                        <Button 
                            key={v}
                            onClick={() => setView(v)}
                            className={`!rounded-xl !px-6 !py-2 !text-xs !font-black !normal-case transition-all ${view === v ? '!bg-white !text-indigo-600 shadow-sm' : '!text-slate-500 hover:!bg-white/50'}`}
                        >
                            {v.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </div>

            <AnalyticsFilters onRefresh={() => {
                fetchOverview(activeTenantId, projectId);
                incrementUsage(activeTenantId, 'analyticsEvents', 500); // Simulate processing 500 records
                addLog(activeTenantId, {
                    source: 'user',
                    type: 'analytics',
                    title: 'Intelligence Data Refreshed',
                    description: `User manually triggered a refresh of the site intelligence metrics for project ${projectId}.`,
                    metadata: { projectId }
                });
            }} />

            {view === 'overview' && data && (
                <>
                    {/* Stat Cards */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard 
                                label="Total Page Views" 
                                value={data.totalPageViews.toLocaleString()} 
                                icon={Eye} 
                                trend="+12.4%" 
                                color="text-blue-600" 
                                bg="bg-blue-50" 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard 
                                label="Unique Visitors" 
                                value={data.uniqueVisitors.toLocaleString()} 
                                icon={Users} 
                                trend="+8.2%" 
                                color="text-indigo-600" 
                                bg="bg-indigo-50" 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard 
                                label="Av. Engagement" 
                                value={data.engagementTime} 
                                icon={Clock} 
                                trend="-2.1%" 
                                color="text-emerald-600" 
                                bg="bg-emerald-50" 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard 
                                label="Scroll Depth" 
                                value={data.avgScrollDepth} 
                                icon={TrendingUp} 
                                trend="+15.0%" 
                                color="text-amber-600" 
                                bg="bg-amber-50" 
                            />
                        </Grid>
                    </Grid>

                    {/* Main Charts Row */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={8}>
                            <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden h-full">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Activity size={18} className="text-indigo-600" />
                                        Traffic Architecture
                                    </h3>
                                    <div className="flex gap-2">
                                        <Chip label="Page Views" size="small" className="!bg-indigo-600 !text-white !font-bold !text-[9px]" />
                                    </div>
                                </div>
                                <CardContent className="p-8">
                                    <AnalyticsLineChart data={data.visitorsOverTime} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden h-full">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Smartphone size={18} className="text-pink-600" />
                                        Device Market Share
                                    </h3>
                                </div>
                                <CardContent className="p-8">
                                    <AnalyticsPieChart data={data.devices} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Behavior Row */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Layout size={18} className="text-indigo-600" />
                                        Top Performing Pages
                                    </h3>
                                    <Button size="small" endIcon={<ArrowRight size={14} />} className="!text-slate-400 !font-bold !normal-case">View All</Button>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-50">
                                        {data.topPages.map((page, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-slate-300 font-black text-xs tabular-nums">0{i+1}</span>
                                                    <div>
                                                        <p className="font-bold text-slate-700 group-hover:text-indigo-600 flex items-center gap-2">
                                                            {page.name}
                                                            <Tooltip title="View Page Live"><IconButton size="small"><ArrowRight size={12} /></IconButton></Tooltip>
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{page.bounce} Bounce Rate</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900 tabular-nums">{page.views.toLocaleString()}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Views</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <MousePointer2 size={18} className="text-indigo-600" />
                                        Component Click Rankings
                                    </h3>
                                </div>
                                <CardContent className="p-8">
                                    <AnalyticsBarChart data={[
                                        { name: 'Button: Hero', views: 4200 },
                                        { name: 'Form: Pricing', views: 2400 },
                                        { name: 'Link: Documentation', views: 3800 },
                                        { name: 'Card: Features', views: 1900 },
                                    ]} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}

            {view === 'pages' && (
                <div className="grid grid-cols-1 gap-6">
                    <Card className="!rounded-3xl !border-none !shadow-sm overflow-hidden">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Deep Page Analytics</h3>
                                <p className="text-xs text-slate-400 mt-1">Granular engagement tracking for every route in your project.</p>
                            </div>
                            <Button startIcon={<Table size={16} />} className="!bg-white/10 !text-white !font-bold !rounded-xl !normal-case">Advanced View</Button>
                        </div>
                        <CardContent className="p-8">
                             <div className="space-y-4">
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-indigo-200 flex items-center justify-center text-indigo-600 font-black">/</div>
                                        <div>
                                            <p className="font-black text-slate-900">Home Landing Page</p>
                                            <p className="text-xs text-slate-500">Last event: 2 mins ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 px-8">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Avg Depth</p>
                                            <p className="font-black text-indigo-600">72%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">CTR</p>
                                            <p className="font-black text-emerald-600">14.2%</p>
                                        </div>
                                    </div>
                                    <Button variant="contained" className="!bg-slate-900 !rounded-xl !font-bold !normal-case">Full Report</Button>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {view === 'heatmap' && (
                <AnalyticsHeatmap />
            )}
        </div>
    );
};

export default AnalyticsDashboard;
