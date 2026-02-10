# Tenant Management API Specification

Endpoints for managing multi-tenant workspaces and memberships.

## Base URL: `/api/v1/tenants`

### 1. Fetch Tenants
Returns all workspaces accessible by the current user.
- **Method**: `GET`
- **Path**: `/`
- **Auth**: Required
- **Response**: `200 OK`
```json
[
  {
    "id": "tenant_123",
    "name": "Design Studio",
    "role": "owner",
    "memberCount": 5
  }
]
```

### 2. Create Tenant
Provisions a new isolated workspace.
- **Method**: `POST`
- **Path**: `/`
- **Body**: `{ "name": "string", "description": "string" }`
- **Response**: `201 Created`

### 3. Update Tenant Settings
Updates branding or general information.
- **Method**: `PATCH`
- **Path**: `/:tenantId`
- **Permission**: `manage_tenants` or `owner`
- **Body**: `{ "name": "string", "logoUrl": "string" }`

### 4. Manage Membership
Invite users or update roles.
- **Method**: `POST`
- **Path**: `/:tenantId/invite`
- **Body**: `{ "email": "string", "role": "editor" }`

### 5. Resource Limits
Enforce or update quotas (Enterprise Admin only).
- **Method**: `PATCH`
- **Path**: `/:tenantId/limits`
- **Body**: `{ "builds_quota": 5000 }`

### 6. Delete Tenant
Permanently destroys the tenant and all child entities.
- **Method**: `DELETE`
- **Path**: `/:tenantId`
- **Permission**: `owner` only.
