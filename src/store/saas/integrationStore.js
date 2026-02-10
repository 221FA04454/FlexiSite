import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

export const useIntegrationStore = create(
    persist(
        immer((set, get) => ({
            integrations: {
                'tenant_default': {
                    allowedDomains: ['*.flexisite.io', 'localhost:3000'],
                    webhooks: [
                        { id: 'wh_1', url: 'https://api.external-app.com/hooks/flexi', events: ['publish'], status: 'active' }
                    ]
                }
            },

            addWebhook: (tenantId, url, events) => set((state) => {
                if (!state.integrations[tenantId]) {
                    state.integrations[tenantId] = { allowedDomains: [], webhooks: [] };
                }
                state.integrations[tenantId].webhooks.push({
                    id: nanoid(6),
                    url,
                    events,
                    status: 'active'
                });
            }),

            updateAllowedDomains: (tenantId, domains) => set((state) => {
                if (state.integrations[tenantId]) {
                    state.integrations[tenantId].allowedDomains = domains;
                }
            })
        })),
        { name: 'fs-integration-store' }
    )
);
