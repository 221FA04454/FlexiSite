import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const SidebarItem = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      source: 'sidebar',
      type: type,
      label: label
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
        ref={setNodeRef} 
        {...listeners} 
        {...attributes}
        className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg text-slate-600 dark:text-slate-300 group touch-none"
        // style={style} // We rely on DragOverlay for the moving visual, so we keep this static or maybe ghosted? 
        // dnd-kit recommends leaving source alone and using DragOverlay
    >
        <div className="mb-3 text-indigo-500 group-hover:scale-110 transition-transform bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
            {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

export default SidebarItem;
