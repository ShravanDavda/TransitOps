import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Pages import
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Vehicles from './pages/vehicles/Vehicles';
import Drivers from './pages/drivers/Drivers';
import Trips from './pages/trips/Trips';
import MaintenancePage from './pages/maintenance/Maintenance';
import FuelExpenses from './pages/fuel/FuelExpenses';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';
import NotFound from './pages/notfound/NotFound';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            
            {/* Guest / Public route */}
            <Route path="/login" element={<Login />} />

            {/* Guarded Core Operations Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedLayout>
                  <Navigate to="/dashboard" replace />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/vehicles" 
              element={
                <ProtectedLayout>
                  <Vehicles />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/drivers" 
              element={
                <ProtectedLayout>
                  <Drivers />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/trips" 
              element={
                <ProtectedLayout>
                  <Trips />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/maintenance" 
              element={
                <ProtectedLayout>
                  <MaintenancePage />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/fuel" 
              element={
                <ProtectedLayout>
                  <FuelExpenses />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/analytics" 
              element={
                <ProtectedLayout>
                  <Analytics />
                </ProtectedLayout>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              } 
            />

            {/* Error Fallback 404 route */}
            <Route 
              path="*" 
              element={
                <ProtectedLayout>
                  <NotFound />
                </ProtectedLayout>
              } 
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
