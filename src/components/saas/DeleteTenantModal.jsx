import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField 
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const DeleteTenantModal = ({ open, onClose, tenantName, onConfirm }) => {
    const [confirmName, setConfirmName] = useState('');

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-sm' }}
        >
            <DialogContent className="space-y-6 !pt-4 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                
                <div>
                    <h3 className="text-xl font-black text-slate-900">Delete Workspace?</h3>
                    <p className="text-sm text-slate-500 mt-2">
                        This action is <b>permanent</b>. All projects, domains, and data for <b>{tenantName}</b> will be destroyed.
                    </p>
                </div>

                <div className="text-left bg-slate-50 p-4 rounded-xl space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Type the workspace name to confirm</p>
                    <TextField
                        fullWidth
                        placeholder={tenantName}
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        className="!bg-white rounded-lg"
                        size="small"
                    />
                </div>
            </DialogContent>
            <DialogActions className="!p-4 !pt-0 flex flex-col gap-2">
                <Button 
                    fullWidth
                    variant="contained" 
                    color="error"
                    disabled={confirmName !== tenantName}
                    onClick={() => {
                        onConfirm();
                        onClose();
                        setConfirmName('');
                    }}
                    className="!bg-red-600 !text-white !font-bold !py-3 !rounded-xl !normal-case"
                >
                    Permanently Delete Workspace
                </Button>
                <Button onClick={onClose} className="!text-slate-500 !font-bold !normal-case">I changed my mind</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteTenantModal;
