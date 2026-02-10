import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const DeploymentLogsViewer = ({ logs = [] }) => {
    const logEndRef = useRef(null);

    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    return (
        <div className="bg-slate-950 rounded-2xl p-6 border border-white/5 font-mono text-xs overflow-hidden flex flex-col h-[400px]">
            <div className="flex items-center gap-2 text-slate-500 mb-4 pb-2 border-b border-white/10">
                <Terminal size={14} />
                <span className="font-bold uppercase tracking-widest text-[10px]">Production Build Artifact Logs</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                {logs.map((log, i) => {
                    const isError = log.includes('FAILED') || log.includes('error');
                    const isSuccess = log.includes('SUCCESS') || log.includes('successfully');
                    const isHeader = log.includes('---');

                    return (
                        <div key={i} className="flex gap-4">
                            <span className="text-slate-600 select-none w-8">{i + 1}</span>
                            <span className={`
                                ${isError ? 'text-red-400' : ''}
                                ${isSuccess ? 'text-emerald-400 font-bold' : ''}
                                ${isHeader ? 'text-indigo-400 mt-2 block border-y border-white/5 py-2 uppercase tracking-widest text-center' : 'text-indigo-200/80'}
                            `}>
                                {log}
                            </span>
                        </div>
                    );
                })}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default DeploymentLogsViewer;
