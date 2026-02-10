# API Key Infrastructure & Security Specification

This document outlines the security architecture and backend contracts for the FlexiSite CMS API Key System.

## 🔒 Security Architecture

### 1. Zero-Trust Storage
FlexiSite **never** stores raw API keys in the database. 
- **Creation**: Keys are generated using a cryptographically secure pseudo-random number generator (CSPRNG).
- **Hashing**: Keys are immediately hashed using **SHA-256** before storage.
- **Verification**: Incoming keys from API requests are hashed and compared against the stored hash.

### 2. Standardized Prefixing
All keys follow a standardized prefix for easy identification by security scanners and developers:
- **Format**: `fs_live_[a-f0-9]{48}`
- **Prefix**: `fs_live_` (FlexiSite Live)

### 3. Scoping & Isolation
- **Tenant Bound**: Keys are strictly scoped to a `tenantId`. A key created for Workspace A cannot access Workspace B.
- **RBAC Enforcement**: Only users with `Owner` or `Admin` roles can create, view metadata, or revoke keys.

---

## 🛰️ Backend API Contract

### 1. Create Key
Returns the raw key **exactly once**.
- **Method**: `POST`
- **Path**: `/api/v1/keys`
- **Body**: `{ "tenantId": "string", "name": "string", "permissions": ["string", ...] }`
- **Response**: `201 Created`
```json
{
  "keyId": "key_xyz",
  "rawKey": "fs_live_abc123..."
}
```

### 2. Verify Key (Internal Middleware)
Used by the API Gateway to authorize incoming developer requests.
- **Logic**:
  1. Extract `Bearer` token from `Authorization` header.
  2. Compute `hash = SHA256(token)`.
  3. Query `api_keys` table where `hashedKey = hash`.
  4. Validate `status == 'active'`.
  5. Check if `permissions` array contains the `required_permission` for the requested endpoint.

---

## 🛠️ Developer Best Practices

1. **Environment Variables**: Never hardcode API keys. Use `PROCESS.ENV.FS_API_KEY`.
2. **Key Rotation**: We recommend rotating keys every 90 days.
3. **Least Privilege**: Only assign the minimum permissions necessary for the specific integration.
