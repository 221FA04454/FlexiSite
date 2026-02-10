import React, { useState } from 'react';
import { Button, Avatar } from '@mui/material';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const TenantLogoUploader = ({ value, onChange, label = "Tenant Logo" }) => {
    const [preview, setPreview] = useState(value);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target.result;
            setPreview(result);
            onChange(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</label>
            <div className="flex items-center gap-6 p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                <Avatar 
                    src={preview} 
                    sx={{ width: 80, height: 80 }} 
                    className="!bg-white dark:!bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner"
                >
                    <ImageIcon size={32} className="text-slate-300" />
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<Upload size={16} />}
                            className="!normal-case !font-bold !rounded-xl !border-slate-200 !text-slate-700 dark:!text-slate-300"
                        >
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={handleFile} />
                        </Button>
                        {preview && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => { setPreview(null); onChange(null); }}
                                className="!normal-case !font-bold !rounded-xl"
                            >
                                <X size={16} />
                            </Button>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Recommended: 512x512px SVG, PNG or WebP. Max 2MB.</p>
                </div>
            </div>
        </div>
    );
};

export default TenantLogoUploader;
