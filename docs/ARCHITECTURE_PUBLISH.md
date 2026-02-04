# 🚀 FlexiSite Publishing & Runtime Pipeline
## Architecture Specification (v1.6)

**Status**: implementation_plan  
**Role**: Principal Architect  
**Objective**: Transform a dynamic CMS project into a high-performance, SEO-optimized, production-ready static site.

---

### 1. The Output Blueprint (Stateless Export)
FlexiSite follows a **Headless Hybrid** export strategy. The output is a collection of static HTML files, but they are "hydrated" by a lightweight 4KB runtime for interactions.

#### 📂 Deployment Structure (`/dist`)
*   `index.html`, `about.html`, etc. (Pre-rendered content)
*   `assets/theme.css` (Atomic tokens + Global styles)
*   `assets/runtime.js` (Event listeners + Navigation logic)
*   `data/project.json` (Full tree metadata for client-side routing)

### 2. The Build Process (The Pipeline)
The publishing pipeline executes in five discrete phases:

1.  **Serialization**: Deep-clone `projectStore` and `themeStore`. Inject system metadata.
2.  **Hydration**: Resolve all CSS Variables into a static global stylesheet.
3.  **Transpilation**: 
    *   Iterate through every page.
    *   Use the `StaticRenderer` to convert JSON nodes into semantic HTML strings.
    *   Inline high-priority CSS (Critical CSS) into the `<head>`.
4.  **Asset Mapping**: Scan for external images and plugin scripts; generate a manifest.
5.  **Packaging**: Bundle all files into a downloadable archive (ZIP) or deploy via Webhook (Vercel/Netlify).

### 3. Lightweight Runtime Engine
The published site *strictly avoids* loading the full 2MB Builder environment. Instead, it uses `flexisite-runtime.js`:
*   **Small Footprint**: Only includes the `Interaction Interpreter` and `Responsive Handler`.
*   **Event Delegation**: Binds site-wide events to the `window` to handle dynamic interaction metadata without per-element listeners.
*   **SPA Transition**: Uses `pushState` and `fetch` to load `data/project.json` parts for smooth, reload-less navigation.

### 4. SEO & Performance
*   **Zero JS First Paint**: The site is fully readable even if JavaScript is disabled.
*   **Responsive Injection**: Breakpoints are exported as native CSS Media Queries (e.g., `@media (max-width: 768px)`), ensuring zero layout shift.
*   **Theme Continuity**: `:root` variables ensure that global brand changes don't require re-generating thousands of individual component styles.

### ⚠️ Edge Cases & Recovery
*   **Missing Slugs**: Pages without slugs are automatically assigned a filename based on their name (e.g., `services.html`).
*   **Broken Scripts**: If a plugin is removed but its component remains in the tree, the static renderer injects a `placeholder` block to prevent site-wide crashes.
*   **Circular References**: The recursive renderer includes a depth limit (max 50) to prevent infinite loops in complex nested templates.

### 🛠️ Developer Integration Checklist
1.  **Static Renderer Optimization**: Ensure all components in the `COMPONENT_REGISTRY` have a defined HTML tag mapping.
2.  **Asset Relative Paths**: All `<img src>` and `<link href>` must use relative paths (`./assets/...`) to support sub-directory deployments (e.g., GitHub Pages).
3.  **Interaction Hydration**: The `runtime.js` must be injected at the end of `<body>` to ensure the DOM is ready for event binding.
4.  **JSON Compression**: For large sites, the `project.json` should be minified to reduce payload for smooth client-side routing.
