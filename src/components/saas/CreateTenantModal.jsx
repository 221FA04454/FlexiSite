import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, InputAdornment 
} from '@mui/material';
import { Globe, Building2, AlignLeft } from 'lucide-react';
import { useTenantStore } from '../../store/saas/tenantStore';

const CreateTenantModal = ({ open, onClose }) => {
    const { createTenant } = useTenantStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [prefix, setPrefix] = useState('');

    const handleCreate = () => {
        if (!name) return;
        createTenant({ name, description, domainPrefix: prefix });
        onClose();
        setName('');
        setDescription('');
        setPrefix('');
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-md bg-white/90 backdrop-blur-xl' }}
        >
            <DialogTitle className="!font-black !text-2xl !text-slate-900 !pb-1">Create Workspace</DialogTitle>
            <DialogContent className="space-y-6 !pt-4">
                <p className="text-slate-500 text-sm">Organize your projects, domains, and teams in a dedicated multi-tenant container.</p>
                
                <div className="space-y-4">
                    <TextField
                        fullWidth
                        label="Workspace Name"
                        placeholder="e.g. Acme Production"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            // Auto-generate prefix
                            setPrefix(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Building2 size={18} className="text-slate-400" />
                                </InputAdornment>
                            ),
                        }}
                        className="!bg-slate-50 rounded-xl"
                    />

                    <TextField
                        fullWidth
                        label="Domain Prefix"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Globe size={18} className="text-slate-400" />
                                </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end" className="text-slate-400 font-bold text-xs">.flexisite.app</InputAdornment>
                        }}
                        className="!bg-slate-50 rounded-xl"
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description (Optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" className="pt-2">
                                    <AlignLeft size={18} className="text-slate-400" />
                                </InputAdornment>
                            ),
                        }}
                        className="!bg-slate-50 rounded-xl"
                    />
                </div>
            </DialogContent>
            <DialogActions className="!p-4 !pt-0">
                <Button onClick={onClose} className="!text-slate-500 !font-bold !normal-case">Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleCreate} 
                    disabled={!name}
                    className="!bg-indigo-600 !text-white !font-bold !px-8 !py-2.5 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20"
                >
                    Create Workspace
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTenantModal;
