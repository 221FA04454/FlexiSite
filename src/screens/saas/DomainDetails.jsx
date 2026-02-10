import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Tabs, Tab, Button, Card, CardContent, Divider, 
    IconButton, Tooltip, Alert, CircularProgress, Grid
} from '@mui/material';
import { 
    ArrowLeft, Globe, ShieldCheck, Zap, Activity,
    RefreshCw, Trash2, ExternalLink, ShieldAlert,
    AlertTriangle, Server, CheckCircle2
} from 'lucide-react';
import { useDomainStore, DOMAIN_STATUS, HEALTH_STATUS } from '../../store/saas/domainStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';
import DNSRecordsBlock from '../../components/saas/DNSRecordsBlock';
import SSLStatusBadge from '../../components/saas/SSLStatusBadge';
import DomainHealthBadge from '../../components/saas/DomainHealthBadge';

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;
        return (
            <div role="tabpanel" hidden={value !== index} {...other}>
                {value === index && <Box className="py-6">{children}</Box>}
            </div>
        );
    };

const DomainDetails = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const { activeTenantId } = useTenantStore();
    const { domains, verifyDNS, deleteDomain } = useDomainStore();
    const [activeTab, setActiveTab] = useState(0);
    const [verifying, setVerifying] = useState(false);

    const domain = domains[activeTenantId]?.find(d => d.id === domainId);
    // const canManage = usePermission('manage_domains'); // Unused

    if (!domain) return <div className="p-20 text-center font-bold text-red-500">Domain record not found.</div>;

    const handleVerify = async () => {
        setVerifying(true);
        await verifyDNS(activeTenantId, domainId);
        setVerifying(false);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <IconButton onClick={() => navigate('/saas/domains')} className="!bg-white dark:!bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                        <ArrowLeft size={20} />
                    </IconButton>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{domain.domainName}</h1>
                            <DomainHealthBadge status={domain.health} />
                        </div>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                            <Server size={14} /> Edge Node: US-East-1 (AWS)
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outlined"
                        startIcon={<ExternalLink size={18} />}
                        href={`https://${domain.domainName}`}
                        target="_blank"
                        className="!border-slate-200 !text-slate-600 !font-bold !rounded-2xl !px-6 !normal-case"
                    >
                        Visit Site
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<RefreshCw size={18} className={verifying ? 'animate-spin' : ''} />}
                        onClick={handleVerify}
                        disabled={verifying}
                        className="!bg-slate-900 !text-white !font-bold !px-8 !rounded-2xl !normal-case shadow-xl"
                    >
                        {verifying ? 'Verifying...' : 'Check Propagation'}
                    </Button>
                </div>
            </div>

            <Box className="border-b border-slate-200 dark:border-slate-800">
                <Tabs 
                    value={activeTab} 
                    onChange={(e, v) => setActiveTab(v)}
                    className="!min-h-0"
                    TabIndicatorProps={{ className: '!bg-indigo-600 !h-1' }}
                >
                    <Tab 
                        icon={<Activity size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="Overview" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 0 ? '!text-indigo-600' : '!text-slate-400'}`} 
                    />
                    <Tab 
                        icon={<Globe size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="DNS Records" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 1 ? '!text-indigo-600' : '!text-slate-400'}`} 
                    />
                    <Tab 
                        icon={<ShieldCheck size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="Edge SSL" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 2 ? '!text-indigo-600' : '!text-slate-400'}`} 
                    />
                    <Tab 
                        icon={<AlertTriangle size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="Safety" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 3 ? '!text-red-600' : '!text-slate-400'}`} 
                    />
                </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={activeTab} index={0}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden h-full">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DNS Verification</p>
                                            <h4 className="text-xl font-bold flex items-center gap-2">
                                                {domain.dnsStatus === DOMAIN_STATUS.VERIFIED ? 'Fully Operational' : 'Awaiting Config'}
                                                {domain.dnsStatus === DOMAIN_STATUS.VERIFIED && <CheckCircle2 className="text-emerald-500" size={20} />}
                                            </h4>
                                        </div>
                                        <SSLStatusBadge status={domain.sslStatus} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Box className="p-4 border border-slate-100 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Domain</p>
                                            <p className="text-sm font-bold">{domain.isPrimary ? 'Yes' : 'No'}</p>
                                        </Box>
                                        <Box className="p-4 border border-slate-100 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Deployment</p>
                                            <p className="text-sm font-bold">{domain.lastDeploymentVersion || 'N/A'}</p>
                                        </Box>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Project</h4>
                                        <Box className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-600 text-white rounded-lg"><Zap size={18} /></div>
                                                <p className="font-bold text-slate-800">Corporate Website Pro</p>
                                            </div>
                                            <Button size="small" className="!normal-case !font-bold !text-indigo-600">Re-map Project</Button>
                                        </Box>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card className="!border-none !shadow-sm !rounded-3xl bg-indigo-600 text-white h-full relative overflow-hidden">
                            <CardContent className="p-8 relative z-10 flex flex-col h-full">
                                <Activity className="text-white/20 absolute -top-8 -right-8" size={160} />
                                <h3 className="text-2xl font-black mb-4">Traffic Insights</h3>
                                <p className="text-indigo-100 opacity-80 text-sm mb-12">Global edge routing is optimized for this domain. Assets are cached across 200+ POPs.</p>
                                
                                <div className="mt-auto space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">24H Requests</span>
                                        <span className="text-2xl font-black">1.2k</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="w-3/4 h-full bg-white" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-indigo-300">Fastest Edge Latency: 42ms</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* DNS Records Tab */}
            <TabPanel value={activeTab} index={1}>
                <div className="max-w-4xl mx-auto">
                    <DNSRecordsBlock domainName={domain.domainName} />
                </div>
            </TabPanel>

            {/* SSL Tab */}
            <TabPanel value={activeTab} index={2}>
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
                        <CardContent className="p-8 flex items-center gap-8">
                            <Box className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center border-8 border-white shadow-xl">
                                <ShieldCheck size={48} className="text-emerald-500" />
                            </Box>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">Edge Certificate Active</h3>
                                <p className="text-sm text-slate-500 font-medium">Provisioned via Let's Encrypt CA. Automatically renews every 60 days.</p>
                                <div className="flex gap-4 pt-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Issued</p>
                                        <p className="text-xs font-bold">{new Date(domain.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Expires</p>
                                        <p className="text-xs font-bold">In 58 Days</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button 
                        startIcon={<RefreshCw size={16} />}
                        className="!text-slate-400 !normal-case !font-bold !w-full"
                    >
                        Force Certificate Renewal
                    </Button>
                </div>
            </TabPanel>

            {/* Danger Zone Tab */}
            <TabPanel value={activeTab} index={3}>
                <Card className="!border-none !shadow-none !bg-red-50/50 !rounded-3xl">
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><ShieldAlert size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black text-red-600">Danger Zone</h3>
                                <p className="text-sm text-red-500/80 font-medium">Removing this domain will immediately stop the site from being accessible at this address. This cannot be undone.</p>
                            </div>
                        </div>

                        <Divider className="!border-red-100" />

                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-900">Delete Domain</h4>
                                <p className="text-xs text-slate-500">Permanently purge this record and release the edge certificate.</p>
                            </div>
                            <Button 
                                variant="contained" 
                                color="error" 
                                className="!bg-red-600 !rounded-xl !font-black !px-6 !normal-case shadow-xl"
                                onClick={() => {
                                    deleteDomain(activeTenantId, domainId);
                                    navigate('/saas/domains');
                                }}
                            >
                                Remove Domain
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>
        </div>
    );
};

export default DomainDetails;
