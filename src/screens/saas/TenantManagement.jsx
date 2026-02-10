import React, { useState, useEffect } from 'react';
import { Button, Grid, Box, CircularProgress } from '@mui/material';
import { Plus, LayoutGrid, Search, Filter } from 'lucide-react';
import { useTenantStore } from '../../store/saas/tenantStore';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
import TenantCard from '../../components/saas/TenantCard';
import CreateTenantModal from '../../components/saas/CreateTenantModal';
import DeleteTenantModal from '../../components/saas/DeleteTenantModal';

const TenantManagement = () => {
    const { tenants, activeTenantId, fetchTenants, deleteTenant, loading } = useTenantStore();
    const [showCreate, setShowCreate] = useState(false);
    const [deleteQueued, setDeleteQueued] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const canManageTenants = usePermission('manage_tenants');

    useEffect(() => {
        fetchTenants();
    }, []);

    const filteredTenants = Object.values(tenants).filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!canManageTenants) {
        return <div className="p-20 text-center font-bold text-red-500">Access Denied: You do not have permissions to manage workspaces.</div>;
    }

    if (loading && Object.keys(tenants).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <CircularProgress className="!text-indigo-600" />
                <p className="text-slate-400 font-bold animate-pulse">Synchronizing Multi-Tenant Core...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Workspaces</h1>
                    <p className="text-slate-500 font-medium mt-1">Select or manage isolated tenant environments for your projects.</p>
                </div>
                <Button 
                    variant="contained" 
                    startIcon={<Plus size={20} />}
                    onClick={() => setShowCreate(true)}
                    className="!bg-indigo-600 !hover:bg-indigo-700 !text-white !font-black !px-8 !py-3 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20"
                >
                    Create New Workspace
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search workspaces by name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
                <Button variant="outlined" className="!rounded-2xl !border-slate-200 !text-slate-600 !font-bold !normal-case !px-6 h-12">
                    <Filter size={18} className="mr-2" /> Filter
                </Button>
            </div>

            {/* Content Section */}
            {filteredTenants.length > 0 ? (
                <Grid container spacing={4}>
                    {filteredTenants.map((tenant) => (
                        <Grid item xs={12} sm={6} lg={4} key={tenant.id}>
                            <TenantCard 
                                tenant={tenant} 
                                isActive={tenant.id === activeTenantId}
                                onManage={() => navigate(`/saas/settings/${tenant.id}`)}
                                onDelete={() => setDeleteQueued(tenant)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6">
                        <LayoutGrid size={48} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No workspaces found</h3>
                    <p className="text-slate-500 max-w-xs text-center mt-2">Get started by creating your first multi-tenant environment to organize your sites.</p>
                    <Button 
                        onClick={() => setShowCreate(true)} 
                        className="mt-6 !text-indigo-600 !font-black hover:!bg-indigo-50 !px-8 !py-2 !rounded-xl"
                    >
                        Create Your First Tenant
                    </Button>
                </Box>
            )}

            {/* Modals */}
            <CreateTenantModal open={showCreate} onClose={() => setShowCreate(false)} />
            {deleteQueued && (
                <DeleteTenantModal 
                    open={!!deleteQueued} 
                    onClose={() => setDeleteQueued(null)} 
                    tenantName={deleteQueued.name}
                    onConfirm={() => deleteTenant(deleteQueued.id)}
                />
            )}
        </div>
    );
};

export default TenantManagement;
