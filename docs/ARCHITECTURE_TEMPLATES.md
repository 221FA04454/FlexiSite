# 🎨 FlexiSite Template Engine
## Architecture Specification (v1.2)

**Date**: 2026-02-04  
**Status**: Implementation Ready  
**Role**: Senior System Architect

---

### 1. Template Schema: The "Blueprint" Definition
Templates are serialized versions of component trees, divorced from specific project instances but containing all metadata required for reconstruction.

```typescript
interface Template {
  id: string; // tmpl_XXXX
  name: string;
  description: string;
  type: 'page' | 'section';
  category: 'Landing' | 'Hero' | 'Pricing' | 'Custom';
  thumbnail?: string; // Base64 or URL
  previewData?: string; // JSON snapshot
  tree: {
    root: string;
    entities: Record<string, NodeModel>;
  };
  metadata: {
    version: number;
    engineVersion: string; // Compatibility check
    createdAt: number;
  };
}
```

### 2. The Template Store (`templateStore.js`)
Dedicated state management for local user-created templates and cached system templates.

*   **Persistence**: Uses `localStorage` via Zustand `persist` middleware.
*   **Isolation**: Templates are stored in a separate namespace (`flexisite-templates-v1`) to prevent interference with project state.

### 3. Application Lifecycle: "Rehydration"
When a template is applied:
1.  **Deep ID Generation**: All IDs in the template tree must be regenerated (`nanoid`) to prevent collisions if the template is used multiple times on the same page.
2.  **Tree Injection**:
    *   **Page Mode**: Completely replaces `state.pages[id].tree`.
    *   **Section Mode**: Appends the children of the template root to the selected parent node.
3.  **History Flush**: The `zundo` undo/redo history is cleared or a "Checkpoint" is created to ensure the large-scale tree update is handled correctly.

### 4. Import/Export Engine
*   **Format**: `.json` (MIME: `application/json`).
*   **Signature**: Includes `flexisite_template_signature` to prevent loading incompatible project files as templates.

---

### 🚀 Implementation Checklist
1.  [ ] Create `src/store/templateStore.js`.
2.  [ ] Build `src/utils/idGenerator.js` for recursive ID re-mapping.
3.  [ ] Implement `TemplateGallery.jsx` with category filtering.
4.  [ ] Add "Save as Template" action to `projectStore.js`.
5.  [ ] Integrate Template Selection into the "New Page" workflow.
6.  [ ] Create `TemplatePreview.jsx` for gallery hover states.
