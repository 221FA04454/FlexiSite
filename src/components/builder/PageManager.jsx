import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import PageSettingsModal from './PageSettingsModal';

const PageManager = () => {
    const pages = useProjectStore((state) => state.pages) || {};
    const activePageId = useProjectStore((state) => state.activePageId);
    
    // Actions
    const setActivePage = useProjectStore((state) => state.setActivePage);
    const createPage = useProjectStore((state) => state.createPage);
    const duplicatePage = useProjectStore((state) => state.duplicatePage);
    const deletePage = useProjectStore((state) => state.deletePage);
    const clearSelection = useEditorStore((state) => state.selectNode);

    // Local UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [settingsPageId, setSettingsPageId] = useState(null);

    const activePage = pages[activePageId];
    const pageList = Object.values(pages).sort((a, b) => a.metadata.createdAt - b.metadata.createdAt);

    const handleCreatePage = (e) => {
        e.preventDefault();
        if(!newPageName.trim()) return;
        
        createPage(newPageName);
        setNewPageName('');
        setIsCreating(false);
    };

    const handleSwitchPage = (id) => {
        if (id === activePageId) return;
        clearSelection(null); // Architect Goal: Clear selection on switch
        setActivePage(id);
        setIsOpen(false);
    };

    return (
        <div className="relative">
             {/* Dropdown Trigger */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold text-slate-700 dark:text-slate-200"
            >
                <DescriptionIcon fontSize="small" className="text-indigo-600" />
                <div className="flex flex-col items-start translate-y-[1px]">
                   <span className="leading-none text-[13px]">{activePage?.name || 'Home'}</span>
                   <span className="text-[9px] text-slate-400 font-mono tracking-tight uppercase">{activePage?.slug}</span>
                </div>
                <ExpandMoreIcon fontSize="small" className={`transition-transform text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Pages</span>
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{pageList.length}</span>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto py-2">
                            {pageList.map(page => (
                                <div 
                                    key={page.id} 
                                    className={`group px-3 py-1 transition-all ${activePageId === page.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all ${activePageId === page.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-500/30' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        <button
                                            onClick={() => handleSwitchPage(page.id)}
                                            className="flex-1 text-left"
                                        >
                                            <div className={`font-bold text-sm ${activePageId === page.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>{page.name}</div>
                                            <div className="text-[10px] opacity-50 font-mono mt-0.5">{page.slug}</div>
                                        </button>
                                        
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setSettingsPageId(page.id)}
                                                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                                                title="SEO & Settings"
                                            >
                                                <SettingsIcon sx={{ fontSize: 16 }} />
                                            </button>
                                            <button 
                                                onClick={() => duplicatePage(page.id)}
                                                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                                title="Duplicate Page"
                                            >
                                                <ContentCopyIcon sx={{ fontSize: 16 }} />
                                            </button>
                                            {pageList.length > 1 && (
                                                <button 
                                                    onClick={() => {
                                                        if(window.confirm(`Delete page "${page.name}"? This will delete all its content.`)) deletePage(page.id);
                                                    }}
                                                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete Page"
                                                >
                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                             {!isCreating ? (
                                <button 
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/10 active:scale-[0.98]"
                                >
                                    <AddIcon fontSize="small" />
                                    New Page
                                </button>
                             ) : (
                                <form onSubmit={handleCreatePage} className="flex flex-col gap-2">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Enter page name..." 
                                        className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 dark:border-slate-800 rounded-xl dark:bg-slate-800 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                        value={newPageName}
                                        onChange={(e) => setNewPageName(e.target.value)}
                                        onBlur={() => !newPageName && setIsCreating(false)}
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            type="submit"
                                            className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                                        >
                                            Create Page
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setIsCreating(false)}
                                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                             )}
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            {settingsPageId && (
                <PageSettingsModal 
                    pageId={settingsPageId} 
                    onClose={() => setSettingsPageId(null)} 
                />
            )}
        </div>
    );
};

export default PageManager;
