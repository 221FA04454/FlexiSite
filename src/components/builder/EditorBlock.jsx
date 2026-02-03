import React, { useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '../../store/editorStore';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Wrapper for Canvas Components to handle Drop and Selection
const EditorBlock = ({ id, type, style, children, isContainer, onClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      isContainer: isContainer,
      type: type
    },
    disabled: !isContainer // Leaf nodes (Buttons) cannot accept drops
  });

  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const selectNode = useEditorStore((state) => state.selectNode);
  const isSelected = selectedNodeId === id;

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent selecting parent
    selectNode(id);
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      style={style}
      className={twMerge(
        clsx(
          "relative transition-all duration-200 outline-none",
          isSelected && "ring-2 ring-indigo-500 ring-offset-2 z-10",
          isOver && "ring-2 ring-indigo-400 bg-indigo-50/50",
          !isSelected && !isOver && "hover:outline hover:outline-2 hover:outline-indigo-200" // Hover hint
        )
      )}
    >
      {/* Label Tag on Selection */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-t font-mono uppercase tracking-wider z-20 pointer-events-none">
          {type}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default EditorBlock;
