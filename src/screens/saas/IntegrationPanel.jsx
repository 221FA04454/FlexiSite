import React, { useState } from 'react';
import { useIntegrationStore } from '../../store/saas/integrationStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { 
    Card, CardContent, Button, Chip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Tooltip
} from '@mui/material';
import { 
    Code2, Share2, Zap, Globe, Trash2, Plus, 
    Copy, ExternalLink, MessageSquare, Terminal
} from 'lucide-react';

const IntegrationPanel = () => {
    const { activeTenantId } = useTenantStore();
    const { integrations, addWebhook, updateAllowedDomains } = useIntegrationStore();
    const [openWebhook, setOpenWebhook] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState('');

    const integrationData = integrations[activeTenantId] || { allowedDomains: [], webhooks: [] };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Code snippet copied!');
    };

    const embedCode = `<script 
  src="https://cdn.flexisite.io/embed.js"
  data-project="proj_${activeTenantId.split('_')[1] || 'default'}"
  data-page="home">
</script>`;

    const widgetCode = `<script 
  src="https://cdn.flexisite.io/widget.js"
  data-component="ContactForm"
  data-tenant="${activeTenantId}">
</script>`;

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">External Integrations</h1>
                    <p className="text-slate-500 mt-1">Expose your content as Micro-frontends and Webhooks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Embed SDK Section */}
                <div className="space-y-6">
                    <Card className="!border-none !shadow-sm !rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Code2 size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Universal Embed SDK</h3>
                                    <p className="text-xs text-slate-500">Render full pages in any native HTML environment.</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <pre className="bg-slate-950 text-indigo-300 p-6 rounded-2xl font-mono text-xs overflow-x-auto">
                                    {embedCode}
                                </pre>
                                <Button 
                                    startIcon={<Copy size={16} />}
                                    onClick={() => copyToClipboard(embedCode)}
                                    className="!absolute !right-4 !top-4 !bg-indigo-600/20 !text-indigo-400 !text-xs !py-1 !px-3 !rounded-lg !normal-case"
                                >
                                    Copy Script
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="!border-none !shadow-sm !rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-pink-50 text-pink-600 rounded-xl"><Zap size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Interactive Component Widgets</h3>
                                    <p className="text-xs text-slate-500">Inject specific modules (Forms, CTAs) into existing apps.</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <pre className="bg-slate-950 text-indigo-300 p-6 rounded-2xl font-mono text-xs overflow-x-auto">
                                    {widgetCode}
                                </pre>
                                <Button 
                                    startIcon={<Copy size={16} />}
                                    onClick={() => copyToClipboard(widgetCode)}
                                    className="!absolute !right-4 !top-4 !bg-pink-600/20 !text-pink-400 !text-xs !py-1 !px-3 !rounded-lg !normal-case"
                                >
                                    Copy Widget
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Governance & Webhooks */}
                <div className="space-y-6">
                    <Card className="!border-none !shadow-sm !rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Share2 size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-lg">Outgoing Webhooks</h3>
                                        <p className="text-xs text-slate-500">Post event data to external API endpoints.</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    startIcon={<Plus size={16} />}
                                    onClick={() => setOpenWebhook(true)}
                                    className="!rounded-lg !border-slate-200 !text-slate-600 !normal-case"
                                >
                                    New Hook
                                </Button>
                            </div>
                            
                            <TableContainer>
                                <Table size="small">
                                    <TableHead className="bg-slate-50 dark:bg-slate-900/50">
                                        <TableRow>
                                            <TableCell className="!font-bold !text-slate-500">Endpoint URL</TableCell>
                                            <TableCell className="!font-bold !text-slate-500">Events</TableCell>
                                            <TableCell className="!font-bold !text-slate-500">Status</TableCell>
                                            <TableCell className="!font-bold !text-slate-500"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {integrationData.webhooks.map((wh) => (
                                            <TableRow key={wh.id}>
                                                <TableCell className="text-xs font-mono">{wh.url.substring(0, 30)}...</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        {wh.events.map(e => <Chip key={e} label={e} size="small" className="!text-[9px] !h-5" />)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={wh.status} size="small" className="!bg-emerald-100 !text-emerald-700 !text-[9px] !h-5 !font-bold" />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" className="!text-red-500"><Trash2 size={14} /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card className="!border-none !shadow-sm !rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Globe size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-lg">CORS Policy (Allowed Domains)</h3>
                                    <p className="text-xs text-slate-500">Only authorized domains can fetch and render your project JSON.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {integrationData.allowedDomains.map((dom, i) => (
                                    <Chip 
                                        key={i} 
                                        label={dom} 
                                        onDelete={() => {}} 
                                        className="!bg-slate-100 !text-slate-700 !font-medium" 
                                    />
                                ))}
                                <Button size="small" className="!text-indigo-600 !normal-case !font-bold">+ Add Origin</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* PostMessage Bridge Tester */}
            <Card className="!border-none !shadow-sm !rounded-2xl bg-slate-900 text-white overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Terminal size={24} className="text-indigo-400" />
                        <div>
                            <h3 className="font-bold">PostMessage™ Bridge Tester</h3>
                            <p className="text-xs text-slate-400">Test two-way communication between Host and FlexiSite Widget.</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 border-r border-white/5 space-y-4">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Inbound (Host → CMS)</p>
                        <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1">
                            <p>{`window.postMessage({`}</p>
                            <p className="pl-4">{`type: 'FS_UPDATE_THEME',`}</p>
                            <p className="pl-4">{`payload: { primary: '#6366f1' }`}</p>
                            <p>{`}, '*');`}</p>
                        </div>
                        <Button variant="contained" className="!bg-indigo-600 !rounded-lg !normal-case !text-xs !py-1">Simulate Theme Update</Button>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Outbound (CMS → Host)</p>
                        <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-slate-400 min-h-[80px]">
                            <p className="text-emerald-400 animate-pulse">{'>'} Listening for events...</p>
                            {/* Simulated log */}
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Listening for FS_BUTTON_CLICK, FS_FORM_SUBMIT...</p>
                    </div>
                </div>
            </Card>

            {/* Create Webhook Dialog */}
            <Dialog open={openWebhook} onClose={() => setOpenWebhook(false)} PaperProps={{ className: '!rounded-2xl w-full max-w-sm' }}>
                <DialogTitle className="!font-bold">Register Webhook</DialogTitle>
                <DialogContent className="space-y-4 !pt-2">
                    <TextField
                        fullWidth
                        label="Destination URL"
                        placeholder="https://api.myapp.com/webhooks"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    <p className="text-xs font-bold text-slate-500 uppercase">Trigger Events</p>
                    <div className="flex flex-wrap gap-2">
                        {['publish', 'delete', 'update', 'seo_change'].map(ev => (
                            <Chip key={ev} label={ev} variant="outlined" className="!text-[10px]" />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions className="!p-4 border-t">
                    <Button onClick={() => setOpenWebhook(false)} className="!text-slate-500">Cancel</Button>
                    <Button variant="contained" className="!bg-indigo-600 !rounded-lg">Activate Hook</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default IntegrationPanel;
