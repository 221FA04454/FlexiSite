import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { hashApiKey, generateRawKey } from '../../utils/security';

export const useApiKeyStore = create(
    persist(
        immer((set, get) => ({
            // apiKeys structure: { [tenantId]: [ApiKey, ...] }
            apiKeys: {},
            loading: false,

            fetchApiKeys: async (tenantId) => {
                set({ loading: true });
                // Simulate API call
                await new Promise(r => setTimeout(r, 400));
                set({ loading: false });
            },

            /**
             * Creates a new API key. 
             * Returns the RAW key to the caller so it can be shown once.
             */
            createApiKey: async (tenantId, name, permissions) => {
                const rawKey = generateRawKey();
                const hashedKey = await hashApiKey(rawKey);
                const keyId = `key_${nanoid(12)}`;

                set((state) => {
                    if (!state.apiKeys[tenantId]) state.apiKeys[tenantId] = [];
                    state.apiKeys[tenantId].push({
                        id: keyId,
                        name,
                        hashedKey: hashedKey, // ONLY store the hash
                        permissions,
                        status: 'active',
                        createdAt: Date.now(),
                        lastUsedAt: null
                    });
                });

                return { rawKey, keyId };
            },

            revokeApiKey: (tenantId, keyId) => set((state) => {
                const keys = state.apiKeys[tenantId];
                if (keys) {
                    const key = keys.find(k => k.id === keyId);
                    if (key) key.status = 'revoked';
                }
            }),

            deleteApiKey: (tenantId, keyId) => set((state) => {
                if (state.apiKeys[tenantId]) {
                    state.apiKeys[tenantId] = state.apiKeys[tenantId].filter(k => k.id !== keyId);
                }
            }),

            regenerateApiKey: async (tenantId, keyId) => {
                const rawKey = generateRawKey();
                const hashedKey = await hashApiKey(rawKey);

                set((state) => {
                    const keys = state.apiKeys[tenantId];
                    if (keys) {
                        const key = keys.find(k => k.id === keyId);
                        if (key) {
                            key.hashedKey = hashedKey;
                            key.createdAt = Date.now();
                            key.status = 'active'; // Reset status if it was revoked
                        }
                    }
                });

                return { rawKey };
            },

            updateLastUsed: (tenantId, keyId) => set((state) => {
                const keys = state.apiKeys[tenantId];
                if (keys) {
                    const key = keys.find(k => k.id === keyId);
                    if (key) key.lastUsedAt = Date.now();
                }
            })
        })),
        { name: 'fs-api-key-store-v2' } // Versioned store for new schema
    )
);
