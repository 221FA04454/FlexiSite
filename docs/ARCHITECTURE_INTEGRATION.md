# 🔗 FlexiSite Integration & Multi-Tenant Layer
## Architecture Specification (v1.8)

**Status**: implementation_plan  
**Role**: Principal System Architect  
**Objective**: Enable FlexiSite CMS to act as a "Headless CMS with a Heart," providing embeddable, interactive UI modules to external SaaS platforms (EduMon, CarTrack, etc.) via a secure, tenant-aware pipeline.

---

### 1. The Embed Lifecycle (The "Universal Script")
FlexiSite provides a high-performance, asynchronous loader (`embed.js`) that handles the injection of the CMS runtime into any third-party environment.

#### 🛠️ Usage Patterns
1.  **Full Page Injection**: `<div id="flexisite-root" data-project="ID"></div>`
2.  **Micro-Widget Injection**: `<div data-widget="ContactForm" data-tenant="T_01"></div>`

#### 🔄 Loader Flow (Client-Side)
1.  **Handshake**: `embed.js` detects `data-` attributes on the host tag.
2.  **Auth**: Proxies a request to the FlexiSite API with the `Tenant-API-Key`.
3.  **Boot**: Fetches the **Theme Bundle** and **Component Tree**.
4.  **Sandbox**: Spawns an `IframeSandbox` (v1.7) to prevent style collisions with the host app.
5.  **Resize**: Uses a `ResizeObserver` inside the iframe to post-message the height back to the host, ensuring zero scrollbars.

### 2. Micro-Frontend (MFE) Widget Engine
Standalone widgets are rendered using the `RuntimeRenderer` (v1.7) scoped to a specific `nodeId`.
*   **Scoped Styling**: The `theme.css` is injected but only applies to the widget's shadow DOM or iframe.
*   **Event Bridge**: The widget emits `postMessage` events (e.g., `flexisite:form-success`) which the parent host (e.g., EduMon Dashboard) can listen for to trigger internal logic.

### 3. Tenant Isolation & Security
To support industrial-scale multi-tenancy:
*   **JWT Handshake**: API keys are transformed into short-lived JWTs for frontend requests.
*   **CORS Whitelisting**: Projects can only be embedded on domains explicitly permitted in the **Integration Panel**.
*   **Data Masking**: Tenant-specific metadata (like private form endpoints) is injected at request-time, not stored in the public JSON tree.

### 4. Cross-Application Communication Protocol
Standardized message schema for `window.postMessage`:

| Direction | Event Name | Payload |
| :--- | :--- | :--- |
| Outbound | `fs:node_clicked` | `{ nodeId, type, metadata }` |
| Outbound | `fs:form_data` | `{ formId, fields: [...] }` |
| Inbound | `fs:update_theme` | `{ tokens: { primary: "#hex" } }` |
| Inbound | `fs:set_node_prop` | `{ nodeId, props: { text: "Hello" } }` |

---

### 🚀 Implementation Workflow
1.  **The Loader**: Build `src/utils/embedLoader.js`.
2.  **The Panel**: Build `src/components/builder/IntegrationPanel.jsx`.
3.  **The Bridge**: Extend `interactionRuntime.js` to emit `postMessage` events.
4.  **UI Bridge**: Add the "Integrations" button to the `BuilderToolbar`.
