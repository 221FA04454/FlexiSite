import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, 
    DialogActions, Button, Box 
} from '@mui/material';
import { AlertCircle, Rocket, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

const LimitWarningModal = ({ open, onClose, onUpgrade, resourceName, limitValue }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{ className: '!rounded-[2.5rem] !max-w-md !w-full' }}
        >
            <DialogContent className="!p-10 text-center">
                <div className="mx-auto w-20 h-20 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center mb-6">
                    <ShieldAlert size={40} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Resource Ceiling Hit</h3>
                <p className="text-slate-500 font-medium mt-3 leading-relaxed">
                    You've reached your plan's maximum entitlement for <span className="text-slate-900 font-black">"{resourceName}"</span>.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mt-6 flex flex-col items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Quota</p>
                    <p className="text-2xl font-black text-slate-900">{limitValue.toLocaleString()}</p>
                </div>

                <div className="mt-10 space-y-3">
                    <Button 
                        fullWidth 
                        onClick={onUpgrade}
                        variant="contained" 
                        startIcon={<Rocket size={18} />}
                        className="!bg-indigo-600 !text-white !font-black !py-4 !rounded-2xl !normal-case !text-base shadow-xl shadow-indigo-500/20"
                    >
                        Expand Infrastructure
                    </Button>
                    <Button 
                        fullWidth 
                        onClick={onClose}
                        className="!text-slate-400 !font-bold !normal-case !py-3"
                    >
                        Resolve Later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LimitWarningModal;
