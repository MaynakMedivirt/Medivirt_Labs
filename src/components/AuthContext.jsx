// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase auth
const auth = getAuth();

// Create AuthContext
const AuthContext = createContext();

// Custom AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const login = () => {
    setIsAdminLoggedIn(true);
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Make setCurrentUser available in the context value
  const contextValue = { currentUser, setCurrentUser, isAdminLoggedIn, login, logout  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
