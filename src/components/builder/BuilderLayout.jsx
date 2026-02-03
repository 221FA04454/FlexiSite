import React, { useState } from 'react';
import { DndContext, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import { createPortal } from 'react-dom';
import Canvas from './Canvas';
import ComponentPanel from './ComponentPanel';
import PropertiesPanel from './PropertiesPanel';
import SidebarItem from './dnd/SidebarItem';
import BuilderToolbar from './BuilderToolbar';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore';
import { COMPONENT_REGISTRY } from '../registry.jsx';

// Drop Animation Config
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.4' },
    },
  }),
};

const BuilderLayout = () => {
    const [activeDragItem, setActiveDragItem] = useState(null);
    const addNode = useProjectStore((state) => state.addNode);
    
    // ViewPort State
    const viewPort = useEditorStore((state) => state.viewPort);
    const setViewPort = useEditorStore((state) => state.setViewPort);

    const handleDragStart = (event) => {
        const { active } = event;
        // Looking up component details for ghost overlay
        const type = active.data.current?.type;
        const registryItem = COMPONENT_REGISTRY[type];
        
        setActiveDragItem({
           type,
           label: registryItem?.label || type,
           icon: null
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return; // Dropped outside valid zone

        const type = active.data.current?.type;
        const parentId = over.id;

        if (type && parentId) {
            // Get default props
            const registryItem = COMPONENT_REGISTRY[type];
            const defaultProps = registryItem?.defaultProps || {};

            const newNode = {
                id: `${type}_${nanoid(6)}`,
                type: type,
                props: { ...defaultProps },
                style: { desktop: {} },
                children: [] // Should be empty by default
            };
            
            addNode(parentId, newNode);
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen overflow-hidden">
                <BuilderToolbar />
                
                <div className="flex-1 flex overflow-hidden">
                    <ComponentPanel />
                    
                    <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
                        {/* Device Toggles */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg p-1 z-10 flex text-sm font-medium text-slate-600 dark:text-slate-300">
                            {[
                                { id: 'desktop', icon: '💻', label: 'Desktop' },
                                { id: 'tablet', icon: '📱', label: 'Tablet' },
                                { id: 'mobile', icon: '📲', label: 'Mobile' }
                            ].map((device) => (
                                <button
                                    key={device.id}
                                    onClick={() => setViewPort(device.id)}
                                    className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${
                                        viewPort === device.id 
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' 
                                        : 'hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>{device.icon}</span>
                                    <span className="hidden sm:inline">{device.label}</span>
                                </button>
                            ))}
                        </div>

                        <Canvas />
                    </div>

                    <PropertiesPanel />
                </div>
                
                {/* Ghost Drag Overlay */}
                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeDragItem ? (
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-indigo-500 opacity-90 cursor-grabbing w-40 flex items-center gap-3">
                                <span className="text-xl">📄</span> {activeDragItem.label}
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </div>
        </DndContext>
    );
};

export default BuilderLayout;
