import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return admin? children : <Navigate to="/admin/login" />;
}

export default PrivateRoute;