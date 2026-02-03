import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore';
import Renderer from '../core/Renderer';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const Canvas = () => {
    // Determine the root node of the ACTIVE page
    const pages = useProjectStore((state) => state.pages) || {};
    const activePageId = useProjectStore((state) => state.activePageId);
    
    const activePage = pages[activePageId];
    const rootNodeId = activePage?.tree?.root;
    
    const viewPort = useEditorStore((state) => state.viewPort);

    // Dynamic Widths
    const widths = {
        desktop: 'w-full max-w-5xl',
        tablet: 'w-[768px]',
        mobile: 'w-[375px]'
    };

    return (
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 pt-16 overflow-auto h-[calc(100vh-4rem)] flex justify-center transition-colors duration-300">
            {/* The Stage Area */}
            <div 
                className={twMerge(clsx(
                    "h-full min-h-[500px] bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 relative transition-all duration-300 ease-in-out",
                    widths[viewPort]
                ))}
            >
                
                {/* Render the Project Tree */}
                <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-xl bg-white isolate">
                    <Renderer nodeId={rootNodeId} />
                </div>
                
            </div>
        </div>
    );
};

export default Canvas;
