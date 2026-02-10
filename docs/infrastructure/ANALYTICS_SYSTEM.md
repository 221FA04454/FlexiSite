# Site Intelligence & Behavioral Analytics Specification

FlexiSite CMS provides a high-fidelity behavior tracking engine that operates at both the **Project** and **Component** level. This documentation outlines the telemetry architecture and data aggregation models.

## 📡 Telemetry Architecture

The FlexiSite Runtime (`runtime.js`) automatically instruments every published site with lightweight event listeners:

### 1. Unified Event Model
All client-side events follow the `AnalyticsEvent` schema:
- **`view`**: Triggered on page load and SPA navigation.
- **`click`**: Captures `componentId`, `x/y` coordinates, and inner text.
- **`scroll`**: Threshold-based reporting (25%, 50%, 75%, 100%).
- **`form_submit`**: Captured when a FlexiSite form is successfully validated.

### 2. Privacy-First Tracking
- All IP addresses are anonymized before storage.
- No PII is collected by default.
- Session IDs are rotated every 24 hours.

---

## 🛰️ Backend Aggregation Contract

### 1. Global Overview
- **Path**: `GET /api/v1/analytics/overview`
- **Params**: `tenantId`, `projectId`, `dateRange`
- **Logic**: Aggregates records from the primary time-series DB (e.g., InfluxDB or TimescaleDB).

### 2. Precision Heatmaps (Phase 2)
- **Path**: `GET /api/v1/analytics/heatmap/:pageId`
- **Returns**: A coordinate density map for click and hover events.
- **UI Logic**: Overlaying an SVG canvas on top of the `StaticRenderer` frame.

--

## 📊 Business Intelligence Metrics

| Metric | Calculation | Goal |
| :--- | :--- | :--- |
| **Engagement Rate** | `(Click Events + Scroll Thresholds) / Total Views` | > 60% |
| **Conversion (CR)** | `Form Submissions / Unique Visitors` | > 3.5% |
| **Edge Latency** | `Time to Interactive (TTI)` | < 800ms |

## 🛠️ Developer Export Options
Integrated support for programmatic data retrieval:
- **CSV**: Weekly site reports for SEO audits.
- **JSON**: Raw event streaming for external BigQuery/Snowflake integration via **API Keys**.
