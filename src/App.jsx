import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import Dashboard from '@screens/Dashboard';
import Builder from '@screens/Builder';
import Components from '@screens/Components';
import Settings from '@screens/Settings';
import { ThemeProvider } from '@context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="builder" element={<Builder />} />
            <Route path="components" element={<Components />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<div className="p-10 text-center text-red-500">404 - Page Not Found</div>} />
          </Route>
        </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
