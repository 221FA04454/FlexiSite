import React, { useState } from 'react';
import { 
    Select, MenuItem, FormControl, 
    Divider, Button 
} from '@mui/material';
import { Plus, Users, LayoutGrid } from 'lucide-react';
import { useTenantStore } from '../../store/saas/tenantStore';
import CreateTenantModal from './CreateTenantModal';
import MemberRoleBadge from './MemberRoleBadge';

const TenantSwitcher = () => {
    const { tenants, activeTenantId, switchTenant } = useTenantStore();
    const [showCreate, setShowCreate] = useState(false);

    // Filter to get roles for current user
    const currentUserId = 'user_001'; 

    return (
        <div className="flex items-center gap-2">
            <FormControl variant="standard" sx={{ minWidth: 200 }}>
                <Select
                    value={activeTenantId}
                    onChange={(e) => switchTenant(e.target.value)}
                    className="!font-black !text-slate-800 dark:!text-white border-none before:border-none after:border-none"
                    disableUnderline
                    renderValue={(value) => {
                        const t = tenants[value];
                        return (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                                    {t?.name[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="truncate max-w-[120px] leading-none">{t?.name}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                        {t?.members.find(m => m.userId === currentUserId)?.role}
                                    </span>
                                </div>
                            </div>
                        );
                    }}
                    MenuProps={{
                        PaperProps: {
                            className: '!rounded-2xl !mt-2 !shadow-2xl !border !border-slate-100 dark:!border-slate-800 !bg-white/80 !backdrop-blur-xl'
                        }
                    }}
                >
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Workspaces</div>
                    
                    {Object.values(tenants).map((t) => (
                        <MenuItem key={t.id} value={t.id} className="!py-3 !mx-2 !rounded-xl hover:!bg-slate-50 dark:hover:!bg-slate-800/50">
                            <div className="flex items-center gap-4 w-full">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg text-indigo-600 font-bold">
                                    {t.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 dark:text-white truncate">{t.name}</p>
                                        {t.id === activeTenantId && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <MemberRoleBadge role={t.members.find(m => m.userId === currentUserId)?.role} />
                                        <span className="text-[10px] text-slate-400 font-medium">• {t.members.length} members</span>
                                    </div>
                                </div>
                            </div>
                        </MenuItem>
                    ))}

                    <Divider className="!my-2" />
                    
                    <div className="p-2">
                        <Button 
                            fullWidth 
                            startIcon={<Plus size={16} />}
                            onClick={() => setShowCreate(true)}
                            className="!normal-case !font-bold !text-indigo-600 !bg-indigo-50 !rounded-xl !py-2 hover:!bg-indigo-100"
                        >
                            Create New Workspace
                        </Button>
                    </div>
                </Select>
            </FormControl>

            <CreateTenantModal open={showCreate} onClose={() => setShowCreate(false)} />
        </div>
    );
};

export default TenantSwitcher;
