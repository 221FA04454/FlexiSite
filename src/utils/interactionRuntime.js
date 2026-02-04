import { useProjectStore } from '../store/projectStore';
import { tracker } from './analyticsTracker';

/**
 * FlexiSite Interaction Interpreter
 * Executes logic based on component interaction metadata.
 */
export const executeInteraction = (interaction, context) => {
    const { action, payload } = interaction;
    const store = useProjectStore.getState();

    // Log to Analytics
    tracker.track('interaction_trigger', { 
        event: interaction.event, 
        action: action.type,
        pageId: store.activePageId 
    });

    console.log(`[Interaction] Executing ${interaction.event} -> ${action.type}`, payload);

    switch (action.type) {
        case 'navigate':
            if (payload.pageId) {
                store.setActivePage(payload.pageId);
            }
            break;

        case 'open_url':
            if (payload.url) {
                window.open(payload.url, payload.newTab ? '_blank' : '_self');
            }
            break;

        case 'visibility':
            if (payload.targetNodeId) {
                const targetNode = store.pages[store.activePageId].tree.entities[payload.targetNodeId];
                if (targetNode) {
                    const isVisible = !(targetNode.props?.hidden);
                    let nextVisible = isVisible;

                    if (action.verb === 'show') nextVisible = true;
                    if (action.verb === 'hide') nextVisible = false;
                    if (action.verb === 'toggle') nextVisible = !isVisible;

                    store.updateNodeProps(payload.targetNodeId, { hidden: !nextVisible });
                }
            }
            break;

        case 'scroll':
            if (payload.targetNodeId) {
                const element = document.getElementById(payload.targetNodeId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            break;

        case 'form_submit':
            alert(`Interaction: Form would submit to ${payload.endpoint}`);
            break;

        default:
            console.warn(`[Interaction] Unhandled action type: ${action.type}`);
    }
};

/**
 * Global Handler for DOM Events
 */
export const handleEvent = (nodeId, eventName, domEvent) => {
    const store = useProjectStore.getState();
    const node = store.pages[store.activePageId].tree.entities[nodeId];

    if (!node || !node.interactions) return;

    // Filter interactions matching the event
    const matches = node.interactions.filter(i => i.event === eventName);
    
    matches.forEach(interaction => {
        // Condition check placeholder
        executeInteraction(interaction, { domEvent });
    });
};
