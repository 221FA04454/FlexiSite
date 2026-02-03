import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useProjectStore } from '../../store/projectStore';
import { COMPONENT_REGISTRY } from '../registry.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
        // Simple pixel appending for known dimension keys
        if (['width', 'height', 'fontSize', 'padding', 'margin', 'borderRadius', 'gap'].includes(key) && !isNaN(value) && value !== '') {
            value = `${value}px`;
        }
        updateNodeStyle(node.id, { [key]: value }, viewPort); // <-- Dynamic Viewport
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
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Settings
                </button>
                <button 
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'style' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Styles
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* --- SETTINGS TAB --- */}
                {activeTab === 'settings' && (
                    <div className="space-y-4">
                        {componentDef?.propSchema && Object.entries(componentDef.propSchema).map(([key, schema]) => {
                            const value = node.props[key] || '';
                            
                            return (
                                <div key={key} className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize px-1">
                                        {schema.label || key}
                                    </label>
                                    
                                    {schema.type === 'select' ? (
                                        <select 
                                            value={value}
                                            onChange={(e) => handlePropChange(key, e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        >
                                            {schema.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : schema.type === 'textarea' ? (
                                        <textarea 
                                            value={value}
                                            onChange={(e) => handlePropChange(key, e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                        />
                                    ) : (
                                        <input 
                                            type={schema.type || 'text'} 
                                            value={value} 
                                            onChange={(e) => handlePropChange(key, e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    )}
                                </div>
                            );
                        })}
                        
                        {(!componentDef?.propSchema || Object.keys(componentDef.propSchema).length === 0) && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                                    ?
                                </div>
                                <p className="text-xs text-slate-400 font-medium italic px-4">
                                    No configurable settings for this element.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- STYLE TAB --- */}
                {activeTab === 'style' && (
                    <div className="space-y-6">
                         {/* Typography */}
                         <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Typography</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400">Color</label>
                                    <input type="color" className="w-full h-8 rounded cursor-pointer" 
                                        onChange={(e) => handleStyleChange('color', e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400">Size (px)</label>
                                    <input type="number" className="w-full p-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" 
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400">Align</label>
                                    <select className="w-full p-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700"
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        {/* Layout */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Layout</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400">Background</label>
                                    <input type="color" className="w-full h-8 rounded cursor-pointer" 
                                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400">Padding</label>
                                    <input type="text" placeholder="e.g. 10" className="w-full p-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" 
                                        onChange={(e) => handleStyleChange('padding', e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                         <hr className="border-slate-100 dark:border-slate-800" />

                         {/* Border */}
                         <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Border</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400">Radius</label>
                                    <input type="text" placeholder="px" className="w-full p-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" 
                                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PropertiesPanel;
