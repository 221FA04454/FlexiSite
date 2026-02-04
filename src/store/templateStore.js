import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export const useTemplateStore = create(
  persist(
    (set, get) => ({
      templates: {}, // Map of id -> Template object

      // --- ACTIONS ---

      addTemplate: (payload) => set((state) => {
        const id = payload.id || `tmpl_${nanoid(8)}`;
        state.templates[id] = {
          ...payload,
          id,
          createdAt: Date.now(),
          metadata: {
            version: 1,
            engineVersion: '1.2'
          }
        };
      }),

      deleteTemplate: (id) => set((state) => {
        const newTemplates = { ...state.templates };
        delete newTemplates[id];
        return { templates: newTemplates };
      }),

      renameTemplate: (id, newName) => set((state) => {
        if (state.templates[id]) {
          state.templates[id].name = newName;
        }
      }),

      exportTemplateJSON: (templateId) => {
        const template = get().templates[templateId];
        if (!template) return;

        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `flexisite_template_${template.name.toLowerCase().replace(/ /g, '_')}.json`;
        link.click();
        URL.revokeObjectURL(url);
      },

      importTemplateJSON: (jsonString) => {
        try {
          const imported = JSON.parse(jsonString);
          if (!imported.tree || !imported.metadata) {
            throw new Error('Invalid FlexiSite template file');
          }

          const id = `tmpl_${nanoid(8)}`;
          set((state) => ({
            templates: {
              ...state.templates,
              [id]: { ...imported, id }
            }
          }));
          return true;
        } catch (err) {
          console.error('Template import failed:', err);
          return false;
        }
      }
    }),
    {
      name: 'flexisite-templates-v1'
    }
  )
);
