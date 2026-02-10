import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Tabs, Tab, Button, Card, CardContent, Divider, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tooltip, TextField, MenuItem, Select
} from '@mui/material';
import { 
    Settings, Users, Shield, Zap, Trash2, 
    Mail, ArrowLeft, Save, ShieldAlert,
    ExternalLink
} from 'lucide-react';
import { useTenantStore, ROLES } from '../../store/saas/tenantStore';
import { usePermission } from '../../hooks/usePermission';
import { useLogStore } from '../../store/saas/logStore';
import { useUsageStore } from '../../store/saas/usageStore';
import LimitWarningModal from '../../components/saas/usage/LimitWarningModal';
import UpgradePlanModal from '../../components/saas/usage/UpgradePlanModal';
import TenantLogoUploader from '../../components/saas/TenantLogoUploader';
import MemberRoleBadge from '../../components/saas/MemberRoleBadge';
import InviteUserModal from '../../components/saas/InviteUserModal';
import TenantLimitsEditor from '../../components/saas/TenantLimitsEditor';
import DeleteTenantModal from '../../components/saas/DeleteTenantModal';

const TenantSettings = () => {
    const { tenantId } = useParams();
    const navigate = useNavigate();
    const { tenants, updateTenant, updateMemberRole, removeMember, deleteTenant, updateLimits, inviteUser } = useTenantStore();
    const { addLog } = useLogStore();
    const { checkLimit, getTenantPlan, incrementUsage } = useUsageStore();
    const tenant = tenants[tenantId];
    
    // RBAC Check
    const canManageTenants = usePermission('manage_tenants');
    const isOwner = usePermission('billing'); // Usually owners have billing access

    const [activeTab, setActiveTab] = useState(0);
    const [showInvite, setShowInvite] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showLimitWarning, setShowLimitWarning] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [formData, setFormData] = useState(tenant || {});

    if (!tenant) return <div className="p-20 text-center font-bold text-red-500">Tenant not found.</div>;

    const handleSaveGeneral = () => {
        updateTenant(tenantId, {
            name: formData.name,
            description: formData.description,
            logoUrl: formData.logoUrl
        });
        addLog(tenantId, {
            source: 'user',
            type: 'tenant',
            title: 'Workspace Identity Updated',
            description: `Workspace profile settings (name, description, logo) were modified.`,
            metadata: { name: formData.name }
        });
        alert('Workspace settings updated successfully!');
    };

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;
        return (
            <div role="tabpanel" hidden={value !== index} {...other}>
                {value === index && <Box className="py-8">{children}</Box>}
            </div>
        );
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <IconButton onClick={() => navigate('/saas/tenants')} className="!bg-white dark:!bg-slate-900 shadow-sm">
                    <ArrowLeft size={20} />
                </IconButton>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{tenant.name} Settings</h1>
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{tenant.plan}</span>
                    </div>
                    <p className="text-slate-500 font-medium">Configure workspace identity, team permissions, and operational constraints.</p>
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
                        icon={<Settings size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="General" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 0 ? '!text-indigo-600' : '!text-slate-400'}`} 
                    />
                    <Tab 
                        icon={<Users size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="Members" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 1 ? '!text-indigo-600' : '!text-slate-400'}`} 
                    />
                    <Tab 
                        icon={<Zap size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="Limits & Quotas" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 2 ? '!text-indigo-600' : '!text-slate-400'}`} 
                    />
                    <Tab 
                        icon={<ShieldAlert size={18} className="mr-2" />} 
                        iconPosition="start" 
                        label="Danger Zone" 
                        className={`!normal-case !font-bold !min-h-0 !py-4 ${activeTab === 3 ? '!text-red-600' : '!text-slate-400'}`} 
                    />
                </Tabs>
            </Box>

            {/* General Settings */}
            <TabPanel value={activeTab} index={0}>
                <div className="max-w-3xl space-y-8">
                    <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-8">
                            <TenantLogoUploader 
                                value={formData.logoUrl} 
                                onChange={(val) => setFormData({...formData, logoUrl: val})} 
                            />
                            
                            <Divider />

                            <div className="space-y-6">
                                <TextField
                                    fullWidth
                                    label="Workspace Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="!bg-slate-50 rounded-xl"
                                />

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="!bg-slate-50 rounded-xl"
                                />
                            </div>

                            <Button 
                                variant="contained" 
                                startIcon={<Save size={18} />}
                                onClick={handleSaveGeneral}
                                className="!bg-slate-900 !rounded-xl !px-8 !py-3 !font-bold !normal-case"
                            >
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </TabPanel>

            {/* Members Management */}
            <TabPanel value={activeTab} index={1}>
                <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
                    <Box className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">Workspace Members</h3>
                            <p className="text-sm text-slate-500">Manage who has access to this workspace and what they can do.</p>
                        </div>
                        <Button 
                            variant="contained" 
                            startIcon={<Mail size={18} />}
                            onClick={() => {
                                const check = checkLimit(tenantId, 'membersInvited');
                                if (check.allowed) {
                                    setShowInvite(true);
                                } else {
                                    setShowLimitWarning(true);
                                }
                            }}
                            className="!bg-indigo-600 !rounded-xl !px-6 !py-2.5 !font-bold !normal-case"
                        >
                            Invite Member
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead className="bg-slate-50">
                                <TableRow>
                                    <TableCell className="!font-bold !text-slate-400 !uppercase !text-[10px]">User</TableCell>
                                    <TableCell className="!font-bold !text-slate-400 !uppercase !text-[10px]">Role</TableCell>
                                    <TableCell className="!font-bold !text-slate-400 !uppercase !text-[10px]">Status</TableCell>
                                    <TableCell className="!font-bold !text-slate-400 !uppercase !text-[10px]">Joined</TableCell>
                                    <TableCell className="!font-bold !text-slate-400 !uppercase !text-[10px] text-right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tenant.members.map((member) => (
                                    <TableRow key={member.userId} hover>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {member.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{member.name}</p>
                                                    <p className="text-xs text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={member.role}
                                                size="small"
                                                variant="standard"
                                                disableUnderline
                                                onChange={(e) => {
                                                    const newRole = e.target.value;
                                                    updateMemberRole(tenantId, member.userId, newRole);
                                                    addLog(tenantId, {
                                                        source: 'user',
                                                        type: 'tenant',
                                                        title: 'Member Role Updated',
                                                        description: `Access role for ${member.name} changed to ${newRole}.`,
                                                        metadata: { targetUserId: member.userId, targetEmail: member.email, newRole }
                                                    });
                                                }}
                                                className="!text-sm !font-bold"
                                                disabled={member.role === ROLES.OWNER || !canManageTenants}
                                            >
                                                <MenuItem value={ROLES.OWNER} disabled>Owner</MenuItem>
                                                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
                                                <MenuItem value={ROLES.EDITOR}>Editor</MenuItem>
                                                <MenuItem value={ROLES.VIEWER}>Viewer</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={member.status} 
                                                size="small" 
                                                className={`!text-[10px] !font-bold !uppercase ${member.status === 'active' ? '!bg-emerald-50 !text-emerald-700' : '!bg-amber-50 !text-amber-700'}`} 
                                            />
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-400 font-medium">{new Date(member.invitedAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            {member.role !== ROLES.OWNER && (
                                                <Tooltip title="Remove Member">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => {
                                                            removeMember(tenantId, member.userId);
                                                            addLog(tenantId, {
                                                                source: 'user',
                                                                type: 'tenant',
                                                                title: 'Member Removed',
                                                                description: `User ${member.name} was removed from the workspace team.`,
                                                                metadata: { targetUserId: member.userId, targetEmail: member.email }
                                                            });
                                                        }} 
                                                        color="error" 
                                                        className="!bg-red-50/0 hover:!bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </TabPanel>

            {/* Limits Management */}
            <TabPanel value={activeTab} index={2}>
                <TenantLimitsEditor 
                    limits={tenant.limits} 
                    onSave={(newLimits) => {
                        updateLimits(tenantId, newLimits);
                        alert('Workspace resource limits enforced.');
                    }} 
                />
            </TabPanel>

            {/* Danger Zone */}
            <TabPanel value={activeTab} index={3}>
                <Card className="!border-2 !border-red-100 !bg-red-50/30 !shadow-none !rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-red-600">Danger Zone</h3>
                                <p className="text-sm text-red-500/80">Irreversible actions that affect the entire multi-tenant hierarchy.</p>
                            </div>
                        </div>

                        <Divider className="!border-red-100 !mb-8" />

                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-900">Transfer Ownership</h4>
                                    <p className="text-sm text-slate-500">Grant owner permissions to another admin member.</p>
                                </div>
                                <Button variant="outlined" color="error" className="!rounded-xl !font-bold !normal-case !px-6">Transfer</Button>
                            </div>

                            <Divider className="!border-red-50/50" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-900">Delete this Workspace</h4>
                                    <p className="text-sm text-slate-500">Permanently remove this tenant and all associated data.</p>
                                </div>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    onClick={() => setShowDelete(true)}
                                    className="!bg-red-600 !rounded-xl !font-bold !normal-case !px-6"
                                >
                                    Delete Workspace
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <InviteUserModal 
                open={showInvite} 
                onClose={() => setShowInvite(false)} 
                tenantId={tenantId}
                onSuccess={() => incrementUsage(tenantId, 'membersInvited')}
            />

            <LimitWarningModal 
                open={showLimitWarning}
                onClose={() => setShowLimitWarning(false)}
                onUpgrade={() => {
                    setShowLimitWarning(false);
                    setShowUpgradeModal(true);
                }}
                resourceName="Team Seats"
                limitValue={getTenantPlan(tenantId).limits.members}
            />

            <UpgradePlanModal 
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                currentPlanId={getTenantPlan(tenantId).id}
                onUpgrade={(planId) => setShowUpgradeModal(false)}
            />

            <DeleteTenantModal 
                open={showDelete} 
                onClose={() => setShowDelete(false)} 
                tenantName={tenant.name}
                onConfirm={() => {
                    deleteTenant(tenantId);
                    // Note: In a real system, the log would be stored at a global level or in a system tenant
                    // since the tenant itself is being deleted. For this demo, we'll try to add it before deletion.
                    addLog('tenant_default', {
                        source: 'user',
                        type: 'security',
                        title: 'Workspace Permanently Deleted',
                        description: `The workspace "${tenant.name}" (${tenantId}) and all associated records were scrubbed.`,
                        metadata: { tenantId, tenantName: tenant.name }
                    });
                    navigate('/saas/tenants');
                }}
            />
        </div>
    );
};

export default TenantSettings;
