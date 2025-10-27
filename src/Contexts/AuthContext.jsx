// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signOut } from '../firebase'; // Import the initialized auth object

// 1. Create the Context
// Note to self: Context allows a React component to share it's props with all it's children, grandchildren, and so on.
//               Basically it makes it's props into global props like global variables

// Provider
const AuthContext = createContext({
  currentUser: null,
  loading: true // Key state to prevent rendering before Firebase checks status
});

// Consumer
// Hook for components to easily access auth state
export const useAuth = () => useContext(AuthContext);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener runs once on mount, and then again on login/logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // We know the state (logged in or out)
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth); // Firebase signOut returns a promise
  };

  const value = {
    currentUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};