import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { assessmentResponses } = useUser();

  if (assessmentResponses.length === 0) {
    return <Navigate to="/assessment" replace />;
  }

  return <>{children}</>;
};

