# ⚡ FlexiSite Interaction Engine
## Architecture Specification (v1.5)

**Status**: implementation_plan  
**Role**: Principal Architect  
**Objective**: Enable no-code logic, event-driven workflows, and complex routing across the CMS.

---

### 1. State-Action Data Model
Interactions are stored as metadata on a per-node basis. This ensures that when a component is moved or templated, its logic travels with it.

```typescript
interface Interaction {
  id: string; // nanoid
  event: 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onChange' | 'onSubmit';
  action: {
    type: 'navigate' | 'open_url' | 'visibility' | 'scroll' | 'form_submit' | 'plugin_action';
    payload: Record<string, any>;
  };
  conditions?: InteractionCondition[];
}

interface InteractionCondition {
  field: 'viewport' | 'auth_status' | 'custom_var';
  operator: '==' | '!=' | '>' | '<';
  value: any;
}
```

### 2. The Interaction Runtime (`interactionRuntime.js`)
The runtime is a pure utility that bridges the gap between a DOM event and the CMS State.

1.  **Trigger**: The `Renderer` fires a handler (e.g., `handleClick`).
2.  **Match**: The runtime looks up the node's `interactions` array for `event === 'onClick'`.
3.  **Evaluate**: Conditions are checked against the project's current context (viewport, etc.).
4.  **Execute**: The action handler is called.
    *   `navigate` -> Updates `activePageId` in `projectStore`.
    *   `visibility` -> Updates target node's `hidden` prop in `projectStore`.

### 3. Component Style Layer (Visibility)
To support "Show/Hide" actions, the `Renderer` now injects a `display: none` style if a node has a `hidden: true` property. While editing, hidden nodes are rendered with a "Ghost" opacity (ghost-mode) to allow selection and editing.

### 4. UI: The Interaction Tab
Located in the **Properties Panel**, this tab provides:
*   **Workflow Builder**: A step-by-step UI: "When I [Event], Then [Action] with [Config]".
*   **Target Picker**: A simplified node explorer/picker for actions that target other elements (like Scroll To or Toggle Visibility).
*   **Conflict Detection**: Warnings when multiple actions are assigned to the same event without conditions.

---

### 🚀 Implementation Workflow
1.  **Data Access**: Update `projectStore.js` with `updateNodeInteractions`.
2.  **Logic Core**: Build `src/utils/interactionRuntime.js`.
3.  **UI Bridge**: Add the "Interactions" tab to `PropertiesPanel.jsx`.
4.  **Renderer Integration**: Universal event binding in `Renderer.jsx`.
