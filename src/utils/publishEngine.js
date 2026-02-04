import { useProjectStore } from '../store/projectStore';
import { useThemeStore } from '../store/themeStore';
import { COMPONENT_REGISTRY } from '../components/registry';

/**
 * FlexiSite Static Site Generator (SSG)
 * Converts the project tree into a production-ready file bundle.
 */
export const generateStaticSite = async () => {
    const project = useProjectStore.getState();
    const theme = useThemeStore.getState().themes[useProjectStore.getState().activeThemeId] || useThemeStore.getState().themes['default_dark_pro'];

    console.log('[Publish] Starting build process...');

    // 1. Generate Global CSS
    const globalCSS = generateGlobalCSS(theme);

    // 2. Process Pages
    const pagesOutput = Object.values(project.pages).map(page => {
        const html = generatePageHTML(page, theme, project);
        return {
            fileName: page.slug === '/' ? 'index.html' : `${page.slug.replace('/', '')}.html`,
            content: html
        };
    });

    // 3. Assemble Files (Simulated bundle)
    const bundle = {
        'assets/theme.css': globalCSS,
        'data/project.json': JSON.stringify(project, null, 2),
        ...Object.fromEntries(pagesOutput.map(p => [p.fileName, p.content]))
    };

    console.log('[Publish] Build complete. Bundle prepared.', Object.keys(bundle));
    return bundle;
};

/**
 * Atomic HTML Generator
 */
const generatePageHTML = (page, theme, project) => {
    const renderNode = (nodeId) => {
        const node = page.tree.entities[nodeId];
        if (!node) return '';

        const def = COMPONENT_REGISTRY[node.type];
        const children = node.children?.map(childId => renderNode(childId)).join('') || '';
        
        // Map Props to Attributes
        const attrString = Object.entries(node.props || {})
            .filter(([k]) => k !== 'children')
            .map(([k, v]) => `${k}="${v}"`).join(' ');

        // Resolve Styles to Inline (Simplified for export)
        const styleString = Object.entries(node.style?.desktop || {})
            .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ');

        // Basic Tag Mapping
        let tag = 'div';
        if (node.type === 'Heading') tag = node.props.level || 'h2';
        if (node.type === 'Text') tag = 'p';
        if (node.type === 'Button') tag = 'button';
        if (node.type === 'Image') return `<img src="${node.props.src}" alt="${node.props.alt}" style="${styleString}" ${attrString} />`;

        return `<${tag} id="${node.id}" style="${styleString}" data-fs-type="${node.type}" ${attrString}>${children}</${tag}>`;
    };

    const rootContent = renderNode(page.tree.rootId);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name} | Built with FlexiSite</title>
    <link rel="stylesheet" href="assets/theme.css">
    <style>
        body { margin: 0; padding: 0; font-family: var(--fs-font-main); background: var(--fs-color-background); color: var(--fs-color-text); }
        [data-fs-type="Section"] { width: 100%; box-sizing: border-box; }
        [data-fs-type="Container"] { display: flex; max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="flexisite-root">
        ${rootContent}
    </div>
    
    <!-- Interaction Runtime Placeholder -->
    <script src="assets/runtime.js"></script>
    <script>
        // Inject project data for runtime logic
        window.__FLEXISITE_PROJECT__ = ${JSON.stringify({ activePageId: page.id })};
    </script>
</body>
</html>
    `.trim();
};

/**
 * CSS Variable Token Generator
 */
const generateGlobalCSS = (theme) => {
    let css = ':root {\n';
    
    // Colors
    Object.entries(theme.tokens.colors).forEach(([k, v]) => {
        css += `  --fs-color-${k}: ${v};\n`;
    });

    // Typography
    css += `  --fs-font-main: ${theme.tokens.typography.fontFamily};\n`;
    css += `  --fs-h1-size: ${theme.tokens.typography.h1.size};\n`;
    css += `  --fs-h2-size: ${theme.tokens.typography.h2.size};\n`;

    // Scales
    Object.entries(theme.tokens.scale).forEach(([k, v]) => {
        const cssK = k.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `  --fs-${cssK}: ${v};\n`;
    });

    css += '}\n';
    return css;
};
