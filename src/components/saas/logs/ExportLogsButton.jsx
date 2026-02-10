import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Download, FileJson, FileCode, Check } from 'lucide-react';
import { useLogStore } from '../../../store/saas/logStore';
import { useTenantStore } from '../../../store/saas/tenantStore';

const ExportLogsButton = () => {
    const { exportLogs } = useLogStore();
    const { activeTenantId } = useTenantStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleExport = (format) => {
        exportLogs(activeTenantId, format);
        setAnchorEl(null);
    };

    return (
        <>
            <Button 
                variant="outlined" 
                startIcon={<Download size={18} />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                className="!border-slate-200 !text-slate-600 !font-bold !rounded-2xl !px-6 !normal-case h-12"
            >
                Export Audit Trail
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ className: '!rounded-2xl !shadow-2xl !mt-2 !border !border-slate-50' }}
            >
                <MenuItem onClick={() => handleExport('json')} className="!py-3 !px-6">
                    <ListItemIcon><FileJson size={18} className="text-indigo-600" /></ListItemIcon>
                    <ListItemText primary={<span className="font-bold text-slate-700">Export as JSON</span>} secondary="Full raw metadata structure" />
                </MenuItem>
                <MenuItem onClick={() => handleExport('csv')} className="!py-3 !px-6">
                    <ListItemIcon><FileCode size={18} className="text-emerald-600" /></ListItemIcon>
                    <ListItemText primary={<span className="font-bold text-slate-700">Export as CSV</span>} secondary="Excel-friendly event summary" />
                </MenuItem>
            </Menu>
        </>
    );
};

export default ExportLogsButton;
