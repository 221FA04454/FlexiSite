import React from 'react';
import { COMPONENT_REGISTRY } from '../components/registry';
import TitleIcon from '@mui/icons-material/Title';
import ImageIcon from '@mui/icons-material/Image';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const getIcon = (type) => {
    switch (type) {
        case 'Section': return <ViewQuiltIcon />;
        case 'Container': return <ViewColumnIcon />;
        case 'Card': return <DashboardCustomizeIcon />;
        case 'Heading': return <TitleIcon />;
        case 'Text': return <TextFieldsIcon />;
        case 'Button': return <SmartButtonIcon />;
        case 'Divider': return <HorizontalRuleIcon />;
        case 'Image': return <ImageIcon />;
        default: return <DashboardCustomizeIcon />;
    }
}

const Components = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Component Library</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Explore and manage your reusable building blocks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(COMPONENT_REGISTRY).map(([type, def]) => (
                    <div key={type} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${
                                def.category === 'layout' ? 'bg-indigo-50 text-indigo-600' :
                                def.category === 'basic' ? 'bg-amber-50 text-amber-600' :
                                'bg-emerald-50 text-emerald-600'
                            }`}>
                                {getIcon(type)}
                            </div>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {def.category}
                            </span>
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">{def.label}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Standard {type} component with {Object.keys(def.propSchema || {}).length} configurable properties.
                        </p>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Properties</h4>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(def.propSchema || {}).map(([key, schema]) => (
                                    <span key={key} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-[11px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                        {schema.label || key}
                                    </span>
                                ))}
                                {(!def.propSchema || Object.keys(def.propSchema).length === 0) && (
                                    <span className="text-xs text-slate-400 italic">None</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Components;
