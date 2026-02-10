import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

export const useAnalyticsStore = create(
    persist(
        immer((set, get) => ({
            // Structure: { [projectId]: AnalyticsSummary }
            overview: {},
            // Structure: { [projectId]: { [pageId]: PageAnalytics } }
            pages: {},
            // Structure: { [projectId]: { [pageId]: [ComponentAnalytics, ...] } }
            components: {},
            heatmap: {},
            dateRange: '7d',
            loading: false,

            fetchOverview: async (tenantId, projectId) => {
                set({ loading: true });
                // Simulate API latency
                await new Promise(r => setTimeout(r, 800));
                
                const mockOverview = {
                    totalVisitors: 125430,
                    uniqueVisitors: 38210,
                    totalPageViews: 452000,
                    engagementTime: '4m 32s',
                    avgScrollDepth: '68%',
                    formSubmissions: 245,
                    visitorsOverTime: [
                        { name: 'Mon', visitors: 4000, views: 2400 },
                        { name: 'Tue', visitors: 3000, views: 1398 },
                        { name: 'Wed', visitors: 2000, views: 9800 },
                        { name: 'Thu', visitors: 2780, views: 3908 },
                        { name: 'Fri', visitors: 1890, views: 4800 },
                        { name: 'Sat', visitors: 2390, views: 3800 },
                        { name: 'Sun', visitors: 3490, views: 4300 },
                    ],
                    topPages: [
                        { name: '/home', views: 45000, bounce: '12%' },
                        { name: '/pricing', views: 32000, bounce: '24%' },
                        { name: '/docs', views: 28000, bounce: '18%' },
                        { name: '/features', views: 15000, bounce: '32%' },
                    ],
                    devices: [
                        { name: 'Desktop', value: 65 },
                        { name: 'Mobile', value: 30 },
                        { name: 'Tablet', value: 5 },
                    ]
                };

                set((state) => {
                    state.overview[projectId] = mockOverview;
                });
                set({ loading: false });
            },

            fetchPageAnalytics: async (projectId, pageId) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 600));
                
                const mockPageStats = {
                    views: 45000,
                    uniqueVisitors: 12000,
                    avgScrollDepth: '72%',
                    avgTime: '2m 15s',
                    dailyStats: [
                        { date: '2026-02-01', views: 4200 },
                        { date: '2026-02-02', views: 4800 },
                        { date: '2026-02-03', views: 5100 },
                    ]
                };

                set((state) => {
                    if (!state.pages[projectId]) state.pages[projectId] = {};
                    state.pages[projectId][pageId] = mockPageStats;
                });
                set({ loading: false });
            },

            fetchComponentAnalytics: async (projectId, pageId) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 500));
                
                const mockComponents = [
                    { id: 'hero_1', name: 'Hero CTA', clicks: 4500, ctr: '12.5%', submissions: 0 },
                    { id: 'form_1', name: 'Newsletter Form', clicks: 1200, ctr: '4.2%', submissions: 850 },
                    { id: 'nav_1', name: 'Pricing Link', clicks: 8000, ctr: '8.4%', submissions: 0 },
                ];

                set((state) => {
                    if (!state.components[projectId]) state.components[projectId] = {};
                    state.components[projectId][pageId] = mockComponents;
                });
                set({ loading: false });
            },

            setDateRange: (range) => set({ dateRange: range }),

            exportAnalytics: async (type) => {
                console.log(`Exporting ${type} report...`);
                await new Promise(r => setTimeout(r, 1000));
                return true;
            }
        })),
        { name: 'fs-analytics-store-v2' }
    )
);
