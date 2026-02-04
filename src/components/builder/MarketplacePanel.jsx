import React, { useState } from 'react';
import { usePluginStore } from '../../store/pluginStore';
import CloseIcon from '@mui/icons-material/Close';
import ExtensionIcon from '@mui/icons-material/Extension';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';

// Mock system plugins for display
const SYSTEM_PLUGINS = [
    {
        id: 'flexi_forms_pro',
        name: 'Enterprise Forms',
        version: '1.2.0',
        author: 'Flexi Team',
        description: 'Advanced form builder with validation, logic, and multi-step support.',
        category: 'Essentials',
        components: ['FormContainer', 'FormInput', 'FormSelect', 'FormButton'],
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80'
    },
    {
        id: 'flexi_blog_engine',
        name: 'CMS Blog System',
        version: '0.9.5',
        author: 'OpenSource Community',
        description: 'Dynamic blog posts, categories, and RSS feed integration.',
        category: 'Content',
        components: ['PostList', 'PostContent', 'CategoryBadge'],
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80'
    }
];

const MarketplacePanel = ({ onClose }) => {
    const installedPlugins = usePluginStore((state) => state.installedPlugins);
    const installPlugin = usePluginStore((state) => state.installPlugin);
    const uninstallPlugin = usePluginStore((state) => state.uninstallPlugin);
    
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlugins = SYSTEM_PLUGINS.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 rotate-3">
                            <ExtensionIcon fontSize="large" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Marketplace</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Extend your workspace with community plugins</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Search & Actions */}
                <div className="px-8 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center gap-6">
                    <div className="flex-1 relative group">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" sx={{ fontSize: 20 }} />
                        <input 
                            type="text" 
                            placeholder="Search plugins, creators, or features..."
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Essential', 'UI', 'Content', 'Advanced'].map(cat => (
                            <button key={cat} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Marketplace Grid */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 dark:bg-slate-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlugins.map(plugin => {
                            const isInstalled = !!installedPlugins[plugin.id];
                            
                            return (
                                <div key={plugin.id} className="group bg-white dark:bg-slate-800/40 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2 flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-500 active:scale-[0.99]">
                                    {/* Thumbnail */}
                                    <div className="relative h-44 w-full rounded-[24px] overflow-hidden mb-4">
                                        <img src={plugin.thumbnail} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={plugin.name} />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-lg">
                                                {plugin.category}
                                            </span>
                                        </div>
                                        {isInstalled && (
                                            <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                                                <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                                                    <VerifiedIcon sx={{ fontSize: 16 }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="px-4 py-2 flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-black text-slate-800 dark:text-white text-lg leading-tight uppercase tracking-tighter">{plugin.name}</h3>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md">v{plugin.version}</span>
                                        </div>
                                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                            {plugin.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-1 mb-6">
                                            {plugin.components.slice(0, 3).map(comp => (
                                                <span key={comp} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 rounded-lg text-[9px] font-bold">
                                                    {comp}
                                                </span>
                                            ))}
                                            {plugin.components.length > 3 && (
                                                <span className="px-2 py-1 text-slate-400 text-[9px] font-bold">+{plugin.components.length - 3}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="p-2">
                                        {isInstalled ? (
                                            <button 
                                                onClick={() => uninstallPlugin(plugin.id)}
                                                className="w-full py-4 bg-slate-100 dark:bg-slate-900 text-red-500 hover:bg-red-500 hover:text-white rounded-[20px] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                                Uninstall
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    // In a real app, this would fetch the actual implementation
                                                    // For now, we simulate installing the manifest
                                                    installPlugin({
                                                        ...plugin,
                                                        // Adding empty components def for simulation
                                                        components: plugin.components.map(name => ({
                                                            type: name,
                                                            definition: {
                                                                component: () => <div className="p-4 border-2 border-dashed border-indigo-400 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs uppercase flex flex-col items-center gap-2">🔌 Plugin Element: {name}</div>,
                                                                label: name,
                                                                category: 'Plugins',
                                                                defaultProps: {},
                                                                propSchema: {}
                                                            }
                                                        }))
                                                    });
                                                }}
                                                className="w-full py-4 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                <CloudDownloadIcon fontSize="small" />
                                                Install Plugin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-6 text-center bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">
                        Security Notice: Be careful when installing plugins from unknown authors. <br/>
                        Plugins can execute custom scripts and modify your site data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MarketplacePanel;
