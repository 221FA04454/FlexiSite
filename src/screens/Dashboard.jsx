import React from 'react';
import { Card, CardContent, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const projects = [
        { name: 'Portfolio Site', icon: '🎨', color: 'bg-purple-100 text-purple-600', status: 'Published' },
        { name: 'E-commerce Store', icon: '🛍️', color: 'bg-pink-100 text-pink-600', status: 'Draft' },
        { name: 'Landing Page', icon: '🚀', color: 'bg-blue-100 text-blue-600', status: 'Published' },
        { name: 'Corporate Blog', icon: '✍️', color: 'bg-indigo-100 text-indigo-600', status: 'Draft' },
    ];

    const filteredProjects = projects.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto flex-1 overflow-auto h-[calc(100vh-4rem)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your sites and statistics</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                         <input 
                            type="text" 
                            placeholder="Find a project..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
                         />
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                             🔍
                         </div>
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/builder')}
                        className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-xl !px-6 !py-2.5 !text-transform-none !font-semibold !shadow-lg !shadow-indigo-500/20"
                    >
                        New Project
                    </Button>
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <Card 
                            key={index} 
                            onClick={() => navigate('/builder')}
                            className="!bg-white dark:!bg-slate-900 !rounded-2xl !shadow-sm hover:!shadow-xl hover:-translate-y-1 transition-all cursor-pointer group !border-none"
                        >
                            <CardContent className="!p-6">
                                <div className={`h-40 rounded-xl mb-6 flex items-center justify-center transition-colors shadow-inner ${project.color}`}>
                                    <span className="text-5xl group-hover:scale-125 transition-transform duration-500 ease-out">
                                        {project.icon}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-2 truncate group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                                <div className="flex justify-between items-center text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5 opacity-70">
                                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                        Updated 2h ago
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        project.status === 'Published' 
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl mb-4">
                        🔎
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">No projects found</h3>
                    <p className="text-slate-500 max-w-xs mt-2">We couldn't find any projects matching "{searchQuery}"</p>
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="mt-6 text-indigo-600 font-bold hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
