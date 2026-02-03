# FlexiSite CMS - Drag & Drop Engine Specification

**Version:** 1.0.0
**Role:** Senior Frontend Engineer
**Status:** Approved for Implementation

---

## 🎯 1. Drag & Drop Architecture (Overview)

We utilize **@dnd-kit** for its modularity, accessibility, and lightweight footprint. The system connects the **Sidebar (Source)** to the **Canvas (Target)** using a **Normalized State Tree**.

### High-Level Flow
1.  **Drag Start**: User drags an item from `Sidebar`.
2.  **Detection**: `DndContext` detects the active drag node type (e.g., `Button`).
3.  **Ghost Layer**: A `DragOverlay` shows a visual preview following the cursor.
4.  **Drop**: User releases over a valid `Droppable` (Container) in the Canvas.
5.  **State Update**: `projectStore` inserts a new Node ID into the Tree.
6.  **Render**: `Renderer` detects the new ID and hydrates the component.

---

## 🖱️ 2. Drag Source (Sidebar)

Items in the sidebar are **Templates** of components, not actual instances. They carry metadata about what *will* be created.

### Data Structure
```javascript
const SIDEBAR_ITEMS = [
  {
    type: 'Container',
    category: 'layout',
    label: 'Container',
    icon: <BoxIcon />,
    defaultProps: { padding: 'p-4', className: 'min-h-[100px]' }
  },
  {
    type: 'Button',
    category: 'basic',
    label: 'Button',
    icon: <BtnIcon />,
    defaultProps: { text: 'Click Me', variant: 'primary' }
  }
];
```

### Component: `<SidebarDraggable />`
Uses `useDraggable` from `@dnd-kit`.
```jsx
const SidebarDraggable = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { 
      source: 'sidebar', 
      type: type 
    }
  });
  
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {icon} <span>{label}</span>
    </div>
  );
};
```

---

## 🎯 3. Drop Target (Canvas)

Every **Container-like** component in the Canvas must be wrapped in a `Droppable` zone.

### Logic
1.  **Wrapper**: The `Renderer` wraps every component in an `<EditorBlock />`.
2.  **Droppable**: If the component `isContainer` (registry flag), `<EditorBlock />` initializes `useDroppable`.
3.  **Visual Feedback**:
    *   **isOver**: Local state in `EditorBlock` tracks if an item is hovering over it.
    *   **Effect**: Adds `border-indigo-500 bg-indigo-50/10` class to highlight the drop zone.

---

## 🌳 4. Normalized Node Tree Integration

When the `onDragEnd` event fires in the `DndContext`:

### Algorithm: `handleAddNode`
1.  **Validate**: Ensure `event.over` exists (user dropped on a valid container).
2.  **Parent Resolution**: `parentId = event.over.id` (The ID of the container dropped on).
3.  **ID Generation**: `newNodeId = type + '_' + uuid()`.
4.  **Dispatch**: Call `projectStore.addNode(parentId, newNode)`.

### Store Action: `addNode`
```javascript
addNode: (parentId, type, props) => set(state => {
  const newNodeId = `${type}_${nanoid()}`;
  
  // 1. Create Node Entity
  state.nodes[newNodeId] = {
    id: newNodeId,
    type: type,
    parentId: parentId,
    children: [], // Leaf nodes have empty children
    props: props || {},
    style: { desktop: {} }
  };
  
  // 2. Append to Parent
  const parent = state.nodes[parentId];
  if(parent) {
    parent.children.push(newNodeId);
  }
  
  // 3. Auto-Select
  state.selectedNodeId = newNodeId;
})
```

---

## 👆 5. Selection System

The selection system is independent of Drag & Drop but highly integrated via the `EditorBlock`.

### Interaction Flow
1.  **Click**: User clicks any element in Canvas.
2.  **Stop Propagation**: `e.stopPropagation()` ensures we only select the deepest node clicked, not its parents.
3.  **Store Update**: `editorStore.setSelected(nodeId)`.
4.  **Visual**:
    *   The `EditorBlock` compares `id === selectedNodeId`.
    *   If true, renders a `<SelectionFrame />` (Absolute positioned border with resize handles label).

---

## ⚠️ 6. Edge-Case Handling

| Scenario | Handling |
| :--- | :--- |
| **Drop on Text Node** | Text nodes are NOT `Droppable`. Dnd-kit will likely resolve to the *parent* of the text node (Container) or cancel. |
| **Drop Outside Root** | `DndContext` fires `onDragEnd` with `over: null`. Action ignored. |
| **Infinite Nesting** | We enforce a `maxDepth` check or specific `allowedChildren` list in Registry (Future V2). |
| **Cyclical Drag** | A node cannot be dragged into its own children. (Validation logic in `onDragOver`). |

---

## 📁 7. Module Folder Structure

```
src/components
  /builder
    /dnd
      /DragOverlayManager.jsx  # Renders the ghost image
      /DropZone.jsx            # Reusable drop area
      /DndContextWrapper.jsx   # Top-level provider
    /EditorBlock.jsx           # The "Shell" around every canvas component
    /SidebarItem.jsx           # Draggable source
    /ComponentPanel.jsx        # Sidebar container
```

---
**Prepared By:** Senior Frontend Architect
