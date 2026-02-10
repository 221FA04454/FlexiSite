import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

export const DEPLOY_STATUS = {
    PENDING: 'pending',
    BUILDING: 'building',
    SUCCESS: 'success',
    FAILED: 'failed'
};

export const TRIGGER_TYPES = {
    USER: 'user',
    API: 'api_key',
    SYSTEM: 'system'
};

export const useDeploymentStore = create(
    persist(
        immer((set, get) => ({
            // deployments structure: { [projectId]: [Deployment, ...] }
            deployments: {},
            loading: false,

            fetchDeployments: async (projectId) => {
                set({ loading: true });
                // Simulate production latency
                await new Promise(r => setTimeout(r, 600));
                set({ loading: false });
            },

            triggerDeployment: async (projectId, tenantId, triggeredBy = TRIGGER_TYPES.USER) => {
                const deploymentId = `dep_${nanoid(12)}`;
                const version = `v1.0.${(get().deployments[projectId]?.length || 0) + 1}`;
                
                const newDeployment = {
                    id: deploymentId,
                    tenantId,
                    projectId,
                    version,
                    status: DEPLOY_STATUS.BUILDING,
                    triggeredBy,
                    meta: {
                        domainId: 'dom_1', // Default domain linkage
                    },
                    createdAt: Date.now(),
                    logs: [
                        'Initializing build environment...',
                        'System check: isolated worker node assigned.',
                        'Fetching project schema from multi-tenant core...'
                    ],
                    buildSize: 0
                };

                set((state) => {
                    if (!state.deployments[projectId]) state.deployments[projectId] = [];
                    state.deployments[projectId].unshift(newDeployment);
                });

                // Simulate build process
                setTimeout(() => {
                    get().addLog(projectId, deploymentId, 'Transpiling React components to optimized static HTML...');
                }, 1000);

                setTimeout(() => {
                    get().addLog(projectId, deploymentId, 'Minifying CSS and injecting hydration runtime...');
                }, 2000);

                setTimeout(() => {
                    get().completeDeployment(projectId, deploymentId, true);
                }, 4000);

                return deploymentId;
            },

            addLog: (projectId, deploymentId, logLine) => set((state) => {
                const dep = state.deployments[projectId]?.find(d => d.id === deploymentId);
                if (dep) dep.logs.push(logLine);
            }),

            completeDeployment: (projectId, deploymentId, success) => set((state) => {
                const dep = state.deployments[projectId]?.find(d => d.id === deploymentId);
                if (dep) {
                    dep.status = success ? DEPLOY_STATUS.SUCCESS : DEPLOY_STATUS.FAILED;
                    dep.completedAt = Date.now();
                    dep.buildSize = success ? Math.floor(Math.random() * 5000) + 1024 : 0; // KB
                    dep.logs.push(success ? '--- DEPLOYMENT SUCCESSFUL ---' : '--- DEPLOYMENT FAILED ---');
                }
            }),

            rollbackDeployment: async (projectId, deploymentId) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 1000));
                
                // In a real system, we'd trigger a new deployment with old artifact
                const oldDep = get().deployments[projectId]?.find(d => d.id === deploymentId);
                if (oldDep) {
                    await get().triggerDeployment(projectId, oldDep.tenantId, TRIGGER_TYPES.SYSTEM);
                }
                set({ loading: false });
            },

            deleteDeployment: (projectId, deploymentId) => set((state) => {
                if (state.deployments[projectId]) {
                    state.deployments[projectId] = state.deployments[projectId].filter(d => d.id !== deploymentId);
                }
            })
        })),
        { name: 'fs-deployment-store-v2' }
    )
);
