---
description: SaaS Operations & Tenant Lifecycle Management
---
# SaaS Management Workflow

This workflow outlines how to manage the multi-tenant SaaS infrastructure of FlexiSite CMS.

## 1. Tenant Provisioning
1. Navigate to **Tenants** in the sidebar.
2. Click **Add New Workspace**.
3. Choose a plan (Free/Scale/Enterprise).
4. Invite users by email and assign roles (Owner, Admin, Editor, Viewer).

## 2. Infrastructure Setup
1. Switch to the target tenant using the **TopBar Dropdown**.
2. Go to **Domains** to connect custom URLs.
3. Configure DNS records (A/CNAME) as provided in the instructions.
4. Go to **API Keys** to generate development or production keys for external SDK access.

## 3. Deployment Pipeline
1. In the **Builder**, design your project.
2. Click **Publish** in the top-right toolbar.
3. Track the build progress in **Deployments**.
4. Use the **Rollback** button to revert to a previous immutable build if errors are detected.

## 4. Monitoring & Integrations
1. Use **Analytics** to monitor real-time visitor sessions and conversion metrics.
2. Check **System Logs** for security audits and API usage history.
3. Configure **Webhooks** in the **Integrations** panel to sync data with external CRM or CI/CD pipelines.

## 5. Billing & Quotas
1. Monitor resource consumption (Builds, Storage, Bandwidth) in **Usage**.
2. Upgrade plan if quotas are nearing 100% to avoid service interruption.
