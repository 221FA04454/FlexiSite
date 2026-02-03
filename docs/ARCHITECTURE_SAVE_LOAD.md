# 💾 FlexiSite Save/Load System
## Architecture Specification (v1.1)

**Date**: 2026-02-03  
**Status**: Implementation Ready  
**Role**: Senior Full-Stack Architect

---

### 1. Unified Project Schema (JSON)
The project snapshot is the "Single Source of Truth." Everything required to reconstruct the site must be encapsulated in this object.

```typescript
{
  "schemaVersion": 1,
  "projectId": "proj_8f2k",
  "name": "My FlexiSite",
  "pages": {
    "page_home": { ...PageModel },
    "page_about": { ...PageModel }
  },
  "globalStyles": {
    "colors": { "primary": "#4f46e5", "bg": "#ffffff" },
    "typography": { "fontFamily": "Inter" }
  },
  "breakpoints": {
    "desktop": 1280,
    "tablet": 768,
    "mobile": 375
  },
  "settings": {
    "favicon": "",
    "customScripts": []
  },
  "metadata": {
    "createdAt": 1700000000000,
    "updatedAt": 1700000010000,
    "lastSavedAt": 1700000015000
  }
}
```

### 2. Synchronization Strategy
*   **Auto-Save**: Powered by `zustand/middleware/persist`. Every state change triggers a debounced write to `localStorage`.
*   **Manual Save**: Triggers an explicit `updatedAt` change and a visually "Confirmed" state in the UI.
*   **Versioning**: Persistence uses a `version` key. If a breaking change occurs, a migration function in `onRehydrateStorage` transforms the data.

### 3. Portability Logic (Import/Export)
#### Export Flow
1.  Serialize the current `state`.
2.  Wrap in a Blob with mime-type `application/json`.
3.  Trigger browser download: `flexisite_project_[name]_[date].json`.

#### Import Flow
1.  **Validation**: Verify `schemaVersion` exists.
2.  **Normalization**: Ensure all nodes have valid types present in `COMPONENT_REGISTRY`.
3.  **Injection**: Replace state via `set((state) => { ... })`.

### 4. Component Lifecycle Changes
*   **`BuilderToolbar`**: Add a Status indicator (✨ Saved / 🕒 Unsaved) and an "Actions" dropdown for JSON operations.
*   **`ProjectStore`**: Implementation of `importProject` and `exportProject` actions.

---

### 🚀 Implementation Checklist
1.  [ ] Expand `projectStore.js` with `globalStyles` and `settings` objects.
2.  [ ] Implement `exportProjectJSON` utility (Download Trigger).
3.  [ ] Implement `importProjectJSON` with basic schema validation.
4.  [ ] Add `importPageJSON` to allow merging pages from other projects.
5.  [ ] Update `BuilderToolbar.jsx` with Save Status and Export/Import buttons.
6.  [ ] Handle "Storage Full" scenarios with graceful alerts.
