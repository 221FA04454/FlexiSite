# FlexiSite Enterprise Logs & Monitoring System (Day 26)

## 🏗 Architecture Overview
The Logs & Monitoring system is designed as an immutable audit trail for multi-tenant enterprise operations. It utilizes a centralized `logStore` (Zustand) for state management and an event-driven logging utility that is integrated across all SaaS infrastructure modules.

### 📡 Data Flow
1. **Event Trigger**: A user action (e.g., deleting a domain) or system event (e.g., build success) occurs.
2. **Log Emission**: The component calls `addLog(tenantId, logData)`.
3. **Ingestion**: The `logStore` adds the entry to the tenant-isolated log stack.
4. **Broadcast**: In a production environment, this event is pushed to the Logs API and a real-time WebSocket stream.
5. **Consumption**: The `LogsDashboard` renders the events with specialized badges (`SourceBadge`, `TypeBadge`, `TimestampBadge`).

---

## 📄 Backend API Contract

### 1. Fetch Logs
**Endpoint**: `GET /api/saas/logs`
**Query Parameters**:
- `tenantId`: string (required)
- `type`: "deployment" | "security" | "error" | "api_key" | "domain" | "analytics" | "integration" | "tenant" | "all"
- `source`: "system" | "user" | "api_key" | "runtime" | "integration" | "all"
- `page`: number (default: 1)
- `limit`: number (default: 50)
- `search`: string (optional)
- `dateRange`: "24h" | "7d" | "30d" | "all"

**Response**:
```json
{
  "logs": [
    {
      "id": "log_a1b2c3d4",
      "tenantId": "tenant_default",
      "userId": "user_001",
      "source": "user",
      "type": "deployment",
      "title": "Instant Rollback: v1.0.4",
      "description": "User triggered an immediate rollback for project proj_1.",
      "metadata": { "projectId": "proj_1", "version": "1.0.4" },
      "createdAt": 1739185200000
    }
  ],
  "pagination": { "total": 1250, "pages": 25, "currentPage": 1 }
}
```

### 2. Export Logs
**Endpoint**: `GET /api/saas/logs/export`
**Query Parameters**:
- `tenantId`: string (required)
- `format`: "json" | "csv" (default: "json")

---

## 🛡 Security & Permissions

| Role | View Logs | Delete Logs | Export Logs |
| :--- | :---: | :---: | :---: |
| **Owner** | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ |
| **Editor** | ❌ (Denied) | ❌ | ❌ |
| **Viewer** | ❌ (Denied) | ❌ | ❌ |

---

## 🛠 Integrated Event Hooks

| System | Event Type | Description |
| :--- | :--- | :--- |
| **Deployments** | `deployment` | Rollbacks, Build Status, CDN Syncs |
| **API Keys** | `security` | Key Revocation, Deletion, Access Violations |
| **Domains** | `domain` | Connecting/Disconnecting Domains, SSL Events |
| **Tenants** | `tenant` | Role Updates, Member Removal, Profile Changes |
| **Analytics** | `analytics` | Manual Refreshes, Threshold Alerts (Future) |

---

## 🚀 Future Roadmap
- **Log Archival**: S3-backed long-term storage for logs > 90 days.
- **Webhook Alerts**: Trigger Slack/Discord notifications on `type: "error"` or `type: "security"`.
- **SIEM Integration**: Export logs to Datadog or Splunk via standard HEC (HTTP Event Collector).
