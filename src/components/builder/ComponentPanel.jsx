import React from 'react';
import TitleIcon from '@mui/icons-material/Title';
import ImageIcon from '@mui/icons-material/Image';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ExtensionIcon from '@mui/icons-material/Extension';
import { usePluginStore } from '../../store/pluginStore';
import SidebarItem from './dnd/SidebarItem';

const ComponentPanel = () => {
    const installedPlugins = usePluginStore((state) => state.installedPlugins);

    const categories = {
        layout: [
            { name: 'Section', type: 'Section', icon: <ViewQuiltIcon /> },
            { name: 'Container', type: 'Container', icon: <ViewColumnIcon /> },
            { name: 'Card', type: 'Card', icon: <DashboardCustomizeIcon /> },
        ],
        basic: [
            { name: 'Heading', type: 'Heading', icon: <TitleIcon /> },
            { name: 'Text', type: 'Text', icon: <TextFieldsIcon /> },
            { name: 'Button', type: 'Button', icon: <SmartButtonIcon /> },
            { name: 'Divider', type: 'Divider', icon: <HorizontalRuleIcon /> },
        ],
        media: [
            { name: 'Image', type: 'Image', icon: <ImageIcon /> },
        ]
    };

    // Merge Plugin Components
    Object.values(installedPlugins).forEach(plugin => {
        if (!categories.plugins) categories.plugins = [];
        plugin.components.forEach(comp => {
            categories.plugins.push({
                name: comp.label || comp.type,
                type: comp.type,
                icon: <ExtensionIcon sx={{ fontSize: 18 }} />
            });
        });
    });

    return (
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 h-[calc(100vh-4rem)] overflow-y-auto transition-colors duration-300">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Library</h3>
            
            {Object.entries(categories).map(([category, items]) => (
                <div key={category} className="mb-8">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">{category}</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {items.map((comp) => (
                            <SidebarItem 
                                key={comp.type}
                                type={comp.type}
                                label={comp.name}
                                icon={comp.icon}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComponentPanel;
