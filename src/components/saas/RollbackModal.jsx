import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Alert 
} from '@mui/material';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

const RollbackModal = ({ open, onClose, targetVersion, onConfirm }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-sm' }}
        >
            <DialogContent className="space-y-6 !pt-4 text-center">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <RotateCcw size={32} />
                </div>
                
                <div>
                    <h3 className="text-xl font-black text-slate-900">Rollback to {targetVersion}?</h3>
                    <p className="text-sm text-slate-500 mt-2">
                        This will immediately re-point your production domains to the build artifacts from <b>{targetVersion}</b>.
                    </p>
                </div>

                <Alert 
                    severity="warning"
                    icon={<AlertTriangle />} 
                    className="!bg-amber-50 !text-amber-800 !border-amber-100 !rounded-2xl text-left"
                >
                    Any CSS or content changes made in newer versions will be lost on the live site after this action.
                </Alert>
            </DialogContent>
            
            <DialogActions className="!p-4 !pt-0 flex flex-col gap-2">
                <Button 
                    fullWidth
                    variant="contained" 
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="!bg-amber-600 !text-white !font-black !py-3 !rounded-xl !normal-case shadow-xl shadow-amber-500/20"
                >
                    Confirm Rollback
                </Button>
                <Button onClick={onClose} className="!text-slate-500 !font-bold !normal-case">Cancel Action</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RollbackModal;
