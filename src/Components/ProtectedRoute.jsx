// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { currentUser, currentUserProfile, loading } = useAuth();

  // 1. Show a loading state while Firebase checks the user status
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading application...</div>;
  }

  // 2. If the user is NOT logged in, redirect them to the sign-in page
  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  if (currentUserProfile && currentUserProfile.completedSetup === false || !currentUserProfile){
    return <Navigate to="/setup" replace />;
  }

  console.log("PR: Current User:", currentUserProfile);

  // 3. If the user IS logged in, render the main application content
  return children;
};

export default ProtectedRoute;