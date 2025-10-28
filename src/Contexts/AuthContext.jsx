// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signOut, db } from '../firebase'; // Import the initialized auth object
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    // This listener runs once on mount, and then again on login/logout
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if(user){
        // Retrieve user data
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data());
        }
      }else{
        setCurrentUserProfile(null);
      }

      setLoading(false); // We know the state (logged in or out)
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth); // Firebase signOut returns a promise
  };

  const updateProfileState = (newProfileData) => {
    setCurrentUserProfile(newProfileData);
  };

  const value = {
    currentUser,
    currentUserProfile,
    loading,
    logout,
    updateProfileState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};