# FlexiSite Usage & Billing Foundation (Day 27)

## 🏗 Architecture
The Usage & Billing system provides a robust framework for tracking resource consumption and enforcing plan entitlements across the multi-tenant SaaS ecosystem.

### 📡 Data Flow
1. **Action Trigger**: User attempts a resource-intensive action (e.g., Invite Member).
2. **Limit Check**: The component calls `checkLimit(tenantId, resource)`.
3. **Enforcement**:
   - If **Allowed**: Action proceeds, then `incrementUsage(tenantId, resource)` is called.
   - If **Blocked**: `LimitWarningModal` is displayed, guiding the user to upgrade.
4. **Synchronization**: Usage metrics are persisted in the `usageStore` and reset monthly.

---

## 💎 Plan Matrix

| Resource Vector | Free | Pro | Business | Enterprise |
| :--- | :---: | :---: | :---: | :---: |
| **Site Projects** | 1 | 5 | 25 | 1,000 |
| **Pages per Site** | 10 | 100 | 1,000 | 10,000 |
| **Monthly Builds** | 5 | 50 | 500 | 10,000 |
| **Analytics (mo)** | 5k | 100k | 1M | 100M |
| **Custom Domains** | 1 | 5 | 25 | 1,000 |
| **Team Seats** | 2 | 10 | 50 | 500 |
| **API Keys** | 3 | 15 | 50 | 1,000 |
| **Cloud Storage** | 100MB | 2GB | 10GB | 1TB |

---

## 🛠 Active Enforcement Points

| Module | Resource Checked | Action Blocked |
| :--- | :--- | :--- |
| **Deployments** | `buildsPerMonth` | Block new production publish |
| **API Keys** | `apiKeys` | Block generation of new keys |
| **Domains** | `domains` | Block connection of new hostnames |
| **Team** | `members` | Block invitations to new teammates |
| **Analytics** | `analyticsEvents` | Metering active (soft limit warnings) |

---

## 🚀 Components Implemented
- **`UsageDashboard`**: Central command for resource monitoring.
- **`UsageSummaryCards`**: High-level visual metrics.
- **`UsageProgressBars`**: Gradient-filled quota saturation tracks.
- **`PlanInfoCard`**: Enterprise-grade active plan summary.
- **`UpgradePlanModal`**: Multi-tier pricing and feature comparison.
- **`LimitWarningModal`**: Hard-limit intervention UI.

---

## 📡 API Contract (Backend Integration Ready)
- `GET /api/plan?tenantId=...`
- `GET /api/usage?tenantId=...`
- `POST /api/usage/update { tenantId, resource, amount }`
- `GET /api/plan/compare?currentPlan=...&targetPlan=...`
