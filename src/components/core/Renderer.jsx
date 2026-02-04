import React, { useMemo } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore'; // Import Editor Store
import { getComponent } from '../registry.jsx';
import EditorBlock from '../builder/EditorBlock';
import { COMPONENT_REGISTRY } from '../registry.jsx';
import { handleEvent } from '../../utils/interactionRuntime';

// Recursive Renderer Component
const Renderer = ({ nodeId }) => {
  // Subscribe specifically to the localized node data
  const pages = useProjectStore((state) => state.pages);
  const activePageId = useProjectStore((state) => state.activePageId);
  
  const activePage = pages[activePageId];
  const node = activePage?.tree?.entities?.[nodeId];
  
  const editorMode = useEditorStore((state) => state.mode);
  const viewPort = useEditorStore((state) => state.viewPort);

  // Memoize logic to prevent updates if node hasn't changed
  const Component = useMemo(() => {
     if (!node) return null;
     return getComponent(node.type);
  }, [node?.type]);

  const isHidden = node?.props?.hidden;
  if (isHidden && editorMode === 'preview') return null;

  // Style Cascade Logic
  const computedStyle = useMemo(() => {
    if (!node?.style) return {};

    const base = node.style.desktop || {};
    
    if (viewPort === 'desktop') return base;
    
    if (viewPort === 'tablet') {
       return { ...base, ...(node.style.tablet || {}) };
    }
    
    if (viewPort === 'mobile') {
      // Typically mobile inherits from tablet, then desktop, or just desktop.
      // For simplicity: Desktop -> Mobile Override. 
      // Or Desktop -> Tablet -> Mobile.
      return { 
          ...base, 
          ...(node.style.tablet || {}), 
          ...(node.style.mobile || {}) 
      };
    }

    return base;
  }, [node?.style, viewPort]);

  const finalStyle = isHidden ? { ...computedStyle, opacity: 0.4, border: '2px dashed #ccc' } : computedStyle;

  if (!node || !Component) return null;

  // Render children recursively
  const children = node.children?.map((childId) => (
    <Renderer key={childId} nodeId={childId} />
  ));

  const isContainer = COMPONENT_REGISTRY[node.type]?.category === 'layout';

  // If root node (no parent), render directly
  if (!node.parentId) {
      return (
         <Component id={node.id} {...node.props} style={finalStyle} onClick={(e) => handleEvent(node.id, 'onClick', e)}>
            {editorMode === 'edit' ? (
                <EditorBlock id={node.id} type={node.type} isContainer={true} style={finalStyle}>
                    {children}
                </EditorBlock>
            ) : children}
         </Component>
      )
  }

  // Preview Mode: No wrapper
  if (editorMode === 'preview') {
      return (
          <Component 
            id={node.id}
            {...node.props}
            style={finalStyle}
            onClick={(e) => handleEvent(node.id, 'onClick', e)}
          >
            {children}
          </Component>
      );
  }

  // Wrap generic components in EditorBlock
  return (
    <EditorBlock 
      id={node.id} 
      type={node.type} 
      isContainer={isContainer}
      style={finalStyle}
    >
      <Component 
        id={node.id}
        {...node.props}
        style={finalStyle}
        // Events are usually handled by EditorBlock in edit mode to avoid navigation
      >
        {children}
      </Component>
    </EditorBlock>
  );
};

export default Renderer;
