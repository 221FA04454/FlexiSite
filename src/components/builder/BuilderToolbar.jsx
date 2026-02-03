import React from 'react';
import { useStore } from 'zustand';
import { Link } from 'react-router-dom';
import LaptopIcon from '@mui/icons-material/Laptop';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore';
import PageManager from './PageManager';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const BuilderToolbar = () => {
  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);
  const viewPort = useEditorStore((state) => state.viewPort);
  const setViewPort = useEditorStore((state) => state.setViewPort);

  // Store Actions & State
  const exportProject = useProjectStore((state) => state.exportProjectJSON);
  const importProject = useProjectStore((state) => state.importProjectJSON);
  const metadata = useProjectStore((state) => state.metadata);

  // Safe Access to Zundo Temporal Store
  const temporal = useProjectStore.temporal;
  const temporalState = useStore(temporal, (state) => state) || { 
      pastStates: [], futureStates: [], undo: () => {}, redo: () => {} 
  };
  const { pastStates, futureStates, undo, redo } = temporalState;

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        importProject(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shadow-sm z-50 transition-colors duration-300">
      
      {/* Left: Branding & Page Manager */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-slate-800 dark:text-white text-sm hidden lg:block">FlexiSite</span>
        </Link>
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>
        <PageManager />
      </div>

      {/* Center: Viewport & Mode Controls */}
      <div className="flex items-center gap-6">
        {/* Device Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {[
                { id: 'desktop', icon: <LaptopIcon fontSize="inherit" /> },
                { id: 'tablet', icon: <TabletMacIcon fontSize="inherit" /> },
                { id: 'mobile', icon: <PhoneIphoneIcon fontSize="inherit" /> }
            ].map(dev => (
                <button 
                    key={dev.id}
                    onClick={() => setViewPort(dev.id)}
                    className={`p-1.5 rounded-md text-sm transition-all ${viewPort === dev.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    {dev.icon}
                </button>
            ))}
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
            <button onClick={() => undo()} disabled={!canUndo} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <UndoIcon fontSize="small" />
            </button>
            <button onClick={() => redo()} disabled={!canRedo} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <RedoIcon fontSize="small" />
            </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button 
                onClick={() => setMode('edit')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold transition-all ${mode === 'edit' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <EditIcon sx={{ fontSize: 14 }} />
                <span className="hidden sm:inline">Edit</span>
            </button>
            <button 
                onClick={() => setMode('preview')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold transition-all ${mode === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <VisibilityIcon sx={{ fontSize: 14 }} />
                <span className="hidden sm:inline">Preview</span>
            </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Saved Status */}
        <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 mr-2">
            <CheckCircleOutlineIcon sx={{ fontSize: 12 }} />
            <span>SAVED</span>
        </div>

        <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            <div className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all" title="Import Project JSON">
                <FileUploadIcon fontSize="small" />
            </div>
        </label>
        
        <button 
            onClick={exportProject}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
            title="Export Project JSON"
        >
            <FileDownloadIcon fontSize="small" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 hover:scale-105 active:scale-95">
            <PlayArrowIcon fontSize="small" />
            Publish
        </button>
      </div>
    </div>
  );
};

export default BuilderToolbar;
