// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase auth
const auth = getAuth();

// Create AuthContext
const AuthContext = createContext();

// Custom AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);
  const [loading, setLoading] = useState(true);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isManagerLoggedIn, setIsManagerLoggedIn] = useState(false);

  const login = (role) => {
    if (role === 'Admin') {
      setIsAdminLoggedIn(true);
    } else if (role === 'Growth Manager') {
      setIsManagerLoggedIn(true);
    }
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setIsManagerLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(storedUser);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const contextValue = { currentUser, setCurrentUser, isAdminLoggedIn, isManagerLoggedIn, login, logout  };

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
