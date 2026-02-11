import React, { useState, useEffect } from 'react';
import { 
    Button, Grid, Box, CircularProgress, 
    TextField, InputAdornment 
} from '@mui/material';
import { Plus, Globe, Search, Filter, ShieldCheck, Activity, LayoutGrid } from 'lucide-react';
import { useDomainStore } from '../../store/saas/domainStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';
import { useNavigate } from 'react-router-dom';
import { useLogStore } from '../../store/saas/logStore';
import { useUsageStore } from '../../store/saas/usageStore';
import LimitWarningModal from '../../components/saas/usage/LimitWarningModal';
import UpgradePlanModal from '../../components/saas/usage/UpgradePlanModal';
import DomainCard from '../../components/saas/DomainCard';
import AddDomainModal from '../../components/saas/AddDomainModal';

const DomainManagement = () => {
    const { activeTenantId } = useTenantStore();
    const { domains, fetchDomains, deleteDomain, loading } = useDomainStore();
    const { addLog } = useLogStore();
    const { checkLimit, getTenantPlan, incrementUsage } = useUsageStore();
    const [showAdd, setShowAdd] = useState(false);
    const [showLimitWarning, setShowLimitWarning] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    // Security check
    const canManageDomains = usePermission('manage_domains');

    useEffect(() => {
        if (activeTenantId) fetchDomains(activeTenantId);
    }, [activeTenantId]);

    const tenantDomains = domains[activeTenantId] || [];
    const filteredDomains = tenantDomains.filter(d => 
        d.domainName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading && tenantDomains.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <CircularProgress className="!text-indigo-600" />
                <p className="text-slate-400 font-bold animate-pulse">Scanning Global Edge Records...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Domain Infrastructure</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure and manage custom domains for your high-performance sites.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                        variant="contained" 
                        startIcon={<Plus size={20} />}
                        onClick={() => {
                            const check = checkLimit(activeTenantId, 'domainsConnected');
                            if (check.allowed) {
                                setShowAdd(true);
                            } else {
                                setShowLimitWarning(true);
                            }
                        }}
                        disabled={!canManageDomains}
                        className="!bg-indigo-600 !text-white !font-black !px-8 !py-3 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20 flex-1 md:flex-none"
                    >
                        Connect New Domain
                    </Button>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Active Domains', val: tenantDomains.length, icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Network Health', val: '99.98%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'SSL Active', val: tenantDomains.filter(d => d.sslStatus === 'active').length, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm">
                        <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-none">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search domains..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <Button variant="outlined" className="!rounded-2xl !border-slate-200 !text-slate-600 !font-bold !normal-case !px-6 h-12">
                    <Filter size={18} className="mr-2" /> Filter
                </Button>
            </div>

            {/* Content Section */}
            {filteredDomains.length > 0 ? (
                <Grid container spacing={4}>
                    {filteredDomains.map((domain) => (
                        <Grid item xs={12} sm={6} lg={4} key={domain.id}>
                            <DomainCard 
                                domain={domain} 
                                onManage={() => navigate(`/saas/domains/${domain.id}`)}
                                onDelete={() => {
                                    deleteDomain(activeTenantId, domain.id);
                                    addLog(activeTenantId, {
                                        source: 'user',
                                        type: 'domain',
                                        title: 'Domain Connection Removed',
                                        description: `Workspace admin removed custom domain mapping for: ${domain.domainName}`,
                                        metadata: { domainId: domain.id, domainName: domain.domainName }
                                    });
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6">
                        <Globe size={48} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Domains Configured</h3>
                    <p className="text-slate-500 max-w-xs text-center mt-2">Add a custom domain to enable external access to your sites and provision edge SSL.</p>
                    <Button 
                        onClick={() => setShowAdd(true)} 
                        className="mt-6 !text-indigo-600 !font-black hover:!bg-indigo-50 !px-8 !py-2 !rounded-xl"
                    >
                        Connect Your First Domain
                    </Button>
                </Box>
            )}

            <AddDomainModal 
                open={showAdd} 
                onClose={() => setShowAdd(false)} 
                tenantId={activeTenantId} 
                onSuccess={() => incrementUsage(activeTenantId, 'domainsConnected')}
            />

            <LimitWarningModal 
                open={showLimitWarning}
                onClose={() => setShowLimitWarning(false)}
                onUpgrade={() => {
                    setShowLimitWarning(false);
                    setShowUpgradeModal(true);
                }}
                resourceName="Custom Domains"
                limitValue={getTenantPlan(activeTenantId).limits.domains}
            />

            <UpgradePlanModal 
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                currentPlanId={getTenantPlan(activeTenantId).id}
                onUpgrade={(planId) => setShowUpgradeModal(false)}
            />
        </div>
    );
};

export default DomainManagement;
