# 🏗️ FlexiSite Multi-Page Management System
## Architecture Specification (v1.0)

**Date**: 2026-02-03  
**Status**: Implementation Ready  
**Role**: Senior System Architect

---

### 1. Data Model: Page-Centric Schema
To support enterprise-scale scalability and cross-page isolation, the state model is transitioning from a "Project Flat Map" to a **"Page-Level Partitioned Map"**.

```typescript
interface ProjectState {
  pages: Record<string, PageModel>;
  activePageId: string;
}

interface PageModel {
  id: string;
  name: string;
  slug: string; // Validated: lowercase, no spaces, kebab-case
  tree: {
    rootId: string;
    nodes: Record<string, NodeModel>; // Localized node map for the page
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonical?: string;
    noIndex: boolean;
  };
  metadata: {
    createdAt: number;
    updatedAt: number;
  };
}
```

### 2. Project Store: State Management Strategy
The `projectStore` will handle state mutations using **Zustand + Immer**. 

*   **Undo/Redo (zundo)**: Configured to track the `pages` object. Switching `activePageId` will **not** be tracked in history to prevent "page-jump" during undo cycles.
*   **Persistence**: Uses `persist` middleware with a versioned storage key (`flexisite-project-multihero-v1`).
*   **Sub-Atomic Updates**: Node property updates will target `state.pages[state.activePageId].tree.nodes[nodeId]`.

### 3. Page Switching Lifecycle
When a user switches pages:
1.  **Selection Cleanup**: `editorStore.selectNode(null)` is called to prevent ghost properties from old nodes.
2.  **State Transition**: `projectStore.setActivePage(pageId)` updates the current context.
3.  **Renderer Reset**: The `Canvas` component detects the `activePageId` change and re-mounts the `Renderer` with the new `rootId`.

### 4. UI Design Specification
#### Page List Panel
*   **Location**: Integrated into the `BuilderToolbar` or a dedicated left-pane toggle.
*   **Actions**:
    *   `Rename`: Inline editing or modal.
    *   `Duplicate`: Deep clone of the tree and SEO metadata.
    *   `Delete`: Permanent removal with "Last Page" protection.
    *   `Settings`: Opens SEO & Route configuration modal.

#### Page Settings Modal
*   **SEO Title / Description**: Character counters included.
*   **Slug Validator**: Real-time regex check (`^[a-z0-9-/]+$`).

### 5. Deployment & Routing (Preview/Live)
*   **In-Editor**: Routing is handled via `activePageId` internal state.
*   **Live Preview**: Maps `window.location.pathname` to the `slug` property in the `pages` registry.

---

### 🚀 Implementation Checklist
1.  [ ] Refactor `projectStore.js` to the partitioned node structure.
2.  [ ] Enhance `Renderer.jsx` to fetch nodes from `activePage.tree.nodes`.
3.  [ ] Implement recursive `deepCloneTree` utility for page duplication.
4.  [ ] Create `PageSettingsModal.jsx` with validation logic.
5.  [ ] Integrate "Last Page" protection and auto-switch on deletion.
6.  [ ] Update `Canvas.jsx` fallbacks for page-specific root nodes.
