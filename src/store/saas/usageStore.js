import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const PLANS = {
    FREE: 'free',
    PRO: 'pro',
    BUSINESS: 'business',
    ENTERPRISE: 'enterprise'
};

export const PLAN_CONFIGS = {
    [PLANS.FREE]: {
        id: PLANS.FREE,
        name: 'Free Starter',
        price: 0,
        limits: {
            sites: 1,
            pagesPerSite: 10,
            buildsPerMonth: 5,
            analyticsEventsPerMonth: 5000,
            domains: 1,
            members: 2,
            apiKeys: 3,
            storageMB: 100
        }
    },
    [PLANS.PRO]: {
        id: PLANS.PRO,
        name: 'Professional',
        price: 29,
        limits: {
            sites: 5,
            pagesPerSite: 100,
            buildsPerMonth: 50,
            analyticsEventsPerMonth: 100000,
            domains: 5,
            members: 10,
            apiKeys: 15,
            storageMB: 2048 // 2GB
        }
    },
    [PLANS.BUSINESS]: {
        id: PLANS.BUSINESS,
        name: 'Business Scale',
        price: 99,
        limits: {
            sites: 25,
            pagesPerSite: 1000,
            buildsPerMonth: 500,
            analyticsEventsPerMonth: 1000000,
            domains: 25,
            members: 50,
            apiKeys: 50,
            storageMB: 10240 // 10GB
        }
    },
    [PLANS.ENTERPRISE]: {
        id: PLANS.ENTERPRISE,
        name: 'Enterprise Cloud',
        price: 499,
        limits: {
            sites: 1000,
            pagesPerSite: 10000,
            buildsPerMonth: 10000,
            analyticsEventsPerMonth: 100000000,
            domains: 1000,
            members: 500,
            apiKeys: 1000,
            storageMB: 1048576 // 1TB
        }
    }
};

export const useUsageStore = create(
    persist(
        immer((set, get) => ({
            usage: {}, // { tenantId: { month: { counts } } }
            tenantPlans: {}, // { tenantId: planId }
            loading: false,

            // Initialize a tenant's usage and plan if not exists
            initTenantUsage: (tenantId) => {
                const month = new Date().toISOString().slice(0, 7); // YYYY-MM
                if (!get().tenantPlans[tenantId] || !get().usage[tenantId] || !get().usage[tenantId][month]) {
                    set(state => {
                        if (!state.tenantPlans[tenantId]) {
                            state.tenantPlans[tenantId] = PLANS.FREE;
                        }
                        if (!state.usage[tenantId]) {
                            state.usage[tenantId] = {};
                        }
                        if (!state.usage[tenantId][month]) {
                            state.usage[tenantId][month] = {
                                analyticsEvents: 0,
                                buildsTriggered: 0,
                                storageUsedMB: 0,
                                pagesCreated: 0,
                                projectsCreated: 0,
                                apiKeysCreated: 0,
                                domainsConnected: 0,
                                membersInvited: 0
                            };
                        }
                    });
                }
            },

            incrementUsage: (tenantId, resource, amount = 1) => {
                const month = new Date().toISOString().slice(0, 7);
                get().initTenantUsage(tenantId);
                set(state => {
                    if (state.usage[tenantId]?.[month] && state.usage[tenantId][month][resource] !== undefined) {
                        state.usage[tenantId][month][resource] += amount;
                    }
                });
            },

            setUsage: (tenantId, resource, value) => {
                const month = new Date().toISOString().slice(0, 7);
                get().initTenantUsage(tenantId);
                set(state => {
                    if (state.usage[tenantId]?.[month]) {
                        state.usage[tenantId][month][resource] = value;
                    }
                });
            },

            upgradePlan: (tenantId, planId) => {
                set(state => {
                    state.tenantPlans[tenantId] = planId;
                });
            },

            // Check if a resource limit is exceeded
            checkLimit: (tenantId, resource, count = 1) => {
                const planId = get().tenantPlans[tenantId] || PLANS.FREE;
                const limits = PLAN_CONFIGS[planId].limits;
                const month = new Date().toISOString().slice(0, 7);
                const currentUsage = get().usage[tenantId]?.[month] || {};
                
                // Map store resource keys to plan limit keys if they differ
                const limitMap = {
                    analyticsEvents: 'analyticsEventsPerMonth',
                    buildsTriggered: 'buildsPerMonth',
                    storageUsedMB: 'storageMB',
                    pagesCreated: 'pagesPerSite',
                    projectsCreated: 'sites',
                    apiKeysCreated: 'apiKeys',
                    domainsConnected: 'domains',
                    membersInvited: 'members'
                };

                const limitKey = limitMap[resource] || resource;
                const limitValue = limits[limitKey];
                const currentValue = currentUsage[resource] || 0;

                if (limitValue !== undefined) {
                    return {
                        allowed: (currentValue + count) <= limitValue,
                        remaining: Math.max(0, limitValue - (currentValue + count)),
                        limit: limitValue,
                        current: currentValue,
                        usagePercent: (currentValue / limitValue) * 100
                    };
                }
                return { allowed: true, remaining: Infinity, limit: Infinity, current: currentValue, usagePercent: 0 };
            },

            getTenantUsage: (tenantId) => {
                const month = new Date().toISOString().slice(0, 7);
                return get().usage[tenantId]?.[month] || {
                    analyticsEvents: 0,
                    buildsTriggered: 0,
                    storageUsedMB: 0,
                    pagesCreated: 0,
                    projectsCreated: 0,
                    apiKeysCreated: 0,
                    domainsConnected: 0,
                    membersInvited: 0
                };
            },

            getTenantPlan: (tenantId) => {
                const planId = get().tenantPlans[tenantId] || PLANS.FREE;
                return PLAN_CONFIGS[planId];
            }
        })),
        { name: 'fs-usage-store' }
    )
);
