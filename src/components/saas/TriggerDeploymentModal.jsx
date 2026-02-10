import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Alert, Box 
} from '@mui/material';
import { Rocket, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { useDeploymentStore } from '../../store/saas/deploymentStore';
import { useUsageStore } from '../../store/saas/usageStore';

const TriggerDeploymentModal = ({ open, onClose, projectId, tenantId }) => {
    const { triggerDeployment } = useDeploymentStore();
    const { incrementUsage } = useUsageStore();
    const [confirming, setConfirming] = useState(false);

    const handleDeploy = async () => {
        setConfirming(true);
        await triggerDeployment(projectId, tenantId);
        incrementUsage(tenantId, 'buildsTriggered');
        setConfirming(false);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ className: '!rounded-3xl !p-2 w-full max-w-md' }}
        >
            <DialogTitle className="!font-black text-2xl flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Rocket size={24} />
                </div>
                Publish Project
            </DialogTitle>
            
            <DialogContent className="space-y-6 !pt-4">
                <p className="text-slate-500 text-sm font-medium">
                    This will trigger a production build. All changes made in the editor will be compiled, minified, and pushed to the global edge CDN.
                </p>

                <Alert 
                    icon={<ShieldCheck className="text-indigo-500" />} 
                    className="!bg-indigo-50 !text-indigo-800 !border-indigo-100 !rounded-2xl"
                >
                    <b>Immutable Versioning:</b> We automatically create a new version (v1.0.x) for every deployment to allow instant rollbacks.
                </Alert>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span>Project Source</span>
                        <span>Build Type</span>
                    </div>
                    <div className="flex justify-between items-center font-black text-slate-900">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-indigo-600" />
                            Corporate Theme
                        </div>
                        <span className="text-indigo-600">PRODUCTION</span>
                    </div>
                </div>
            </DialogContent>
            
            <DialogActions className="!p-4 !pt-0">
                <Button onClick={onClose} className="!text-slate-500 !font-bold !normal-case">Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleDeploy}
                    disabled={confirming}
                    className="!bg-indigo-600 !text-white !font-black !px-8 !py-2.5 !rounded-2xl !normal-case shadow-lg shadow-indigo-500/20"
                >
                    {confirming ? 'Initializing...' : 'Confirm Publish'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TriggerDeploymentModal;
