import React, { useState } from 'react';
import { Card, CardContent, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { Trash2, ShieldOff, Clock, Terminal, RefreshCw, Copy, CheckCircle2 } from 'lucide-react';
import MaskedKeyDisplay from './MaskedKeyDisplay';
import PermissionTag from './PermissionTag';
import { useApiKeyStore } from '../../store/saas/apiKeyStore';

const ApiKeyCard = ({ apiKey, tenantId, onRevoke, onDelete }) => {
    const { regenerateApiKey } = useApiKeyStore();
    const [showRegenModal, setShowRegenModal] = useState(false);
    const [newRawKey, setNewRawKey] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const isActive = apiKey.status === 'active';

    const handleRegenerate = async () => {
        const { rawKey } = await regenerateApiKey(tenantId, apiKey.id);
        setNewRawKey(rawKey);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(newRawKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Card className={`!border-none !shadow-sm !rounded-2xl transition-all duration-300 ${!isActive ? 'opacity-60 bg-slate-50' : 'hover:shadow-lg'}`}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 text-slate-500'}`}>
                                <Terminal size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{apiKey.name}</h3>
                                <div className="mt-1">
                                    <MaskedKeyDisplay />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {isActive && (
                                <Tooltip title="Regenerate Key">
                                    <IconButton size="small" onClick={() => setShowRegenModal(true)} className="!text-indigo-400 hover:!bg-indigo-50">
                                        <RefreshCw size={18} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {isActive && (
                                <Tooltip title="Revoke access">
                                    <IconButton size="small" onClick={onRevoke} className="!text-amber-500 hover:!bg-amber-50">
                                        <ShieldOff size={18} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Delete record">
                                <IconButton size="small" onClick={onDelete} className="!text-slate-300 hover:!text-red-500">
                                    <Trash2 size={18} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6 min-h-[50px] items-start">
                        {apiKey.permissions.map(p => <PermissionTag key={p} permission={p} />)}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Clock size={12} />
                                CREATED: {new Date(apiKey.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Terminal size={12} />
                                LAST USED: {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleDateString() : 'NEVER'}
                            </div>
                        </div>
                        
                        <div className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                            isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {apiKey.status}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Regeneration Modal */}
            <Dialog 
                open={showRegenModal} 
                onClose={newRawKey ? null : () => setShowRegenModal(false)}
                PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-sm' }}
            >
                <DialogTitle className="!font-black text-xl">Regenerate Secret Key</DialogTitle>
                <DialogContent className="space-y-4">
                    {newRawKey ? (
                        <div className="space-y-4">
                            <Alert severity="success" className="!rounded-2xl">
                                Key regenerated successfully. Old key is now invalid.
                            </Alert>
                            <div className="bg-slate-900 rounded-2xl p-4 pr-12 relative group">
                                <code className="text-indigo-300 font-mono text-xs break-all">{newRawKey}</code>
                                <IconButton onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 !text-white/40 hover:!text-white">
                                    {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                </IconButton>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">
                            Are you sure? This will immediately revoke the current key and apps using it will lose access until updated.
                        </p>
                    )}
                </DialogContent>
                <DialogActions className="!p-4">
                    {newRawKey ? (
                        <Button fullWidth variant="contained" onClick={() => { setShowRegenModal(false); setNewRawKey(null); }} className="!bg-slate-900 !rounded-xl !normal-case !font-bold">I've saved it</Button>
                    ) : (
                        <>
                            <Button onClick={() => setShowRegenModal(false)} className="!text-slate-500 !font-bold">Cancel</Button>
                            <Button variant="contained" color="error" onClick={handleRegenerate} className="!bg-red-600 !rounded-xl !font-bold !normal-case">Regenerate Now</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ApiKeyCard;
