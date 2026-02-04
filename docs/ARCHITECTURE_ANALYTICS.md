# 📊 FlexiSite Analytics Engine
## Architecture Specification (v1.9)

**Status**: implementation_plan  
**Role**: Principal Full-Stack Architect  
**Objective**: Provide a low-latency, privacy-first behavior tracking system that gives tenants deep insights into user engagement, conversion funnels, and component performance.

---

### 1. Unified Analytics Data Model
All events follow a serialized schema to ensure high-velocity ingestion and cross-platform compatibility.

```typescript
interface AnalyticsEvent {
  eventId: string;     // Unique nano-id
  type: 'view' | 'click' | 'scroll' | 'submit' | 'custom';
  pageId: string;      // Contextual page
  nodeId?: string;     // Target component (if applicable)
  tenantId: string;    // Multi-tenant scope
  sessionId: string;   // Anonymous session identifier
  timestamp: number;   // UTC Epoch
  metadata: {
    viewport: 'mobile' | 'tablet' | 'desktop';
    path: string;      // Current slug
    scrollDepth?: number; // 0-100 percentage
    duration?: number; // Time spent on node/page
  };
}
```

### 2. Runtime Tracking Engine (`analyticsTracker.js`)
A lightweight agent that runs alongside the **Interaction Engine (v1.5)** to capture events without impacting UI performance.

#### 🛡️ Tracking Strategies
*   **Memory Buffering**: Events are held in a 10-event buffer to minimize HTTP overhead.
*   **Beacon API**: Uses `navigator.sendBeacon` for "Unload" events to ensure data is captured even when a user closes the tab.
*   **Event Intersection**: Uses `IntersectionObserver` to track "Impression" metrics (e.g., "Was this image actually seen?").

### 3. The Analytics Dashboard
A dedicated environment within the CMS to visualize performance data:
*   **Trends**: Real-time traffic graphs via lightweight SVG or Chart.js logic.
*   **Hot-Nodes**: Highlighting which components (Buttons/Forms) are driving the most interactions.
*   **Funnel View**: Tracking the journey from `Landing Page` -> `CTA Click` -> `Form Submit`.

### 4. Privacy & Compliance (GDPR)
*   **Zero PII**: No IP addresses or email addresses are stored in the analytics log by default.
*   **Strict Anonymization**: All session IDs are transient and reset every 24 hours.
*   **Opt-out Logic**: Supports a `window.fs_disable_tracking = true` flag for cookie consent compliance.

---

### 🚀 Implementation Workflow
1.  **The Agent**: Build `src/utils/analyticsTracker.js`.
2.  **Logic Hook**: Inject tracking calls into `src/utils/interactionRuntime.js`.
3.  **UI Module**: Build `src/components/builder/AnalyticsDashboard.jsx`.
4.  **Reporting Store**: Create `src/store/analyticsStore.js` to manage dashboard state.
5.  **Toolbar Bridge**: Add the **Analytics (BarChart)** icon to the builder.
