import React, { useState } from 'react';
import { useDomainStore } from '../../store/saas/domainStore';
import { useTenantStore } from '../../store/saas/tenantStore';
import { 
    Card, CardContent, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Alert, AlertTitle
} from '@mui/material';
import { Globe, Plus, Trash2, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

const DomainManager = () => {
    const { activeTenantId } = useTenantStore();
    const { domains, addDomain, removeDomain, verifyDomain } = useDomainStore();
    const [openAdd, setOpenAdd] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [selectedProject, setSelectedProject] = useState('proj_default');

    const tenantDomains = domains[activeTenantId] || [];

    const handleAdd = () => {
        if (newDomain) {
            addDomain(activeTenantId, newDomain, selectedProject);
            setOpenAdd(false);
            setNewDomain('');
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Domain Management</h1>
                    <p className="text-slate-500 mt-1">Connect custom domains and manage SSL certificates.</p>
                </div>
                <Button 
                    variant="contained" 
                    startIcon={<Plus size={18} />}
                    onClick={() => setOpenAdd(true)}
                    className="!bg-indigo-600 !rounded-xl !px-6 !py-2.5 !normal-case !font-semibold"
                >
                    Add Custom Domain
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Card className="!border-none !shadow-sm !rounded-2xl overflow-hidden">
                        <TableContainer>
                            <Table>
                                <TableHead className="bg-slate-50 dark:bg-slate-900/50">
                                    <TableRow>
                                        <TableCell className="!font-bold !text-slate-500">Domain</TableCell>
                                        <TableCell className="!font-bold !text-slate-500">Project Mapping</TableCell>
                                        <TableCell className="!font-bold !text-slate-500">Status</TableCell>
                                        <TableCell className="!font-bold !text-slate-500">SSL</TableCell>
                                        <TableCell className="!font-bold !text-slate-500">Health</TableCell>
                                        <TableCell className="!font-bold !text-slate-500">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tenantDomains.length > 0 ? tenantDomains.map((dom) => (
                                        <TableRow key={dom.id} hover className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Globe size={16} className="text-slate-400" />
                                                    <span className="font-bold text-slate-800 dark:text-white">{dom.domain}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={dom.projectId} size="small" variant="outlined" className="!text-[10px]" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    {dom.status === 'verified' ? (
                                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                                    ) : (
                                                        <AlertTriangle size={14} className="text-amber-500" />
                                                    )}
                                                    <span className={`text-xs font-bold uppercase ${dom.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {dom.status}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldCheck size={14} className={dom.ssl === 'active' ? 'text-blue-500' : 'text-slate-300'} />
                                                    <span className="text-xs font-medium text-slate-500">{dom.ssl}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={dom.health} 
                                                    size="small" 
                                                    className={`!text-[10px] !font-bold ${dom.health === 'online' ? '!bg-emerald-50 !text-emerald-700' : '!bg-slate-100'}`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <IconButton size="small" onClick={() => verifyDomain(activeTenantId, dom.id)} className="!text-indigo-600"><RefreshCw size={16} /></IconButton>
                                                    <IconButton size="small" onClick={() => removeDomain(activeTenantId, dom.id)} className="!text-red-500"><Trash2 size={16} /></IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center !py-10 text-slate-400">
                                                No custom domains configured.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>

                    {/* DNS Instructions (Shown if domains exist) */}
                    {tenantDomains.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="!border-none !shadow-sm !rounded-2xl bg-slate-900 text-white">
                                <CardContent className="p-6">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <ArrowRight size={18} className="text-indigo-400" /> DNS Configuration (A Record)
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4">Point your root domain to our globally distributed edge network.</p>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center tabular-nums">
                                            <span className="text-slate-500 text-xs">Type</span>
                                            <span className="font-mono text-indigo-300">A</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center tabular-nums">
                                            <span className="text-slate-500 text-xs">Value</span>
                                            <code className="font-mono text-emerald-400">76.76.21.21</code>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="!border-none !shadow-sm !rounded-2xl bg-slate-900 text-white">
                                <CardContent className="p-6">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <ArrowRight size={18} className="text-indigo-400" /> DNS Configuration (CNAME)
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4">Use CNAME records for subdomains (e.g. app.yourbrand.com).</p>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                                            <span className="text-slate-500 text-xs">Name</span>
                                            <span className="font-mono text-indigo-300">www</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                                            <span className="text-slate-500 text-xs">Target</span>
                                            <code className="font-mono text-emerald-400">cname.flexisite.cdn</code>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Alert icon={<ShieldCheck className="text-indigo-600" />} className="!rounded-2xl !border-none !shadow-sm !bg-indigo-50 !text-indigo-900">
                        <AlertTitle className="!font-bold">Automated SSL Deployment</AlertTitle>
                        We automatically provision Let's Encrypt Wildcard certificates for all verified domains within 60 seconds of propagation.
                    </Alert>

                    <Card className="!border-none !shadow-sm !rounded-2xl">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Propagation Status</h3>
                            <div className="space-y-4">
                                {[
                                    { loc: 'New York', status: 'verified', lag: '42ms' },
                                    { loc: 'London', status: 'verified', lag: '112ms' },
                                    { loc: 'Singapore', status: 'pending', lag: '---' }
                                ].map((node, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">{node.loc}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 tabular-nums">{node.lag}</span>
                                            <div className={`w-2 h-2 rounded-full ${node.status === 'verified' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Domain Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} PaperProps={{ className: '!rounded-2xl w-full max-w-sm' }}>
                <DialogTitle className="!font-bold">Add Custom Domain</DialogTitle>
                <DialogContent className="space-y-4 !pt-2">
                    <TextField
                        fullWidth
                        label="Domain URL"
                        placeholder="e.g. company.com"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Map to Project</InputLabel>
                        <Select
                            value={selectedProject}
                            label="Map to Project"
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <MenuItem value="proj_default">Portfolio Site (Main)</MenuItem>
                            <MenuItem value="proj_2">Product Landing</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions className="!p-4 border-t">
                    <Button onClick={() => setOpenAdd(false)} className="!text-slate-500">Cancel</Button>
                    <Button variant="contained" onClick={handleAdd} disabled={!newDomain} className="!bg-indigo-600 !rounded-lg">Connect Domain</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DomainManager;
