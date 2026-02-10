import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

/**
 * LogEntry Model
 * {
 *   logId: string,
 *   tenantId: string,
 *   userId?: string,
 *   source: "system" | "user" | "api_key" | "runtime" | "integration",
 *   type: "info" | "warn" | "error" | "security" | "deployment" | "domain" | "analytics" | "integration" | "tenant",
 *   title: string,
 *   description: string,
 *   metadata?: object,
 *   createdAt: number
 * }
 */

export const useLogStore = create(
    persist(
        immer((set, get) => ({
            logs: {
                'tenant_default': [
                    { 
                        id: 'log_1', 
                        tenantId: 'tenant_default',
                        source: 'system',
                        type: 'deployment', 
                        title: 'Build #102 Success', 
                        description: 'Production build for FlexiSite Corporate site completed in 14.2s.',
                        createdAt: Date.now() - 3600000, 
                        metadata: { buildId: 'b_102', duration: '14.2s', artifacts: 45 } 
                    },
                    { 
                        id: 'log_2', 
                        tenantId: 'tenant_default',
                        source: 'api_key',
                        type: 'security', 
                        title: 'API Access: Production SDK', 
                        description: 'API key validated for route /api/v1/pages/read.',
                        createdAt: Date.now() - 7200000, 
                        metadata: { keyId: 'key_prod_1', ip: '192.168.1.1', route: '/api/v1/pages/read' } 
                    },
                    { 
                        id: 'log_3', 
                        tenantId: 'tenant_default',
                        source: 'user',
                        type: 'tenant', 
                        title: 'Team Expansion', 
                        description: 'New user Sarah Chen (editor) invited to workspace.',
                        createdAt: Date.now() - 86400000, 
                        metadata: { invitedBy: 'user_001', email: 'sarah@example.com', role: 'editor' } 
                    },
                    { 
                        id: 'log_4', 
                        tenantId: 'tenant_default',
                        source: 'system',
                        type: 'error', 
                        title: 'DNS Verification Failure', 
                        description: 'Automated health check failed for domains: mybrand.com.',
                        createdAt: Date.now() - 90000000, 
                        metadata: { domain: 'mybrand.com', error: 'DNS_RECORD_NOT_FOUND', severity: 'high' } 
                    }
                ]
            },
            filters: {
                type: 'all',
                source: 'all',
                dateRange: 'all'
            },
            search: '',
            selectedLogId: null,
            loading: false,

            // Actions
            fetchLogs: async (tenantId) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 600)); // Simulate API delay
                set({ loading: false });
            },

            addLog: (tenantId, { source, type, title, description, metadata = {}, userId }) => set((state) => {
                if (!state.logs[tenantId]) state.logs[tenantId] = [];
                const newLog = {
                    id: `log_${nanoid(8)}`,
                    tenantId,
                    userId: userId || 'user_001',
                    source,
                    type,
                    title,
                    description,
                    metadata,
                    createdAt: Date.now()
                };
                state.logs[tenantId].unshift(newLog);
            }),

            deleteLog: (tenantId, logId) => set((state) => {
                if (state.logs[tenantId]) {
                    state.logs[tenantId] = state.logs[tenantId].filter(l => l.id !== logId);
                }
            }),

            setSearch: (query) => set({ search: query }),
            
            setFilters: (newFilters) => set((state) => {
                state.filters = { ...state.filters, ...newFilters };
            }),

            setSelectedLog: (id) => set({ selectedLogId: id }),

            exportLogs: (tenantId, format = 'json') => {
                const logs = get().logs[tenantId] || [];
                const dataStr = format === 'json' 
                    ? JSON.stringify(logs, null, 2)
                    : logs.map(l => `${new Date(l.createdAt).toISOString()},${l.type},${l.source},${l.title}`).join('\n');
                
                const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `flexisite_logs_${tenantId}.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        })),
        { name: 'fs-log-store' }
    )
);
