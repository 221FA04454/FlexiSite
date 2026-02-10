import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid, InputAdornment } from '@mui/material';
import { Save, Layout, FileText, Zap, HardDrive, BarChart3 } from 'lucide-react';

const TenantLimitsEditor = ({ limits, onSave }) => {
    const [formData, setFormData] = useState(limits);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden">
            <CardContent className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold">Workspace Quotas</h3>
                        <p className="text-sm text-slate-500">Define resource consumption limits for this tenant.</p>
                    </div>
                    <Button 
                        variant="contained" 
                        startIcon={<Save size={18} />}
                        onClick={() => onSave(formData)}
                        className="!bg-indigo-600 !rounded-xl !px-6 !py-2.5 !font-bold !normal-case shadow-lg shadow-indigo-500/20"
                    >
                        Save Limits
                    </Button>
                </div>

                <Grid container spacing={4}>
                    {[
                        { id: 'sites', label: 'Allowed Sites', icon: Layout, unit: 'Sites' },
                        { id: 'pages', label: 'Allowed Pages', icon: FileText, unit: 'Pages/Site' },
                        { id: 'builds', label: 'Monthly Builds', icon: Zap, unit: 'Builds' },
                        { id: 'storageMB', label: 'Storage Limit', icon: HardDrive, unit: 'MB' },
                        { id: 'analyticsEvents', label: 'Analytics Quota', icon: BarChart3, unit: 'Events/mo' },
                    ].map((item) => (
                        <Grid item xs={12} md={6} key={item.id}>
                            <TextField
                                fullWidth
                                type="number"
                                label={item.label}
                                value={formData[item.id]}
                                onChange={(e) => handleChange(item.id, parseInt(e.target.value) || 0)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <item.icon size={18} className="text-indigo-500" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: <InputAdornment position="end" className="text-[10px] font-bold text-slate-400 uppercase">{item.unit}</InputAdornment>
                                }}
                                className="!bg-slate-50 dark:!bg-slate-900 rounded-xl"
                            />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TenantLimitsEditor;
