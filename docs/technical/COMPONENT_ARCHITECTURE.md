# FlexiSite CMS - Component Library & Rendering Engine Architecture

**Version:** 1.0.0
**Role:** Senior Frontend Architect
**Date:** 2026-02-03

---

## 🏗️ 1. Component Library Overview

The Component Library is the building block system of FlexiSite. It is designed to be **atomic**, **serializable**, and **extensible**. Every element on a FlexiSite page is a "Node" in a JSON tree, derived from a definition in this library.

### 1.1 Component Categories

| Category | Description | Examples |
| :--- | :--- | :--- |
| **Layout** | Structural elements that hold other components. | `Section`, `Container`, `Grid`, `FlexBox` |
| **Basic UI** | Fundamental atomic elements. | `Text`, `Heading`, `Button`, `Image`, `Icon`, `Link` |
| **Forms** | Input elements for data collection. | `Input`, `Textarea`, `Checkbox`, `Radio`, `Select` |
| **Media** | Rich media content. | `VideoEmbed`, `Audio`, `Lottie`, `SplineViewer` |
| **Blocks** | Pre-composed organisms (High-level). | `HeroSection`, `Footer`, `PricingCard`, `Navbar` |
| **Dynamic** | Data-driven components. | `Repeater`, `CMSList`, `ConditionBlock` |

### 1.2 Folder Structure

We adhere to a strictly categorized structure for scalability.

```
/src
  /components
    /registry.js       # The central map of all available components
    /core              # The Rendering Engine itself
      /Renderer.jsx
      /Canvas.jsx
      /IframeShell.jsx
    /lib               # The actual component implementations
      /layout
        /Section.jsx
        /Grid.jsx
      /basic
        /Button.jsx
        /Text.jsx
      /forms
        /Input.jsx
      /dynamic
        /Repeater.jsx
```

---

## 📜 2. Component JSON Schema

Every component instance in the page tree follows this strict TypeScript interface. This is the **State of Truth**.

```typescript
type ComponentNode = {
  id: string;              // Unique UUID (e.g., "node_8f7a...")
  type: string;            // Component Type (e.g., "Button", "Section")
  parentId: string | null; // For tree traversal
  children: string[];      // Array of Child Node IDs
  
  // Content & Configuration
  props: Record<string, any>; 
    // e.g. { text: "Click Me", href: "/home", variant: "primary" }

  // Visual Styling (Responsive)
  style: {
    desktop: Record<string, string>; // Base styles
    tablet?: Record<string, string>; // Overrides
    mobile?: Record<string, string>; // Overrides
    hover?: Record<string, string>;  // Pseudo-states
  };

  // Interactions & Logic
  events: {
    onClick?: ActionDef;  // { type: 'navigate', url: '/about' }
  };

  // Data Binding
  binding?: {
    source: string;       // "cms_users"
    field: string;        // "username"
  };
};
```

---

## 🎨 3. Rendering Engine Architecture

The Rendering Engine is a **Recursive Functional Component** that hydrates the JSON tree into React DOM nodes.

### 3.1 The Virtual Node Tree
The Builder maintains a normalized state (flat object) for O(1) lookups, but the Renderer traverses it as a tree.

**Normalized State (Redux/Zustand optimized):**
```json
{
  "node_root": { "id": "node_root", "children": ["node_1", "node_2"] },
  "node_1": { "id": "node_1", "type": "Heading" },
  "node_2": { "id": "node_2", "type": "Container" }
}
```

### 3.2 The Recursive Renderer
```jsx
// Simplified Pseudo-code
const Renderer = ({ nodeId }) => {
  const node = useNode(nodeId); // Hook to get data from Store
  const Component = Registry[node.type]; // Lookup implementation

  if (!Component) return <ErrorPlaceholder />;

  return (
    <Component 
      id={node.id} 
      {...node.props} 
      style={resolveStyles(node.style, currentDevice)} // Auto-responsive logic
    >
      {node.children.map(childId => (
        <Renderer key={childId} nodeId={childId} />
      ))}
    </Component>
  );
};
```

### 3.3 Isolation (Iframe API)
To prevent the Builder's UI (Sidebar, Panels) from affecting the User's Page CSS:
1.  **Canvas** renders inside an `<iframe>`.
2.  **Styles** are injected into the Iframe `<head>`.
3.  **Events** (Click, Drag) are captured by an overlay in the Iframe and sent to the Parent via `postMessage`.

---

## 🔄 4. Component Lifecycle

The journey of a component from Library to Live Site.

1.  **Definitions Loaded**: App starts → `ComponentRegistry` loads all manifest files.
2.  **Drag Start**: User drags "Button" from Library → `DragStart` event carries `{ type: 'Button' }`.
3.  **Drop & Instance**: User drops on Canvas → Engine generates `UUID` → Creates JSON Node → Updates `children` array of Parent.
4.  **Hydration**: Engine detects State change → Re-renders tree → Button appears.
5.  **Edit**: User clicks Button → `SelectedNodeId` updates → Properties Panel reads Node Data.
6.  **Persist**: Auto-save triggers → JSON tree sent to Backend (Debounced).
7.  **Publish**: Backend takes JSON → Generates Static HTML/React Bundle → Pushes to CDN.

---

## 🎛️ 5. Properties Panel Framework

The "Brain" that modifies the JSON Node.

### 5.1 Content Tab
*   **Schema Driven**: Each component exports a `propSchema`.
    *   *Example*: `Button` has `text` (String) and `variant` (Enum).
    *   **UI**: The Panel auto-generates inputs based on this schema.

### 5.2 Style Tab (The CSS Mapper)
Directly manipulates `node.style[device]`.
*   **Dimensions**: W/H/Max/Min.
*   **Typography**: Font Family, Size, Weight (loads fonts dynamically).
*   **Spacing**: Margin/Padding visual editor.
*   **Effects**: Box-shadow generator, Border-radius.

### 5.3 Advanced Tab
*   **Conditional Visibility**: Show if `params.id === 5`.
*   **Custom Attributes**: `data-analytics-id`, `aria-label`.

---

## 📄 6. Template Engine Architecture

Templates are simply **Serialized Sub-trees**.

### 6.1 Structure
```json
{
  "templateId": "tpl_landing_01",
  "version": "1.0.0",
  "rootNode": { ... }, // The container node
  "nodes": { ... },    // All dependencies (children)
  "variables": {       // Overridable defaults
    "primaryColor": "#ff0000",
    "heroText": "Welcome"
  }
}
```

### 6.2 Import Logic
When importing a template:
1.  New UUIDs are generated for **every** node to prevent ID collisions.
2.  Assets (Images) are copied to the Project's S3 folder.

---

## 🔌 7. Plugin System Architecture (The "USP")

FlexiSite is designed to be indefinitely extensible.

### 7.1 Plugin Manifest (`flexi-plugin.json`)
```json
{
  "id": "com.stripe.checkout",
  "name": "Stripe Checkout",
  "version": "1.0.0",
  "permissions": ["ui:component", "script:inject"],
  "components": [
    {
      "type": "StripeBtn",
      "source": "./dist/Button.js",
      "icon": "./assets/icon.svg"
    }
  ]
}
```

### 7.2 Module Loading (Module Federation)
*   **Runtime**: We use **Webpack Module Federation** or **ES Modules**.
*   **Process**:
    1.  User installs Plugin.
    2.  `PluginManager` fetches remote JS.
    3.  `ComponentRegistry.register("StripeBtn", RemoteComponent)`.
    4.  Component is now available in the Drag-and-Drop library.

---

## 🏁 8. Final Recommendations

1.  **Stick to "dumb" components**: Logic should live in the `Renderer`, not the component itself.
2.  **Normalize Data**: Never store nested trees in the Database. Store flat maps (`Record<ID, Node>`). It makes Drag-and-Drop reordering O(1) instead of O(N).
3.  **Strict Typing**: Use TypeScript for all Schema definitions. The complexity of a Builder grows exponentially without strict types.
