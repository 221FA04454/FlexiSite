# Tenant Data Model & Database Schema

This document defines the relational structure for the Multi-Tenant Architecture in FlexiSite CMS.

## Tables

### 1. `tenants`
Stores the core identity and branding of a workspace.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique tenant identifier. |
| `name` | VARCHAR(255) | Display name of the workspace. |
| `description` | TEXT | Internal workspace description. |
| `logo_url` | TEXT | URL to branded logo asset. |
| `favicon_url` | TEXT | URL to branded favicon asset. |
| `owner_id` | UUID (FK) | Reference to the `users` table. |
| `plan` | ENUM | `free`, `scale`, `enterprise`. |
| `created_at` | TIMESTAMPTZ | Creation timestamp. |

### 2. `tenant_members`
Intersection table for User-Tenant relationships with RBAC roles.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Membership identifier. |
| `tenant_id` | UUID (FK) | Reference to `tenants.id`. |
| `user_id` | UUID (FK) | Reference to global `users.id`. |
| `role` | ENUM | `owner`, `admin`, `editor`, `viewer`. |
| `status` | ENUM | `active`, `pending`, `suspended`. |
| `invited_at` | TIMESTAMPTZ | Time of invitation. |

### 3. `tenant_limits`
Quota definitions for resource enforcement.

| Column | Type | Description |
| :--- | :--- | :--- |
| `tenant_id` | UUID (FK) | Reference to `tenants.id`. |
| `sites_quota` | INT | Max allowed projects. |
| `pages_quota` | INT | Max allowed pages per site. |
| `builds_quota` | INT | Monthly build allowance. |
| `storage_mb` | INT | Data storage limit in Megabytes. |
| `analytics_events`| INT | Monthly visitor event quota. |

## Isolation Strategy
Every query to the following tables **MUST** include a `tenant_id` filter:
- `projects`
- `domains`
- `api_keys`
- `deployment_history`
- `analytics_data`
