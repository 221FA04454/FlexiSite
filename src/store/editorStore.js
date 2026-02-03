import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useEditorStore = create(
  immer((set) => ({
    // Selection State
    selectedNodeId: null,
    hoveredNodeId: null,
    
    // View State
    mode: 'edit', // 'edit' | 'preview' | 'live'
    viewPort: 'desktop', // 'desktop' | 'tablet' | 'mobile'
    
    // Actions
    selectNode: (id) => set((state) => {
      state.selectedNodeId = id;
    }),
    hoverNode: (id) => set((state) => {
      state.hoveredNodeId = id;
    }),
    setMode: (mode) => set((state) => {
      state.mode = mode;
    }),
    setViewPort: (view) => set((state) => {
      state.viewPort = view;
    }),
  }))
);
