import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, FormGroup, FormControlLabel, Checkbox,
    Alert, IconButton, Tooltip
} from '@mui/material';
import { Key, Copy, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { useApiKeyStore } from '../../store/saas/apiKeyStore';

const AVAILABLE_PERMISSIONS = [
    { id: 'publish_project', label: 'Publish Project', desc: 'Push builds & deploy' },
    { id: 'read_pages', label: 'Read Pages', desc: 'Fetch site JSON at runtime' },
    { id: 'analytics_read', label: 'Analytics Read', desc: 'Access visitor metrics' },
    { id: 'templates_write', label: 'Templates Write', desc: 'Modify system templates' },
    { id: 'domain_manage', label: 'Domain Manage', desc: 'Configure custom domains' },
    { id: 'build_manage', label: 'Build Manage', desc: 'Trigger manual builds' },
    { id: 'integration_access', label: 'Integration Access', desc: 'Access third-party connectors' }
];

const CreateApiKeyModal = ({ open, onClose, tenantId, onSuccess }) => {
    const { createApiKey } = useApiKeyStore();
    const [name, setName] = useState('');
    const [perms, setPerms] = useState({
        publish_project: true,
        read_pages: true
    });
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        const selectedPerms = Object.keys(perms).filter(p => perms[p]);
        const result = await createApiKey(tenantId, name, selectedPerms);
        setGeneratedKey(result.rawKey);
        if (onSuccess) onSuccess();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetAndClose = () => {
        setGeneratedKey(null);
        setName('');
        setPerms({ publish_project: true, read_pages: true });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={generatedKey ? null : resetAndClose}
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-md' }}
        >
            <DialogTitle className="!font-black text-2xl flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Key size={24} />
                </div>
                {generatedKey ? 'API Key Generated' : 'Generate Secret Key'}
            </DialogTitle>
            
            <DialogContent className="space-y-6 !pt-4">
                {generatedKey ? (
                    <div className="space-y-6">
                        <Alert icon={<ShieldCheck className="text-emerald-500" />} className="!bg-emerald-50 !text-emerald-800 !border-emerald-100 !rounded-2xl">
                            <b>Store this key safely!</b> It will never be shown again. We only store a cryptographic hash of this key.
                        </Alert>
                        
                        <div className="space-y-2">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your New Secret Key</p>
                             <div className="bg-slate-900 rounded-2xl p-4 pr-12 relative group border border-white/10">
                                <code className="text-indigo-300 font-mono text-sm break-all">
                                    {generatedKey}
                                </code>
                                <IconButton 
                                    onClick={handleCopy}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 !text-white/40 hover:!text-white"
                                >
                                    {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                </IconButton>
                             </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                            <Info size={16} className="text-slate-400 mt-0.5" />
                            <p className="text-xs text-slate-500 font-medium">Use this key in your CI/CD pipelines or headless SDK headers as <code>Authorization: Bearer [KEY]</code></p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-500 text-sm font-medium">Create a scoped secret to integrate FlexiSite with your external ecosystem.</p>
                        
                        <TextField
                            fullWidth
                            label="Key Name"
                            placeholder="e.g. GitHub Actions - Production"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="!bg-slate-50 rounded-xl"
                        />

                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Scope & Permissions</p>
                            <FormGroup className="grid grid-cols-1 gap-1">
                                {AVAILABLE_PERMISSIONS.map((p) => (
                                    <FormControlLabel
                                        key={p.id}
                                        control={
                                            <Checkbox 
                                                checked={!!perms[p.id]} 
                                                onChange={(e) => setPerms({...perms, [p.id]: e.target.checked})}
                                                className="!text-indigo-600"
                                            />
                                        }
                                        label={
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{p.label}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{p.desc}</span>
                                            </div>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </div>
                    </>
                )}
            </DialogContent>
            
            <DialogActions className="!p-4 !pt-0">
                {generatedKey ? (
                    <Button 
                        fullWidth
                        variant="contained" 
                        onClick={resetAndClose}
                        className="!bg-slate-900 !text-white !font-bold !py-3 !rounded-2xl !normal-case shadow-xl"
                    >
                        I've saved the key
                    </Button>
                ) : (
                    <>
                        <Button onClick={resetAndClose} className="!text-slate-500 !font-bold !normal-case">Cancel</Button>
                        <Button 
                            variant="contained" 
                            onClick={handleCreate}
                            disabled={!name}
                            className="!bg-indigo-600 !text-white !font-bold !px-8 !py-2.5 !rounded-2xl !normal-case shadow-lg shadow-indigo-500/20"
                        >
                            Generate Key
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CreateApiKeyModal;
