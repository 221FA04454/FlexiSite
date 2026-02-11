import React, { useMemo } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { getComponent } from '../registry.jsx';
import UnknownComponent from './UnknownComponent';
import { handleEvent } from '../../utils/interactionRuntime';

/**
 * FlexiSite Runtime Renderer (Production Grade)
 * A stripped-down, high-performance renderer used in Preview & Live modes.
 * NO editor logic, NO drag-handles, NO selection borders.
 */
const RuntimeRenderer = ({ nodeId }) => {
  const pages = useProjectStore((state) => state.pages);
  const activePageId = useProjectStore((state) => state.activePageId);
  const activePage = pages[activePageId];
  
  const node = activePage?.tree?.entities?.[nodeId];

  // 1. Resolve Component
  // eslint-disable-next-line react/no-unstable-nested-components
  const ResolvedComponent = getComponent(node?.type) || UnknownComponent;
  const extraProps = ResolvedComponent === UnknownComponent ? { type: node?.type } : {};

  // 3. Style Resolution (Responsive)
  // Note: For simplicity, the runtime assumes 'desktop' or uses CSS Media Queries
  // In this preview version, we pull from the store's current viewport
  const computedStyle = useMemo(() => {
    if (!node?.style) return {};
    return node.style.desktop || {};
  }, [node]);

  // 2. Visibility Check
  const isHidden = node?.props?.hidden;
  if (isHidden) return null;

  if (!node || !ResolvedComponent) return null;

  // 4. Render Children Recursively
  const children = node.children?.map((childId) => (
    <RuntimeRenderer key={childId} nodeId={childId} />
  ));

  return (
    <ResolvedComponent 
      id={node.id}
      {...node.props}
      {...extraProps}
      style={computedStyle}
      onClick={(e) => {
          // Inhibit default only if it's a builder-managed event
          handleEvent(node.id, 'onClick', e);
      }}
    >
      {children}
    </ResolvedComponent>
  );
};

export default RuntimeRenderer;
