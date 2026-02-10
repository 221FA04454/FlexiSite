# Deployment Pipeline & CDN Orchestration

This document specifies the technical architecture for the FlexiSite CMS deployment pipeline, build versioning, and edge distribution.

## 🏗️ Build Lifecycle Architecture

FlexiSite uses an isolated worker-based build system.

1.  **Trigger Phase**:
    *   Initiated by UI ("Publish") or API Key (CI/CD).
    *   System creates a `PENDING` record in the `deployments` table.
2.  **Transpilation Phase**:
    *   Worker fetches the Project JSON (DOM structure + Styles).
    *   Generates a standalone `index.html` using the `StaticRenderer`.
    *   Transpiles Tailwind/CSS into a minified `theme.css`.
3.  **Artifact Generation**:
    *   Assets are bundled into a semantic versioned folder: `/builds/{tenantId}/{projectId}/{version}/`.
    *   A `.zip` archive is generated for manual downloads.
4.  **CDN Routing (The "Switch")**:
    *   On `SUCCESS`, the Global Edge Router (Anycast) updates its cache-key mapping.
    *   The `active_version` pointer for the domain is updated in Redis for 40ms switchover.

## 🔢 Semantic Versioning (SemVer)

FlexiSite uses a deterministic versioning pattern:
- **Major**: Incremented on platform-wide runtime engine upgrades.
- **Minor**: Incremented when new core components are added to the project.
- **Patch**: Incremented for every manual "Publish" (e.g., `v1.2.45` → `v1.2.46`).

## 🛰️ Backend API Contract (v1)

### 1. Trigger Build
- **POST** `/api/v1/deployments`
- **Body**: `{ "projectId": "uuid", "triggeredBy": "user|api|system" }`
- **Returns**: `201 Created` with `deploymentId`.

### 2. Stream Logs
- **GET** `/api/v1/deployments/:id/logs`
- **Protocol**: Server-Sent Events (SSE) for real-time log tails.

### 3. Rollback
- **POST** `/api/v1/deployments/:id/rollback`
- **Effect**: Immediately updates the domain's version pointer to the specified ID.

### 4. Download Artifact
- **GET** `/api/v1/deployments/:id/download`
- **Returns**: `application/zip`

---

## 🛡️ Errors & Failures

| Error Code | Meaning | Resolution |
| :--- | :--- | :--- |
| `ERR_WORKER_OFFLINE` | No build nodes available. | Retry in 30s. |
| `ERR_TRANSPILE_DOM` | Invalid nested component structure. | Check editor for circular dependencies. |
| `ERR_CDN_SYNC` | Edge nodes failed to pull artifact. | System keeps old version live. |
