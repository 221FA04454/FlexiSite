import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import { ThemeProvider } from '@context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy Loaded Screens
const Dashboard = lazy(() => import('@screens/Dashboard'));
const Builder = lazy(() => import('@screens/Builder'));
const Components = lazy(() => import('@screens/Components'));
const Settings = lazy(() => import('@screens/Settings'));

// SaaS Screens
const TenantManagement = lazy(() => import('@screens/saas/TenantManagement'));
const ApiKeyManager = lazy(() => import('@screens/saas/ApiKeyManager'));
const DomainManager = lazy(() => import('@screens/saas/DomainManager'));
const DeploymentHistory = lazy(() => import('@screens/saas/DeploymentHistory'));
const IntegrationPanel = lazy(() => import('@screens/saas/IntegrationPanel'));
const AnalyticsDashboard = lazy(() => import('@screens/saas/AnalyticsDashboard'));
const LogsDashboard = lazy(() => import('@screens/saas/LogsDashboard'));
const UsageDashboard = lazy(() => import('@screens/saas/UsageDashboard'));
const TenantSettings = lazy(() => import('@screens/saas/TenantSettings'));
const DomainManagement = lazy(() => import('@screens/saas/DomainManagement'));
const DomainDetails = lazy(() => import('@screens/saas/DomainDetails'));
const DeploymentDetails = lazy(() => import('@screens/saas/DeploymentDetails'));

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="builder" element={<Builder />} />
                <Route path="components" element={<Components />} />
                <Route path="settings" element={<Settings />} />

                {/* SaaS Infrastructure Routes */}
                <Route path="saas">
                   <Route path="tenants" element={<TenantManagement />} />
                   <Route path="api-keys" element={<ApiKeyManager />} />
                   <Route path="domains" element={<DomainManagement />} />
                   <Route path="domains/:domainId" element={<DomainDetails />} />
                   <Route path="deployments" element={<DeploymentHistory />} />
                   <Route path="deployments/:deploymentId" element={<DeploymentDetails />} />
                   <Route path="integrations" element={<IntegrationPanel />} />
                   <Route path="analytics" element={<AnalyticsDashboard />} />
                   <Route path="logs" element={<LogsDashboard />} />
                   <Route path="usage" element={<UsageDashboard />} />
                   <Route path="settings/:tenantId" element={<TenantSettings />} />
                </Route>

                <Route path="*" element={<div className="p-10 text-center text-red-500 font-bold">404 - Architecture Fragment Not Found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
