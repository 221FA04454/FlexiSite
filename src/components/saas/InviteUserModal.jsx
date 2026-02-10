import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import { Mail, Shield } from 'lucide-react';
import { useTenantStore, ROLES } from '../../store/saas/tenantStore';

const InviteUserModal = ({ open, onClose, tenantId, onSuccess }) => {
    const { inviteUser } = useTenantStore();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(ROLES.EDITOR);

    const handleInvite = () => {
        if (!email) return;
        inviteUser(tenantId, email, role);
        if (onSuccess) onSuccess();
        onClose();
        setEmail('');
        setRole(ROLES.EDITOR);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-sm' }}
        >
            <DialogTitle className="!font-bold !text-xl !pb-1">Invite Member</DialogTitle>
            <DialogContent className="space-y-6 !pt-4">
                <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="teammate@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                        startAdornment: <Mail size={18} className="text-slate-400 mr-2" />,
                    }}
                    className="!bg-slate-50"
                />

                <FormControl fullWidth className="!bg-slate-50">
                    <InputLabel>Workspace Role</InputLabel>
                    <Select
                        value={role}
                        label="Workspace Role"
                        onChange={(e) => setRole(e.target.value)}
                        startAdornment={<Shield size={18} className="text-slate-400 mr-2" />}
                    >
                        <MenuItem value={ROLES.ADMIN} className="!py-3">
                            <div>
                                <p className="font-bold text-sm">Administrator</p>
                                <p className="text-[10px] text-slate-400">Can manage projects and API keys.</p>
                            </div>
                        </MenuItem>
                        <MenuItem value={ROLES.EDITOR} className="!py-3">
                            <div>
                                <p className="font-bold text-sm">Editor</p>
                                <p className="text-[10px] text-slate-400">Can modify projects but cannot publish.</p>
                            </div>
                        </MenuItem>
                        <MenuItem value={ROLES.VIEWER} className="!py-3">
                            <div>
                                <p className="font-bold text-sm">Viewer</p>
                                <p className="text-[10px] text-slate-400">Read-only access to analytics & projects.</p>
                            </div>
                        </MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions className="!p-4 !pt-0">
                <Button onClick={onClose} className="!text-slate-500 !font-bold">Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleInvite} 
                    disabled={!email}
                    className="!bg-indigo-600 !font-bold !px-6 !rounded-xl"
                >
                    Send Invitation
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteUserModal;
