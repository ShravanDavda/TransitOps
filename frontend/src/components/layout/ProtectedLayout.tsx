import React from 'react';
import ProtectedRoute from '../../routes/ProtectedRoute';
import MainLayout from './MainLayout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
