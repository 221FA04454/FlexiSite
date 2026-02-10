# Domain Infrastructure Specification

This document outlines the architecture for custom domain management, DNS verification, and Edge SSL provisioning in FlexiSite CMS.

## 📡 DNS Configuration Architecture

FlexiSite leverages a global Anycast CDN. Domains must be pointed to our edge using the following records:

### 1. Verification Logic
- **Path**: `POST /api/v1/domains/:id/verify`
- **Mechanism**: Backend performs a recursive DNS lookup.
- **Success Criteria**:
  - `CNAME` points to `cname.flexisite.net` OR
  - `A Record` matches `123.45.67.89` OR
  - `TXT Record` `_flexisite-challenge` matches the unique tenant UID.

### 2. Edge SSL Provisioning
- **Provider**: Let's Encrypt (Automated via ACME protocol).
- **Workflow**:
  1. Service detects `dnsStatus == 'verified'`.
  2. ACME HTTP-01 challenge is triggered.
  3. Certificate is issued and pushed to global edge nodes.
  4. Auto-renewal expires 30 days before deadline.

## 🛠️ Infrastructure States

| State | Context | UI Hint |
| :--- | :--- | :--- |
| `pending` | DNS not yet configured/propagated. | "Checking DNS..." |
| `verified` | DNS records matched successfully. | "DNS Verified" (Green) |
| `failed` | Records incorrect after manual check. | "Verification Failed" |
| `SSL:active`| Certificate provisioned at edge. | "SSL Active" |

## 🚀 Mapping & Routing
When a domain is "Mapped" to a `projectId`:
- The CDN Gateway uses the `Host` header to resolve the `tenantId`.
- It fetches the `activeDeploymentVersion` for that project.
- Requests are served from: `gs://flexisite-builds/{tenantId}/{projectId}/{version}/index.html`.

## 🛡️ Security Rules
- Only **Owners/Admins** can manage domains.
- CORS policies in `IntegrationPanel` are automatically updated when a domain is verified.
- Max 50 domains per tenant (Enterprise) or 1 (Free).
