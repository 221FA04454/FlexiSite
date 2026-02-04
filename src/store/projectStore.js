import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { reMapTreeIds } from '../utils/treeUtils';

// --- UTILITIES ---

const getSubtree = (entities, nodeId) => {
    const subtree = {};
    const collect = (id) => {
        const node = entities[id];
        if (!node) return;
        subtree[id] = JSON.parse(JSON.stringify(node));
        node.children.forEach(collect);
    };
    collect(nodeId);
    return subtree;
};

const createEmptyPage = (name, slug, isHome = false) => {
  const rootId = `root_${nanoid(8)}`;
  return {
    id: isHome ? 'page_home' : `page_${nanoid(8)}`,
    name,
    slug: slug || `/${name.toLowerCase().replace(/ /g, '-')}`,
    tree: {
      root: rootId,
      entities: {
        [rootId]: {
          id: rootId,
          type: 'Container',
          props: { className: 'min-h-screen bg-white' },
          children: [],
          style: { desktop: {} },
          parentId: null
        }
      }
    },
    seo: {
      title: `${name} | FlexiSite`,
      description: `Description for ${name}`,
      keywords: 'flexisite, cms, no-code',
      noIndex: false
    },
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  };
};

// Deep clone utility for page trees
const cloneTree = (entities, rootId) => {
    const newEntities = {};
    const idMap = {};

    // Helper to generate new IDs and map them
    const mapIds = (oldId) => {
        const node = entities[oldId];
        const newId = `${node.type.toLowerCase()}_${nanoid(8)}`;
        idMap[oldId] = newId;
        node.children.forEach(mapIds);
    };

    mapIds(rootId);

    // Helper to build new entities with new IDs
    const buildEntities = (oldId, newParentId = null) => {
        const node = entities[oldId];
        const newId = idMap[oldId];
        
        newEntities[newId] = {
            ...JSON.parse(JSON.stringify(node)), // Deep clone
            id: newId,
            parentId: newParentId,
            children: node.children.map(cid => idMap[cid])
        };

        node.children.forEach(cid => buildEntities(cid, newId));
    };

    buildEntities(rootId);
    return { rootId: idMap[rootId], entities: newEntities };
};

// --- STORE ---

export const useProjectStore = create(
  temporal(
    persist(
      immer((set, get) => ({
        // Multi-Page Architecture (Enterprise Scale)
        pages: {
          'page_home': createEmptyPage('Home', '/', true)
        },
        activePageId: 'page_home',

        // Global Design System
        globalStyles: {
            colors: {
                primary: '#4f46e5',
                secondary: '#ec4899',
                background: '#ffffff',
                text: '#1e293b'
            },
            typography: {
                fontFamily: 'Inter, sans-serif'
            }
        },

        breakpoints: {
            desktop: 1280,
            tablet: 768,
            mobile: 375
        },

        settings: {
            projectId: `proj_${nanoid(6)}`,
            favicon: '',
            customScripts: []
        },

        metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastSavedAt: Date.now()
        },

        // --- ACTIONS: PROJECT SAVE/LOAD ---

        exportProjectJSON: () => {
            const state = get();
            const projectData = {
                schemaVersion: 1,
                name: state.pages['page_home']?.name || 'Project',
                ...state
            };
            // Remove function actions from export
            delete projectData.setActivePage;
            delete projectData.createPage;
            delete projectData.deletePage;
            delete projectData.duplicatePage;
            delete projectData.renamePage;
            delete projectData.updatePageSEO;
            delete projectData.updatePageSlug;
            delete projectData.addNode;
            delete projectData.removeNode;
            delete projectData.updateNodeProps;
            delete projectData.updateNodeStyle;
            delete projectData.cloneNode;
            delete projectData.exportProjectJSON;
            delete projectData.importProjectJSON;
            delete projectData.exportPageJSON;
            delete projectData.importPageJSON;

            const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `flexisite_${projectData.settings.projectId}_${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
        },

        importProjectJSON: (jsonString) => set((state) => {
            try {
                const imported = JSON.parse(jsonString);
                if (!imported.pages || !imported.schemaVersion) {
                    throw new Error('Invalid FlexiSite project file');
                }
                
                state.pages = imported.pages;
                state.activePageId = imported.activePageId || Object.keys(imported.pages)[0];
                state.globalStyles = imported.globalStyles || state.globalStyles;
                state.settings = imported.settings || state.settings;
                state.metadata = { ...imported.metadata, updatedAt: Date.now() };
                
                alert('Project imported successfully!');
            } catch (err) {
                alert(`Import failed: ${err.message}`);
            }
        }),

        exportPageJSON: (pageId) => {
            const state = get();
            const page = state.pages[pageId];
            if (!page) return;

            const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `page_${page.name.toLowerCase().replace(/ /g, '_')}_${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
        },

        importPageJSON: (jsonString) => set((state) => {
            try {
                const importedPage = JSON.parse(jsonString);
                if (!importedPage.tree || !importedPage.id) {
                    throw new Error('Invalid FlexiSite page file');
                }
                
                const newId = `page_${nanoid(8)}`;
                state.pages[newId] = {
                    ...importedPage,
                    id: newId,
                    name: `${importedPage.name} (Imported)`,
                    slug: `${importedPage.slug}-imported`
                };
                state.activePageId = newId;
                alert('Page imported successfully!');
            } catch (err) {
                alert(`Page import failed: ${err.message}`);
            }
        }),

        // --- TEMPLATE ACTIONS ---

        applyTemplateToPage: (pageId, template) => set((state) => {
            const page = state.pages[pageId];
            if (!page) return;

            // Re-map IDs to ensure no collisions
            const { rootId, entities } = reMapTreeIds(template.tree.entities, template.tree.root);
            
            page.tree = {
                root: rootId,
                entities: entities
            };
            page.metadata.updatedAt = Date.now();
        }),

        applyTemplateToSection: (parentId, template) => set((state) => {
            const page = state.pages[state.activePageId];
            if (!page || !page.tree.entities[parentId]) return;

            // Re-map IDs
            const { rootId, entities } = reMapTreeIds(template.tree.entities, template.tree.root);

            // Merge entities
            Object.assign(page.tree.entities, entities);

            // Add template root ID to parent's children
            page.tree.entities[parentId].children.push(rootId);
            page.tree.entities[rootId].parentId = parentId;
            page.metadata.updatedAt = Date.now();
        }),

        savePageAsTemplate: (pageId, name) => {
            const state = get();
            const page = state.pages[pageId];
            if (!page) return null;

            return {
                name: name || `${page.name} Template`,
                type: 'page',
                tree: JSON.parse(JSON.stringify(page.tree)),
                category: 'Custom'
            };
        },

        saveSectionAsTemplate: (nodeId, name) => {
            const state = get();
            const page = state.pages[state.activePageId];
            if (!page) return null;

            const subtree = getSubtree(page.tree.entities, nodeId);
            return {
                name: name || `Section Template`,
                type: 'section',
                tree: {
                    root: nodeId,
                    entities: subtree
                },
                category: 'Custom'
            };
        },

        // --- ACTIONS: PAGE MANAGEMENT ---

        setActivePage: (pageId) => set((state) => {
          if (state.pages[pageId]) {
            state.activePageId = pageId;
          }
        }),

        createPage: (name, slug) => set((state) => {
          const newPage = createEmptyPage(name, slug);
          state.pages[newPage.id] = newPage;
          state.activePageId = newPage.id;
        }),

        deletePage: (pageId) => set((state) => {
          const pageCount = Object.keys(state.pages).length;
          if (pageCount <= 1) return;

          delete state.pages[pageId];
          
          if (state.activePageId === pageId) {
            state.activePageId = Object.keys(state.pages)[0];
          }
        }),

        duplicatePage: (pageId) => set((state) => {
          const sourcePage = state.pages[pageId];
          if (!sourcePage) return;

          const { rootId: newRootId, entities: newEntities } = cloneTree(
              sourcePage.tree.entities, 
              sourcePage.tree.root
          );

          const newPageId = `page_${nanoid(8)}`;
          state.pages[newPageId] = {
              ...JSON.parse(JSON.stringify(sourcePage)),
              id: newPageId,
              name: `${sourcePage.name} (Copy)`,
              slug: `${sourcePage.slug}-copy`,
              tree: {
                  root: newRootId,
                  entities: newEntities
              },
              metadata: {
                  createdAt: Date.now(),
                  updatedAt: Date.now()
              }
          };
          state.activePageId = newPageId;
        }),

        renamePage: (pageId, newName) => set((state) => {
          if (state.pages[pageId]) {
            state.pages[pageId].name = newName;
            state.pages[pageId].metadata.updatedAt = Date.now();
          }
        }),

        updatePageSEO: (pageId, payload) => set((state) => {
            if (state.pages[pageId]) {
                state.pages[pageId].seo = { ...state.pages[pageId].seo, ...payload };
                state.pages[pageId].metadata.updatedAt = Date.now();
            }
        }),

        updatePageSlug: (pageId, slug) => set((state) => {
            if (state.pages[pageId]) {
                // Validation: lowercase, kebab-case, starts with /
                const validatedSlug = slug.toLowerCase().replace(/ /g, '-').replace(/^\/?/, '/');
                state.pages[pageId].slug = validatedSlug;
            }
        }),

        // --- ACTIONS: NODE CRUD (PAGE-AWARE) ---

        addNode: (parentId, newNode) => set((state) => {
          const activePage = state.pages[state.activePageId];
          if (!activePage) return;

          // 1. Add to entities map of active page
          activePage.tree.entities[newNode.id] = {
            ...newNode,
            parentId,
            children: []
          };

          // 2. Add to parent's children array
          const parent = activePage.tree.entities[parentId];
          if (parent) {
            parent.children.push(newNode.id);
          }
          activePage.metadata.updatedAt = Date.now();
        }),

        removeNode: (nodeId) => set((state) => {
           const activePage = state.pages[state.activePageId];
           if (!activePage) return;

           const node = activePage.tree.entities[nodeId];
           if (!node || !node.parentId) return; // Can't delete root

           const parent = activePage.tree.entities[node.parentId];
           if (parent) {
             parent.children = parent.children.filter(id => id !== nodeId);
           }

           // Cleanup entities (Recurse to delete kids)
           const deleteRecursive = (id) => {
               const n = activePage.tree.entities[id];
               if (n) {
                   n.children.forEach(deleteRecursive);
                   delete activePage.tree.entities[id];
               }
           };
           deleteRecursive(nodeId);
           activePage.metadata.updatedAt = Date.now();
        }),

        updateNodeProps: (nodeId, newProps) => set((state) => {
           const activePage = state.pages[state.activePageId];
           if (!activePage) return;

           const node = activePage.tree.entities[nodeId];
           if (node) {
             node.props = { ...node.props, ...newProps };
             activePage.metadata.updatedAt = Date.now();
           }
        }),

        updateNodeStyle: (nodeId, styleUpdate, device = 'desktop') => set((state) => {
           const activePage = state.pages[state.activePageId];
           if (!activePage) return;

           const node = activePage.tree.entities[nodeId];
           if (node) {
             if (!node.style[device]) node.style[device] = {};
             Object.assign(node.style[device], styleUpdate);
             activePage.metadata.updatedAt = Date.now();
           }
        }),

        // Global Orchestration
        setGlobalStyle: (category, key, value) => set((state) => {
            if (state.globalStyles[category]) {
                state.globalStyles[category][key] = value;
                state.metadata.updatedAt = Date.now();
            }
        }),

        resetProject: () => set((state) => {
            const home = createEmptyPage('Home', '/', true);
            state.pages = { 'page_home': home };
            state.activePageId = 'page_home';
            state.metadata.updatedAt = Date.now();
            state.metadata.lastSavedAt = Date.now();
        }),

        cloneNode: (nodeId) => set((state) => {
            const activePage = state.pages[state.activePageId];
            if (!activePage) return;

            const node = activePage.tree.entities[nodeId];
            if (!node || !node.parentId) return;

            const parent = activePage.tree.entities[node.parentId];
            if (!parent) return;

            const newNodeId = `${node.type.toLowerCase()}_${nanoid(8)}`;
            const newNode = {
                ...JSON.parse(JSON.stringify(node)),
                id: newNodeId,
                parentId: node.parentId,
                children: [] // Simplified recursion for now
            };

            activePage.tree.entities[newNodeId] = newNode;
            const index = parent.children.indexOf(nodeId);
            parent.children.splice(index + 1, 0, newNodeId);
            activePage.metadata.updatedAt = Date.now();
        }),
      })),
      {
        name: 'flexisite-project-enterprise-v2', // v2 with global systems
        partialize: (state) => ({ 
            pages: state.pages,
            activePageId: state.activePageId,
            globalStyles: state.globalStyles,
            breakpoints: state.breakpoints,
            settings: state.settings,
            metadata: state.metadata
        }), 
      }
    ),
    {
      limit: 100,
      partialize: (state) => ({ 
          pages: state.pages,
          activePageId: state.activePageId 
      }), 
    }
  )
);
