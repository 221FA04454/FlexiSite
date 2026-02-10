import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Copy, CheckCircle2 } from 'lucide-react';

const RecordRow = ({ type, name, value }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group transition-all hover:bg-white dark:hover:bg-slate-800">
            <div className="w-16">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg">{type}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Host Name</p>
                <p className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate">{name}</p>
            </div>
            <div className="flex-[2] min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Points To / Value</p>
                <p className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate">{value}</p>
            </div>
            <Tooltip title={copied ? "Copied!" : "Copy Value"}>
                <IconButton onClick={handleCopy} size="small" className="!bg-white dark:!bg-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </IconButton>
            </Tooltip>
        </div>
    );
};

const DNSRecordsBlock = ({ domainName }) => {
    const isRoot = !domainName.startsWith('www.');
    
    return (
        <div className="space-y-4">
            <div className="bg-indigo-600 p-6 rounded-3xl text-white mb-6">
                <h3 className="text-lg font-black mb-1">Configuration Required</h3>
                <p className="text-indigo-100 text-sm opacity-80">Add these records to your domain registrar (GoDaddy, Cloudflare, etc.) to point <b>{domainName}</b> to the FlexiSite CDN.</p>
            </div>

            <div className="space-y-3">
                {isRoot ? (
                    <>
                        <RecordRow type="A" name="@" value="123.45.67.89" />
                        <RecordRow type="CNAME" name="www" value="cname.flexisite.net" />
                    </>
                ) : (
                    <RecordRow type="CNAME" name="www" value="cname.flexisite.net" />
                )}
                <RecordRow type="TXT" name="_flexisite-challenge" value={`fs-verify-${domainName.split('.')[0]}`} />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 italic">Note: DNS propagation can take anywhere from a few minutes to 48 hours depending on your registrar TTL settings.</p>
            </div>
        </div>
    );
};

export default DNSRecordsBlock;
