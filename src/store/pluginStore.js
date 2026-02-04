import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { registerDynamicComponent } from '../components/registry';

/**
 * Enterprise Plugin Store
 * Manages the lifecycle of custom components and extensions
 */
export const usePluginStore = create(
    persist(
        immer((set, get) => ({
            installedPlugins: {},
            lastInstalledAt: null,

            // --- ACTIONS ---

            installPlugin: (manifest) => set((state) => {
                const id = manifest.id;
                
                // 1. Prevent Duplicates
                if (state.installedPlugins[id]) return;

                // 2. Register with Store
                state.installedPlugins[id] = {
                    ...manifest,
                    installedAt: Date.now()
                };

                // 3. Register Components Dynamically
                if (manifest.components) {
                    manifest.components.forEach(comp => {
                        registerDynamicComponent(comp.type, comp.definition);
                    });
                }

                // 4. Load External Scripts
                if (manifest.externalScripts) {
                    manifest.externalScripts.forEach(url => {
                        if (!document.querySelector(`script[src="${url}"]`)) {
                            const script = document.createElement('script');
                            script.src = url;
                            script.async = true;
                            document.head.appendChild(script);
                        }
                    });
                }

                state.lastInstalledAt = Date.now();
                console.log(`Plugin ${manifest.name} installed successfully.`);
            }),

            uninstallPlugin: (id) => set((state) => {
                if (state.installedPlugins[id]) {
                    delete state.installedPlugins[id];
                    // Note: Unregistering components from the registry logic
                    // would go here (requires registry to support removal)
                }
            }),

            isPluginInstalled: (id) => !!get().installedPlugins[id]
        })),
        { name: 'flexisite-plugin-store-v1' }
    )
);
