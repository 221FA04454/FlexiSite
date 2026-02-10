import React, { useState, useEffect } from 'react';
import { 
    Button, Grid, Box, CircularProgress, 
    Typography, IconButton, Tooltip 
} from '@mui/material';
import { Plus, Key, Terminal, Search, Filter, ShieldAlert, BookOpen } from 'lucide-react';
import { useApiKeyStore } from '../../store/saas/apiKeyStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';
import { useLogStore } from '../../store/saas/logStore';
import { useUsageStore } from '../../store/saas/usageStore';
import LimitWarningModal from '../../components/saas/usage/LimitWarningModal';
import UpgradePlanModal from '../../components/saas/usage/UpgradePlanModal';
import ApiKeyCard from '../../components/saas/ApiKeyCard';
import CreateApiKeyModal from '../../components/saas/CreateApiKeyModal';

const ApiKeyManager = () => {
    const { activeTenantId } = useTenantStore();
    const { apiKeys, fetchApiKeys, revokeApiKey, deleteApiKey, loading } = useApiKeyStore();
    const { addLog } = useLogStore();
    const { checkLimit, getTenantPlan, incrementUsage } = useUsageStore();
    const [showCreate, setShowCreate] = useState(false);
    const [showLimitWarning, setShowLimitWarning] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [search, setSearch] = useState('');
    
    // Auth Check
    const canManageKeys = usePermission('manage_api_keys');

    useEffect(() => {
        if (activeTenantId) {
            fetchApiKeys(activeTenantId);
        }
    }, [activeTenantId]);

    const currentKeys = apiKeys[activeTenantId] || [];
    const filteredKeys = currentKeys.filter(k => 
        k.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!canManageKeys) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                    <ShieldAlert size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
                <p className="text-slate-500 max-w-sm mt-2">Only Workspace Owners or Administrators can manage production API credentials.</p>
                <Button 
                    variant="outlined" 
                    className="mt-6 !rounded-xl !font-bold !normal-case !border-slate-200 !text-slate-600"
                    onClick={() => window.history.back()}
                >
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:row justify-between lg:flex-row lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">API Infrastructure</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage secret keys for programmatic access to your FlexiSite resources.</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outlined"
                        startIcon={<BookOpen size={18} />}
                        className="!border-slate-200 !text-slate-600 !font-bold !rounded-2xl !px-6 !normal-case h-12"
                    >
                        Read API Docs
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Plus size={20} />}
                        onClick={() => {
                            const check = checkLimit(activeTenantId, 'apiKeysCreated');
                            if (check.allowed) {
                                setShowCreate(true);
                            } else {
                                setShowLimitWarning(true);
                            }
                        }}
                        className="!bg-indigo-600 !text-white !font-black !px-8 !py-3 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20"
                    >
                        Generate New Key
                    </Button>
                </div>
            </div>

            {/* Quick Warning / Security Banner */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4">
                <ShieldAlert className="text-amber-600 shrink-0" size={24} />
                <p className="text-xs text-amber-800 font-medium italic">
                    Security Tip: Treat these keys like your password. Use environment variables like <b>FS_SECRET_KEY</b> in your CI/CD pipelines. 
                    <a href="#" className="underline ml-2 font-bold">Learn more about API security</a>.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search keys by name or scope..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 shadow-sm transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outlined" className="!rounded-2xl !border-slate-200 !text-slate-600 !font-bold !normal-case !px-6 h-12 flex-1 md:flex-none">
                        <Filter size={18} className="mr-2" /> Filter
                    </Button>
                </div>
            </div>

            {/* Key List */}
            {loading && currentKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <CircularProgress className="!text-indigo-600" />
                    <p className="text-slate-400 font-bold animate-pulse">Scanning Secure Enclave...</p>
                </div>
            ) : filteredKeys.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredKeys.map((key) => (
                        <Grid item xs={12} md={6} lg={4} key={key.id}>
                            <ApiKeyCard 
                                apiKey={key} 
                                tenantId={activeTenantId}
                                onRevoke={() => {
                                    revokeApiKey(activeTenantId, key.id);
                                    addLog(activeTenantId, {
                                        source: 'user',
                                        type: 'security',
                                        title: 'API Key Revoked',
                                        description: `Access token "${key.name}" was manually revoked by an administrator.`,
                                        metadata: { keyId: key.id, keyName: key.name }
                                    });
                                }}
                                onDelete={() => {
                                    deleteApiKey(activeTenantId, key.id);
                                    addLog(activeTenantId, {
                                        source: 'user',
                                        type: 'security',
                                        title: 'API Key Deleted',
                                        description: `Resource record for API key "${key.name}" was permanently deleted.`,
                                        metadata: { keyId: key.id, keyName: key.name }
                                    });
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6">
                        <Key size={48} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No API Keys Generated</h3>
                    <p className="text-slate-500 max-w-xs text-center mt-2">Generate your first secret key to integrate FlexiSite with external CI/CD toolsets or developer SDKs.</p>
                    <Button 
                        onClick={() => {
                            const check = checkLimit(activeTenantId, 'apiKeysCreated');
                            if (check.allowed) {
                                setShowCreate(true);
                            } else {
                                setShowLimitWarning(true);
                            }
                        }} 
                        className="mt-6 !text-indigo-600 !font-black hover:!bg-indigo-50 !px-8 !py-2 !rounded-xl"
                    >
                        Create Your First Key
                    </Button>
                </Box>
            )}

            {/* Modals */}
            <CreateApiKeyModal 
                open={showCreate} 
                onClose={() => setShowCreate(false)} 
                tenantId={activeTenantId}
                onSuccess={() => incrementUsage(activeTenantId, 'apiKeysCreated')}
            />

            <LimitWarningModal 
                open={showLimitWarning}
                onClose={() => setShowLimitWarning(false)}
                onUpgrade={() => {
                    setShowLimitWarning(false);
                    setShowUpgradeModal(true);
                }}
                resourceName="API Keys"
                limitValue={getTenantPlan(activeTenantId).limits.apiKeys}
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

export default ApiKeyManager;
