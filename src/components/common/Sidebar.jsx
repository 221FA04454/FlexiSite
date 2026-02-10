import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    Dashboard as DashIcon,
    Web as WebIcon,
    Layers as LayersIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Business as TenantIcon,
    VpnKey as ApiIcon,
    Public as DomainIcon,
    RocketLaunch as DeployIcon,
    Cable as IntegrationIcon,
    BarChart as AnalyticsIcon,
    Receipt as BillingIcon,
    History as LogsIcon
} from '@mui/icons-material';

const Sidebar = () => {
    const mainNav = [
        { name: 'Dashboard', icon: <DashIcon />, path: '/dashboard' },
        { name: 'Builder', icon: <WebIcon />, path: '/builder' },
        { name: 'Components', icon: <LayersIcon />, path: '/components' },
    ];

    const saasNav = [
        { name: 'Tenants', icon: <TenantIcon />, path: '/saas/tenants' },
        { name: 'API Keys', icon: <ApiIcon />, path: '/saas/api-keys' },
        { name: 'Domains', icon: <DomainIcon />, path: '/saas/domains' },
        { name: 'Deployments', icon: <DeployIcon />, path: '/saas/deployments' },
        { name: 'Integrations', icon: <IntegrationIcon />, path: '/saas/integrations' },
        { name: 'Analytics', icon: <AnalyticsIcon />, path: '/saas/analytics' },
        { name: 'Logs', icon: <LogsIcon />, path: '/saas/logs' },
        { name: 'Usage', icon: <BillingIcon />, path: '/saas/usage' },
    ];

    const settingsNav = [
        { name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    const NavGroup = ({ title, items }) => (
        <div className="space-y-1">
            {title && (
                <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 mt-4">
                    {title}
                </p>
            )}
            {items.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm ring-1 ring-indigo-500/10'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                        }`
                    }
                >
                    <span className="group-hover:scale-110 transition-transform duration-200 scale-90">
                        {item.icon}
                    </span>
                    <span className="text-sm">{item.name}</span>
                </NavLink>
            ))}
        </div>
    );

    return (
        <aside className="h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300 z-50 overflow-y-auto custom-scrollbar">
            <div className="p-6 flex items-center gap-3 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                    F
                </div>
                <div>
                   <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                        FlexiSite
                    </span>
                    <span className="block text-[8px] font-bold text-slate-400 tracking-tighter uppercase px-0.5">Enterprise Suite</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-6">
                <NavGroup items={mainNav} />
                <NavGroup title="SaaS Infrastructure" items={saasNav} />
                <NavGroup title="Preferences" items={settingsNav} />
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                <button 
                    onClick={() => {
                        if(window.confirm('Log out of FlexiSite Management?')) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium"
                >
                    <LogoutIcon className="scale-90" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
