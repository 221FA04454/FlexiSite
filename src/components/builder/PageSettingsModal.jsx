import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PageSettingsModal = ({ pageId, onClose }) => {
    const pages = useProjectStore((state) => state.pages);
    const updatePageSEO = useProjectStore((state) => state.updatePageSEO);
    const updatePageSlug = useProjectStore((state) => state.updatePageSlug);
    const renamePage = useProjectStore((state) => state.renamePage);

    const page = pages[pageId];

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (page) {
            setName(page.name);
            setSlug(page.slug);
            setTitle(page.seo?.title || '');
            setDescription(page.seo?.description || '');
        }
    }, [page]);

    if (!page) return null;

    const handleSave = () => {
        renamePage(pageId, name);
        updatePageSlug(pageId, slug);
        updatePageSEO(pageId, { title, description });
        
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Page Settings</h2>
                        <p className="text-sm text-slate-500 mt-1 uppercase tracking-tighter font-mono">ID: {pageId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* General */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Page Name</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Slug / Route</label>
                            <input 
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* SEO */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">SEO Meta Data</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                                <span>SEO Title Tag</span>
                                <span className={title.length > 60 ? 'text-amber-500' : 'text-slate-400'}>{title.length}/60</span>
                            </label>
                            <input 
                                type="text"
                                value={title}
                                placeholder="Search engine result title..."
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                                <span>Meta Description</span>
                                <span className={description.length > 160 ? 'text-amber-500' : 'text-slate-400'}>{description.length}/160</span>
                            </label>
                            <textarea 
                                rows={3}
                                value={description}
                                placeholder="Brief summary of the page for search results..."
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaved}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                            isSaved 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                        }`}
                    >
                        {isSaved ? (
                            <>
                                <CheckCircleIcon fontSize="small" />
                                Settings Saved!
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageSettingsModal;
