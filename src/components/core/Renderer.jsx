import React, { useMemo } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore'; // Import Editor Store
import { getComponent, COMPONENT_REGISTRY } from '../registry.jsx';
import UnknownComponent from './UnknownComponent';
import EditorBlock from '../builder/EditorBlock';
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

  // Component Resolution
  // eslint-disable-next-line
  const ResolvedComponent = useMemo(() => getComponent(node?.type) || UnknownComponent, [node?.type]);
  const extraProps = ResolvedComponent === UnknownComponent ? { type: node?.type } : {};

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
  }, [node, viewPort]); // Added node to dependency
  
  const isHidden = node?.props?.hidden;
  
  if (isHidden && editorMode === 'preview') return null;
  if (!node || !ResolvedComponent) return null;

  const finalStyle = isHidden ? { ...computedStyle, opacity: 0.4, border: '2px dashed #ccc' } : computedStyle;

  // Render children recursively
  const children = node.children?.map((childId) => (
    <Renderer key={childId} nodeId={childId} />
  ));

  const isContainer = COMPONENT_REGISTRY[node.type]?.category === 'layout';

  // If root node (no parent), render directly
  if (!node.parentId) {
      return (
         <ResolvedComponent id={node.id} {...node.props} {...extraProps} style={finalStyle} onClick={(e) => handleEvent(node.id, 'onClick', e)}>
            {editorMode === 'edit' ? (
                <EditorBlock id={node.id} type={node.type} isContainer={true} style={finalStyle}>
                    {children}
                </EditorBlock>
            ) : children}
         </ResolvedComponent>
      )
  }

  // Preview Mode: No wrapper
  if (editorMode === 'preview') {
      return (
          <ResolvedComponent 
            id={node.id}
            {...node.props}
            {...extraProps}
            style={finalStyle}
            onClick={(e) => handleEvent(node.id, 'onClick', e)}
          >
            {children}
          </ResolvedComponent>
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
      <ResolvedComponent 
        id={node.id}
        {...node.props}
        {...extraProps}
        style={finalStyle}
        // Events are usually handled by EditorBlock in edit mode to avoid navigation
      >
        {children}
      </ResolvedComponent>
    </EditorBlock>
  );
};

export default Renderer;
