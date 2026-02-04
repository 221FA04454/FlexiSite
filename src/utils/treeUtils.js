import { nanoid } from 'nanoid';

/**
 * Re-maps all IDs in a component tree to fresh ones to prevent collisions.
 * Used when applying templates.
 */
export const reMapTreeIds = (entities, rootId) => {
    const newEntities = {};
    const idMap = {};

    // 1. First pass: Generate all new IDs
    const generateMaps = (oldId) => {
        const node = entities[oldId];
        if (!node) return;
        
        idMap[oldId] = `${node.type.toLowerCase()}_${nanoid(8)}`;
        node.children.forEach(generateMaps);
    };

    generateMaps(rootId);

    // 2. Second pass: Build new entities with mapped IDs
    const buildNewTree = (oldId, newParentId = null) => {
        const node = entities[oldId];
        if (!node) return;

        const newId = idMap[oldId];
        
        newEntities[newId] = {
            ...JSON.parse(JSON.stringify(node)), // Deep clone
            id: newId,
            parentId: newParentId,
            children: node.children.map(cid => idMap[cid])
        };

        node.children.forEach(cid => buildNewTree(cid, newId));
    };

    buildNewTree(rootId);

    return {
        rootId: idMap[rootId],
        entities: newEntities
    };
};
