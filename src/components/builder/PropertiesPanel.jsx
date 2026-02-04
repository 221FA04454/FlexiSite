import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useProjectStore } from '../../store/projectStore';
import { useTemplateStore } from '../../store/templateStore';
import { COMPONENT_REGISTRY } from '../registry.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const PropertiesPanel = () => {
    const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
    const selectNode = useEditorStore((state) => state.selectNode); 
    const viewPort = useEditorStore((state) => state.viewPort); // Active Viewport
    
    const pages = useProjectStore((state) => state.pages);
    const activePageId = useProjectStore((state) => state.activePageId);
    const activePage = pages[activePageId];
    const nodes = activePage?.tree?.entities || {};

    const updateNodeProps = useProjectStore((state) => state.updateNodeProps);
    const updateNodeStyle = useProjectStore((state) => state.updateNodeStyle);
    const removeNode = useProjectStore((state) => state.removeNode);
    const cloneNode = useProjectStore((state) => state.cloneNode);
    const saveSectionAsTemplate = useProjectStore((state) => state.saveSectionAsTemplate);
    const addTemplate = useTemplateStore((state) => state.addTemplate);

    const [activeTab, setActiveTab] = useState('settings'); 

    const node = selectedNodeId ? nodes[selectedNodeId] : null;

    if (!node) {
        return (
            <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    ✨
                </div>
                <span className="text-sm font-medium">Select an element to edit</span>
            </div>
        );
    }

    const componentDef = COMPONENT_REGISTRY[node.type];
    
    // Handlers
    const handlePropChange = (key, value) => {
        updateNodeProps(node.id, { [key]: value });
    };

    const handleStyleChange = (key, value) => {
        if (['width', 'height', 'fontSize', 'padding', 'margin', 'borderRadius', 'gap'].includes(key) && !isNaN(value) && value !== '') {
            value = `${value}px`;
        }
        updateNodeStyle(node.id, { [key]: value }, viewPort);
    };

    const handleDelete = () => {
        if(window.confirm(`Delete this ${node.type}?`)) {
            selectNode(null);
            removeNode(node.id);
        }
    };

    const handleClone = () => {
        cloneNode(node.id);
    };

    return (
        <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{node.type}</span>
                   <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">#{node.id.split('_')[1] || 'root'}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={handleClone} 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                        title="Duplicate Element"
                    >
                        <ContentCopyIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                        title="Delete Element"
                    >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                {['settings', 'style', 'project'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {activeTab === 'settings' && (
                    <div className="space-y-4">
                        {componentDef?.propSchema && Object.entries(componentDef.propSchema).map(([key, schema]) => {
                            const value = node.props[key] || '';
                            return (
                                <div key={key} className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize px-1">{schema.label || key}</label>
                                    {schema.type === 'select' ? (
                                        <select value={value} onChange={(e) => handlePropChange(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all">
                                            {schema.options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                                        </select>
                                    ) : schema.type === 'textarea' ? (
                                        <textarea value={value} onChange={(e) => handlePropChange(key, e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all" />
                                    ) : (
                                        <input type={schema.type || 'text'} value={value} onChange={(e) => handlePropChange(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium" />
                                    )}
                                </div>
                            );
                        })}
                        {(!componentDef?.propSchema || Object.keys(componentDef.propSchema).length === 0) && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3 animate-pulse">?</div>
                                <p className="text-[11px] text-slate-400 font-bold italic px-4 leading-relaxed">NO CONFIGURABLE <br/> SETTINGS FOR THIS ELEMENT.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'style' && (
                    <div className="space-y-6">
                         <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Typography</h3>
                            <div className="grid grid-cols-2 gap-3 p-1">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Color</label>
                                    <input type="color" className="w-full h-10 rounded-lg cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all bg-transparent" onChange={(e) => handleStyleChange('color', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Size (px)</label>
                                    <input type="number" className="w-full p-2 text-sm border-2 border-slate-100 rounded-lg dark:bg-slate-800 dark:border-slate-800 focus:border-indigo-500 transition-all" onChange={(e) => handleStyleChange('fontSize', e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Layout</h3>
                            <div className="grid grid-cols-2 gap-3 p-1">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Background</label>
                                    <input type="color" className="w-full h-10 rounded-lg cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all bg-transparent" onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Padding (px)</label>
                                    <input type="text" placeholder="20" className="w-full p-2 text-sm border-2 border-slate-100 rounded-lg dark:bg-slate-800 dark:border-slate-800 focus:border-indigo-500 transition-all" onChange={(e) => handleStyleChange('padding', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'project' && (
                   <div className="space-y-8">
                       <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                           <h3 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-indigo-500 pulse"></span>
                               Design System
                           </h3>
                           <p className="text-[10px] text-indigo-600 dark:text-indigo-300 font-medium leading-relaxed">Manage project-wide styles and global tokens here.</p>
                       </div>
                       <div className="space-y-4">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Colors</h4>
                           <div className="space-y-3">
                               {[
                                   { label: 'Primary Brand', key: 'primary', cat: 'colors' },
                                   { label: 'Secondary', key: 'secondary', cat: 'colors' },
                                   { label: 'Surface/BG', key: 'background', cat: 'colors' },
                                   { label: 'Content/Text', key: 'text', cat: 'colors' }
                               ].map((col) => (
                                   <div key={col.key} className="flex items-center justify-between group">
                                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{col.label}</span>
                                       <input type="color" value={useProjectStore.getState().globalStyles[col.cat][col.key]} onChange={(e) => useProjectStore.getState().setGlobalStyle(col.cat, col.key, e.target.value)} className="w-10 h-6 rounded cursor-pointer border-none bg-transparent" />
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <button 
                    onClick={() => {
                        const name = window.prompt(`Enter a name for this ${node.type} template:`, `${node.type} Template`);
                        if (name) {
                            const tmplData = saveSectionAsTemplate(node.id, name);
                            if (tmplData) {
                                addTemplate(tmplData);
                                alert(`"${name}" saved to Template Gallery!`);
                            }
                        }
                    }}
                    className="w-full py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                    <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                    Save as Template
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
