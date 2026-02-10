import RuntimeRenderer from '../core/RuntimeRenderer';
import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore';
import { useThemeStore } from '../../store/themeStore';
import IframeSandbox from './IframeSandbox';
import CloseIcon from '@mui/icons-material/Close';

const PreviewMode = () => {
    const activePageId = useProjectStore((state) => state.activePageId);
    const activePage = useProjectStore((state) => state.pages[activePageId]);
    const activeTheme = useThemeStore((state) => state.themes[state.activeThemeId]);
    const setMode = useEditorStore((state) => state.setMode);
    const viewPort = useEditorStore(state => state.viewPort);

    // Generate CSS Variables for Iframe Head
    const themeCSS = React.useMemo(() => {
        if (!activeTheme) return '';
        let css = ':root {\n';
        Object.entries(activeTheme.tokens.colors).forEach(([k, v]) => {
            css += `  --fs-color-${k}: ${v};\n`;
        });
        css += `  --fs-font-main: ${activeTheme.tokens.typography.fontFamily};\n`;
        css += '}\n';
        css += 'body { margin: 0; padding: 0; font-family: var(--fs-font-main); overflow-x: hidden; }';
        return css;
    }, [activeTheme]);

    if (!activePage) return null;

    const viewportStyles = {
        desktop: 'w-full',
        tablet: 'w-[768px] mx-auto border-x shadow-2xl bg-white',
        mobile: 'w-[375px] mx-auto border-x shadow-2xl bg-white'
    };

    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950 z-[100] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Minimalist Preview Toolbar */}
            <div className="h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Previewing: {activePage.name}</span>
                </div>
                
                <button 
                    onClick={() => setMode('edit')}
                    className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                    <CloseIcon sx={{ fontSize: 14 }} />
                    Back to Canvas
                </button>
            </div>

            {/* Sandbox Container */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex justify-center bg-slate-100 dark:bg-slate-950">
                <div className={`h-full transition-all duration-500 ${viewportStyles[viewPort]}`}>
                    <IframeSandbox 
                        title="FlexiSite Preview" 
                        head={<style>{themeCSS}</style>}
                    >
                        <RuntimeRenderer nodeId={activePage.tree.rootId} />
                    </IframeSandbox>
                </div>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity hover:opacity-0">
                <div className="px-6 py-3 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md rounded-full text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl">
                    <span>💡 Interactivity is live</span>
                    <div className="w-1 h-4 bg-slate-700/50 rounded-full"></div>
                    <span>Navigation & Buttons are active</span>
                </div>
            </div>
        </div>
    );
};

export default PreviewMode;
