import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { AlertCircle, Trash2 } from 'lucide-react';

const DeleteLogModal = ({ open, onClose, onConfirm, logId }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{ className: '!rounded-3xl !max-w-sm !w-full' }}
        >
            <DialogTitle className="!font-black text-xl flex items-center gap-2 text-pink-600">
                <AlertCircle size={24} />
                Delete Entry?
            </DialogTitle>
            <DialogContent>
                <p className="text-slate-500 font-medium">
                    Are you sure you want to permanently delete log entry <span className="font-mono text-slate-900 font-bold">{logId}</span>? This action is irreversible and will remove the record from the audit trail.
                </p>
            </DialogContent>
            <DialogActions className="!p-6 gap-2">
                <Button 
                    onClick={onClose} 
                    className="!text-slate-500 !font-bold !normal-case !rounded-xl"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    variant="contained" 
                    color="error"
                    startIcon={<Trash2 size={18} />}
                    className="!bg-pink-600 !font-black !normal-case !rounded-xl !px-6"
                >
                    Confirm Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteLogModal;
