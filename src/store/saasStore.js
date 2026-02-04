import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

/**
 * FlexiSite SaaS & Deployment Store
 * Manages Multi-tenancy, API Keys, and Build History
 */
export const useSaaSStore = create(
    persist(
        immer((set, get) => ({
            // Current Session Data
            activeTenantId: 'tenant_default',
            
            // Tenants Map
            tenants: {
                'tenant_default': {
                    id: 'tenant_default',
                    name: 'Main Workspace',
                    plan: 'pro',
                    apiKeys: [
                        { id: 'key_1', value: 'fs_live_a7f92b...', permissions: ['read', 'write', 'publish'], status: 'active' }
                    ],
                    domains: [
                        { domain: 'flexisite.app', status: 'verified', ssl: true }
                    ],
                    deployments: [
                        { id: 'build_102', version: '1.2.4', date: Date.now(), status: 'success', url: 'https://v1-2-4.flexisite.cdn' }
                    ]
                }
            },

            // --- ACTIONS ---

            createApiKey: () => set((state) => {
                const tenant = state.tenants[state.activeTenantId];
                if (tenant) {
                    tenant.apiKeys.push({
                        id: nanoid(6),
                        value: `fs_live_${nanoid(16)}`,
                        permissions: ['read', 'publish'],
                        status: 'active',
                        createdAt: Date.now()
                    });
                }
            }),

            addDomain: (domain) => set((state) => {
                const tenant = state.tenants[state.activeTenantId];
                if (tenant) {
                    tenant.domains.push({
                        domain,
                        status: 'pending',
                        ssl: false
                    });
                }
            }),

            recordDeployment: (buildInfo) => set((state) => {
                const tenant = state.tenants[state.activeTenantId];
                if (tenant) {
                    tenant.deployments.unshift({
                        id: `build_${Date.now()}`,
                        ...buildInfo,
                        date: Date.now(),
                        status: 'success'
                    });
                }
            })
        })),
        { name: 'flexisite-saas-store-v1' }
    )
);
