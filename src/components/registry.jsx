// Component Registry
// Maps JSON types to React Components and Schema Definitions

import Button from './lib/basic/Button';
import Heading from './lib/basic/Heading';
import Text from './lib/basic/Text';
import Divider from './lib/basic/Divider';
import Container from './lib/layout/Container';
import Section from './lib/layout/Section';
import Image from './lib/media/Image';

import Card from './lib/layout/Card';

export const COMPONENT_REGISTRY = {
  'Section': {
    component: Section,
    label: 'Section',
    category: 'layout',
    defaultProps: {
      padding: '48px',
      backgroundColor: '#ffffff',
    },
    propSchema: {
      padding: { type: 'text', label: 'Vertical Padding' },
      backgroundColor: { type: 'color', label: 'Background Color' },
    }
  },
  'Container': {
    component: Container,
    label: 'Container',
    category: 'layout',
    defaultProps: {
      padding: '16px',
      flexDirection: 'column',
      gap: '12px',
    },
    propSchema: {
      flexDirection: { 
        type: 'select', 
        label: 'Orientation', 
        options: ['row', 'column'] 
      },
      gap: { type: 'text', label: 'Gap (px)' },
      padding: { type: 'text', label: 'Padding' },
    }
  },
  'Card': {
    component: Card,
    label: 'Card',
    category: 'layout',
    defaultProps: {
      backgroundColor: '#ffffff',
    },
    propSchema: {
      backgroundColor: { type: 'color', label: 'Background Color' },
    }
  },
  'Heading': {
    component: Heading,
    label: 'Heading',
    category: 'basic',
    defaultProps: {
      text: 'Hello World',
      level: 'h2',
    },
    propSchema: {
      text: { type: 'text', label: 'Content' },
      level: { 
        type: 'select', 
        label: 'Level', 
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] 
      },
    }
  },
  'Text': {
    component: Text,
    label: 'Paragraph',
    category: 'basic',
    defaultProps: {
      content: 'This is a paragraph of text. Deeply customizable and responsive.',
    },
    propSchema: {
      content: { type: 'textarea', label: 'Content' },
    }
  },
  'Button': {
    component: Button,
    label: 'Button',
    category: 'basic',
    defaultProps: {
      text: 'Click Me',
      variant: 'primary',
    },
    propSchema: {
      text: { type: 'text', label: 'Button Text' },
      variant: { 
        type: 'select', 
        label: 'Variant', 
        options: ['primary', 'secondary', 'danger', 'ghost'] 
      },
      link: { type: 'text', label: 'URL/Link' },
    }
  },
  'Divider': {
    component: Divider,
    label: 'Divider',
    category: 'basic',
    defaultProps: {},
    propSchema: {}
  },
  'Image': {
    component: Image,
    label: 'Image',
    category: 'media',
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      alt: 'Placeholder',
    },
    propSchema: {
      src: { type: 'text', label: 'Image URL' },
      alt: { type: 'text', label: 'Alt Text' },
    }
  }
};

export const getComponent = (type) => {
  return COMPONENT_REGISTRY[type]?.component || (() => <div className="text-red-500 text-xs">Unknown: {type}</div>);
};

export const getComponentDef = (type) => {
  return COMPONENT_REGISTRY[type];
};

/**
 * Enterprise Plugin System Hook
 * Allows third-party plugins to inject custom components at runtime
 */
export const registerDynamicComponent = (type, definition) => {
    if (COMPONENT_REGISTRY[type]) {
        console.warn(`[Registry] Component type "${type}" is already registered. Overwriting.`);
    }
    COMPONENT_REGISTRY[type] = definition;
    console.info(`[Registry] Dynamically registered "${type}" component.`);
};
