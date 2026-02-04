import React, { useState } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { useProjectStore } from '../../store/projectStore';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LayersIcon from '@mui/icons-material/Layers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const TemplateGallery = ({ onClose, onSelect, type = 'page' }) => {
    const templatesMap = useTemplateStore((state) => state.templates);
    const deleteTemplate = useTemplateStore((state) => state.deleteTemplate);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const templates = Object.values(templatesMap).filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = t.type === type;
        const matchesFilter = filter === 'All' || t.category === filter;
        return matchesSearch && matchesType && matchesFilter;
    });

    const categories = ['All', ...new Set(Object.values(templatesMap).map(t => t.category))];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <AutoAwesomeIcon />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Template Gallery</h2>
                        </div>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Choose a starting point or reuse your saved components.</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <CloseIcon />
                    </button>
                </div>

                {/* Filters Row */}
                <div className="px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <input 
                            type="text"
                            placeholder="Find a template..."
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    {templates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {templates.map(tmpl => (
                                <div 
                                    key={tmpl.id} 
                                    className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all hover:shadow-2xl hover:-translate-y-1"
                                >
                                    {/* Preview Slot */}
                                    <div className="aspect-video bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                        {tmpl.thumbnail ? (
                                            <img src={tmpl.thumbnail} alt={tmpl.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <LayersIcon className="text-slate-400 dark:text-slate-500" sx={{ fontSize: 48 }} />
                                        )}
                                        
                                        <div className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all p-6 text-center backdrop-blur-sm">
                                            <button 
                                                onClick={() => onSelect(tmpl)}
                                                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all"
                                            >
                                                Apply Template
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteTemplate(tmpl.id); }}
                                                className="mt-4 text-white/70 hover:text-white text-xs font-bold hover:underline"
                                            >
                                                Delete Template
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{tmpl.category}</span>
                                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400 font-bold uppercase">{tmpl.type}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{tmpl.name}</h3>
                                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{tmpl.description || 'No description provided for this template.'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl mb-6 shadow-inner tracking-tighter">
                                😶
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Empty Gallery</h3>
                            <p className="text-slate-500 mt-3 max-w-sm font-medium leading-relaxed">No templates found matching your search. Create one from any page or section!</p>
                            <button 
                                onClick={() => { setSearch(''); setFilter('All'); }}
                                className="mt-8 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-md active:scale-95"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        FlexiSite Engine v1.2 • Template System Active
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TemplateGallery;
