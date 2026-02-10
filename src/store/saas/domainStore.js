import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

export const DOMAIN_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    FAILED: 'failed'
};

export const SSL_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    ERROR: 'error'
};

export const HEALTH_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline'
};

export const useDomainStore = create(
    persist(
        immer((set, get) => ({
            // Structure: { [tenantId]: [Domain, ...] }
            domains: {
                'tenant_default': [
                    {
                        id: 'dom_1',
                        tenantId: 'tenant_default',
                        projectId: 'proj_1',
                        domainName: 'flexisite.io',
                        isPrimary: true,
                        dnsStatus: DOMAIN_STATUS.VERIFIED,
                        sslStatus: SSL_STATUS.ACTIVE,
                        health: HEALTH_STATUS.ONLINE,
                        createdAt: Date.now() - 86400000 * 30,
                        lastCheckedAt: Date.now(),
                        lastDeploymentVersion: 'v2.1.0'
                    }
                ]
            },
            loading: false,

            fetchDomains: async (tenantId) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 500));
                set({ loading: false });
            },

            addDomain: async (tenantId, { domainName, projectId }) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 800));
                
                const newDomain = {
                    id: `dom_${nanoid(8)}`,
                    tenantId,
                    projectId,
                    domainName,
                    isPrimary: false,
                    dnsStatus: DOMAIN_STATUS.PENDING,
                    sslStatus: SSL_STATUS.PENDING,
                    health: HEALTH_STATUS.OFFLINE,
                    createdAt: Date.now(),
                    lastCheckedAt: Date.now(),
                };

                set((state) => {
                    if (!state.domains[tenantId]) state.domains[tenantId] = [];
                    state.domains[tenantId].push(newDomain);
                });
                set({ loading: false });
                return newDomain;
            },

            verifyDNS: async (tenantId, domainId) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 1500));
                
                set((state) => {
                    const domains = state.domains[tenantId];
                    const dom = domains?.find(d => d.id === domainId);
                    if (dom) {
                        // Logic simulation: Randomly succeed or fail
                        dom.dnsStatus = Math.random() > 0.3 ? DOMAIN_STATUS.VERIFIED : DOMAIN_STATUS.FAILED;
                        dom.lastCheckedAt = Date.now();
                    }
                });
                set({ loading: false });
            },

            provisionSSL: async (tenantId, domainId) => {
                set((state) => {
                    const dom = state.domains[tenantId]?.find(d => d.id === domainId);
                    if (dom) dom.sslStatus = SSL_STATUS.PENDING;
                });
                
                await new Promise(r => setTimeout(r, 2000));
                
                set((state) => {
                    const domains = state.domains[tenantId];
                    const dom = domains?.find(d => d.id === domainId);
                    if (dom) dom.sslStatus = SSL_STATUS.ACTIVE;
                });
            },

            deleteDomain: (tenantId, domainId) => set((state) => {
                if (state.domains[tenantId]) {
                    state.domains[tenantId] = state.domains[tenantId].filter(d => d.id !== domainId);
                }
            }),

            mapDomainToProject: (tenantId, domainId, projectId) => set((state) => {
                const dom = state.domains[tenantId]?.find(d => d.id === domainId);
                if (dom) dom.projectId = projectId;
            }),

            setPrimary: (tenantId, domainId) => set((state) => {
                state.domains[tenantId]?.forEach(d => {
                    d.isPrimary = d.id === domainId;
                });
            }),

            checkHealth: async (tenantId, domainId) => {
                set((state) => {
                    const domains = state.domains[tenantId];
                    const dom = domains?.find(d => d.id === domainId);
                    if (dom) {
                        dom.health = Math.random() > 0.1 ? HEALTH_STATUS.ONLINE : HEALTH_STATUS.OFFLINE;
                        dom.lastCheckedAt = Date.now();
                    }
                });
            }
        })),
        { name: 'fs-domain-store' }
    )
);
