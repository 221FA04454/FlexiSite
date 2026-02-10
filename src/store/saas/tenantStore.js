import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

// Constants for Roles
export const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer'
};

export const useTenantStore = create(
    persist(
        immer((set, get) => ({
            tenants: {
                'tenant_default': {
                    id: 'tenant_default',
                    name: 'Main Workspace',
                    description: 'Primary workspace for enterprise assets.',
                    logoUrl: null,
                    faviconUrl: null,
                    createdAt: Date.now(),
                    ownerId: 'user_001',
                    members: [
                        { userId: 'user_001', role: ROLES.OWNER, invitedAt: Date.now(), status: 'active', email: 'architect@flexisite.io', name: 'Architect' }
                    ],
                    limits: {
                        sites: 50,
                        pages: 500,
                        builds: 1000,
                        storageMB: 10240, // 10GB
                        analyticsEvents: 1000000
                    },
                    plan: 'enterprise'
                }
            },
            activeTenantId: 'tenant_default',
            loading: false,

            // Actions
            fetchTenants: async () => {
                set({ loading: true });
                // Mock API delay
                await new Promise(r => setTimeout(r, 500));
                set({ loading: false });
            },

            setActiveTenant: (id) => set((state) => { 
                state.activeTenantId = id; 
                // Note: Logic to clear project/page stores should be triggered via a subscriber or effect 
                // to avoid direct store-to-store circular dependencies if possible, 
                // or handled in the switchTenant action which can be called by UI.
            }),

            switchTenant: (id) => {
                // This is the primary method to switch tenants
                set((state) => { state.activeTenantId = id; });
                
                // Clear ephemeral states in other stores
                // We typically use window.location.reload() or explicit clear actions
                // For this implementation, we will BROADCAST a message or expect components to react to activeTenantId change.
            },
            
            createTenant: (data) => set((state) => {
                const id = `tenant_${nanoid(8)}`;
                state.tenants[id] = {
                    id,
                    name: data.name,
                    description: data.description || '',
                    logoUrl: data.logoUrl || null,
                    faviconUrl: data.faviconUrl || null,
                    createdAt: Date.now(),
                    ownerId: 'user_001', // Mocking current user context
                    members: [
                        { userId: 'user_001', role: ROLES.OWNER, invitedAt: Date.now(), status: 'active', email: 'architect@flexisite.io', name: 'Architect' }
                    ],
                    limits: {
                        sites: 5,
                        pages: 20,
                        builds: 100,
                        storageMB: 1024,
                        analyticsEvents: 50000
                    },
                    plan: 'free'
                };
            }),

            updateTenant: (id, updates) => set((state) => {
                if (state.tenants[id]) {
                    Object.assign(state.tenants[id], updates);
                }
            }),

            deleteTenant: (id) => set((state) => {
                delete state.tenants[id];
                if (state.activeTenantId === id) {
                    state.activeTenantId = Object.keys(state.tenants)[0] || null;
                }
            }),

            inviteUser: (tenantId, email, role) => set((state) => {
                const tenant = state.tenants[tenantId];
                if (tenant) {
                    tenant.members.push({
                        userId: nanoid(6),
                        name: email.split('@')[0],
                        email,
                        role,
                        invitedAt: Date.now(),
                        status: 'pending'
                    });
                }
            }),

            updateLimits: (id, limits) => set((state) => {
                if (state.tenants[id]) {
                    state.tenants[id].limits = { ...state.tenants[id].limits, ...limits };
                }
            }),

            removeMember: (tenantId, userId) => set((state) => {
                const tenant = state.tenants[tenantId];
                if (tenant) {
                    tenant.members = tenant.members.filter(m => m.userId !== userId);
                }
            }),

            updateMemberRole: (tenantId, userId, newRole) => set((state) => {
                const tenant = state.tenants[tenantId];
                if (tenant) {
                    const member = tenant.members.find(m => m.userId === userId);
                    if (member) member.role = newRole;
                }
            })
        })),
        { name: 'fs-tenant-store' }
    )
);
