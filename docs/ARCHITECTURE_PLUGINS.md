# 🔌 FlexiSite Plugin & Marketplace System
## Architecture Specification (v1.4)

**Status**: implementation_plan  
**Role**: Principal Architect  
**Objective**: Transform FlexiSite from a static builder into an open, extensible ecosystem for developers and templates.

---

### 1. The Plugin Manifest (Contract)
A plugin is a self-contained bundle that describes its capabilities. It must follow the strict `PluginManifest` schema.

```typescript
interface PluginManifest {
  id: string; // unique_plugin_id
  name: string;
  version: string;
  author: string;
  
  // Extensions
  components: PluginComponent[]; // New React elements
  templates: Template[]; // Injected into Template Gallery
  themeOverrides?: ThemeTokens; // Optional branding
  
  // Runtime
  externalScripts?: string[]; // CDN loads
  settings?: Record<string, any>;
  compatibility: { cmsVersion: string };
}

interface PluginComponent {
  type: string;
  label: string;
  icon?: string;
  category: string;
  definition: ComponentDefinition; // Compatible with registry.js
}
```

### 2. The Dynamic Registry Pipeline
Currently, `registry.js` is a static map. In v1.4, it transitions to a **Dynamic Registry**:
1.  **Boot Phase**: Load core system components.
2.  **Plugin Phase**: `pluginStore` iterates through installed plugins and appends their `components` to the global registry.
3.  **Validation**: Ensures plugin components don't overwrite core types (like `Container`).

### 3. Component Sandboxing & Safety
*   **Error Boundaries**: Every plugin component is automatically wrapped in a higher-order `PluginBoundary` component to prevent a single faulty plugin from crashing the entire builder.
*   **Script Isolation**: External scripts are loaded via a standard script injector that tracks dependencies and prevents duplicates.

### 4. Marketplace Lifecycle
1.  **Discovery**: User browses the Marketplace UI (connected to a central registry or local JSON).
2.  **Installation**: Manifest is downloaded -> Store updated -> Registry extended -> Assets injected (e.g., templates).
3.  **Activation**: Components instantly appear in the Sidebar "Plus" menu under a special "Plugins" category.
4.  **Persistence**: The list of `installedPluginIds` is stored in `projectStore` metadata so the project can re-load its required plugins on any machine.

### 🔐 Security & Sandboxing
To protect users from malicious code, FlexiSite implements:
*   **Permission Manifest**: Plugins must declare if they need to fetch external data or access sensitive project metadata.
*   **Shadow Registry**: Plugin components are tested in a hidden "Shadow Renderer" before being promoted to the main canvas.
*   **Script Sanitization**: External script URLs are validated against an allowed whitelist (e.g., standard CDNs).

### 🛠️ Developer Integration Checklist
1.  **Strict Typing**: Always use the `fs-` prefixed CSS variables in your plugin styles to ensure compatibility with the host **Theme Engine**.
2.  **Asset Hosting**: Ensure all component icons and thumbnails are hosted on HTTPS with valid CORS headers.
3.  **Undo/Redo**: Component state must be serializable. Non-serializable state in plugins will break the **Zundo History Stack**.
4.  **Versioning**: Follow SemVer. Minor updates (1.0.1 -> 1.0.2) should never change the `propSchema` structure to avoid breaking existing pages.

---

### 🚀 Implementation Workflow
1.  **State Layer**: Create `src/store/pluginStore.js`.
2.  **Registry Upgrade**: Modify `src/components/registry.jsx` to accept dynamic registrations.
3.  **UI Bridge**: Build the `MarketplacePanel.jsx` mockup.
4.  **Security**: Implement the `ScriptLoader` utility (Tracked for v1.5).
