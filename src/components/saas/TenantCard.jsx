import React from 'react';
import { Card, CardContent, Button, IconButton, Tooltip, Avatar, Chip } from '@mui/material';
import { Settings, Trash2, ExternalLink, Users, Calendar, Crown } from 'lucide-react';
import MemberRoleBadge from './MemberRoleBadge';

const TenantCard = ({ tenant, onManage, onDelete, isActive }) => {
    // Current user context mock
    const currentUserId = 'user_001';
    const userMember = tenant.members.find(m => m.userId === currentUserId);
    const isOwner = userMember?.role === 'owner';

    return (
        <Card className={`!border-none !shadow-sm !rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isActive ? 'ring-2 ring-indigo-500' : ''}`}>
            <CardContent className="p-0">
                <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                    {isActive && (
                        <div className="absolute top-4 right-4 bg-emerald-100/80 backdrop-blur-sm text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                            ACTIVE WORKSPACE
                        </div>
                    )}
                    <div className="absolute -bottom-8 left-6">
                        <Avatar 
                            src={tenant.logoUrl} 
                            sx={{ width: 64, height: 64 }}
                            className="!bg-white dark:!bg-slate-700 !border-4 !border-white dark:!border-slate-900 shadow-lg text-2xl font-black text-indigo-600"
                        >
                            {tenant.name[0]}
                        </Avatar>
                    </div>
                </div>

                <div className="px-6 pt-12 pb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                {tenant.name}
                                {tenant.plan === 'enterprise' && <Crown size={18} className="text-amber-500" />}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">{tenant.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Users size={14} />
                            <span className="text-xs font-bold uppercase tracking-tighter">{tenant.members.length} Members</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={14} />
                            <span className="text-xs font-bold uppercase tracking-tighter">{new Date(tenant.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                        <MemberRoleBadge role={userMember?.role} />
                        
                        <div className="flex items-center gap-1">
                            {isOwner && (
                                <Tooltip title="Delete Workspace">
                                    <IconButton size="small" onClick={onDelete} className="!text-slate-300 hover:!text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Button 
                                variant="contained" 
                                startIcon={<Settings size={14} />}
                                onClick={onManage}
                                className="!bg-slate-900 dark:!bg-white dark:!text-slate-900 !text-white !font-bold !rounded-xl !px-4 !py-1.5 !normal-case !text-xs"
                            >
                                Manage
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TenantCard;
