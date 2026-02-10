import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Select, FormControl, InputLabel,
    InputAdornment
} from '@mui/material';
import { Globe, LayoutGrid, Info } from 'lucide-react';
import { useDomainStore } from '../../store/saas/domainStore';

const AddDomainModal = ({ open, onClose, tenantId, onSuccess }) => {
    const { addDomain } = useDomainStore();
    const [domainName, setDomainName] = useState('');
    const [projectId, setProjectId] = useState('proj_1'); // Mock project

    const handleSubmit = async () => {
        if (!domainName) return;
        await addDomain(tenantId, { domainName, projectId });
        if (onSuccess) onSuccess();
        onClose();
        setDomainName('');
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-sm' }}
        >
            <DialogTitle className="!font-black text-2xl !pb-1">Add Domain</DialogTitle>
            <DialogContent className="space-y-6 !pt-4">
                <p className="text-sm text-slate-500 font-medium">Connect your custom web address to a FlexiSite project.</p>

                <div className="space-y-5">
                    <TextField
                        fullWidth
                        label="Domain Name"
                        placeholder="example.com"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Globe size={18} className="text-slate-400" />
                                </InputAdornment>
                            ),
                        }}
                        className="!bg-slate-50 rounded-xl"
                    />

                    <FormControl fullWidth className="!bg-slate-50 rounded-xl">
                        <InputLabel>Map to Project</InputLabel>
                        <Select
                            value={projectId}
                            label="Map to Project"
                            onChange={(e) => setProjectId(e.target.value)}
                            startAdornment={<LayoutGrid size={18} className="text-slate-400 mr-2" />}
                        >
                            <MenuItem value="proj_1">Corporate Website</MenuItem>
                            <MenuItem value="proj_2">Product Landing Page</MenuItem>
                            <MenuItem value="proj_3">Support Portal</MenuItem>
                        </Select>
                    </FormControl>

                    <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-3">
                        <Info size={16} className="text-indigo-500 mt-0.5" />
                        <p className="text-[10px] text-indigo-700 font-bold leading-relaxed">
                            After adding, you will need to configure your DNS records to point to our global edge network.
                        </p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions className="!p-4 !pt-0">
                <Button onClick={onClose} className="!text-slate-500 !font-bold !normal-case">Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={!domainName}
                    className="!bg-indigo-600 !text-white !font-black !px-8 !py-2.5 !rounded-2xl !normal-case shadow-xl shadow-indigo-500/20"
                >
                    Connect Domain
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDomainModal;
