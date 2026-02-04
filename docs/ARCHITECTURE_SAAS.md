# ☁️ FlexiSite SaaS & Deployment Engine
## Architecture Specification (v2.0)

**Status**: implementation_plan  
**Role**: Principal SaaS Architect  
**Objective**: Transform FlexiSite from a builder into a multi-tenant SaaS platform capable of managing thousands of unique designers, projects, and deployments with enterprise-grade security.

---

### 1. Multi-Tenant Data Core
The system utilizes a relational-first document structure to handle the complex hierarchy of owners, teams, and projects.

#### 🏗️ Schema Definitions
*   **Tenant (Workspace)**: The root entity (e.g., "EduMon Marketing Team"). Controls billing, API keys, and custom domains.
*   **Permissions**: A Role-Based Access Control (RBAC) system with four tiers: `Owner`, `Admin`, `Editor`, `Viewer`.
*   **Deployments**: Immutable snapshots of the project tree, linked to a specific build version and CDN edge URL.

### 2. Deployment & Hosting Pipeline
Integrates with the **Publishing Pipeline (v1.6)** to move code from the canvas to the edge.

1.  **Build Trigger**: User clicks "Publish" → CMS executes `generateStaticSite()`.
2.  **Versioning**: The build is hashed (SHA-256) and stored in the `Deployment Log`.
3.  **Edge Mapping**: The custom domain (e.g., `brand.com`) is updated to point to the latest build hash.
4.  **Rollback**: Switching to an older version simply updates the domain pointer to a previous hash, enabling near-instant 0-second reverts.

### 3. API Key & Security Infrastructure
Supports high-security site embedding and micro-frontend modules.
*   **Scope Enforcement**: Keys can be scoped to specific projects or actions (e.g., `read_only`, `publish_internal`).
*   **JWT Handshake**: External embeds use a signed JWT to verify the tenant's identity before loading private JSON trees.

### 4. Usage & Analytics Credits
Foundation for the commercial layer:
*   **Event Quotas**: Tracks monthly tracking events captured by the **Analytics Engine (v1.9)**.
*   **Bandwidth Gauging**: Measures data transferred from the CDN to end-users.
*   **Soft-Limits**: Tenants are notified at 80%/100% usage before service throttling occurs.

---

### 🚀 Implementation Workflow
1.  **The Store**: Build `src/store/saasStore.js` (The SaaS State).
2.  **Admin UI**: Build `src/components/builder/AdminDashboard.jsx`.
3.  **Domain Wizard**: Create the DNS verification logic within the Admin UI.
4.  **Toolbar Bridge**: Add the **Admin (Settings)** icon to the builder.
