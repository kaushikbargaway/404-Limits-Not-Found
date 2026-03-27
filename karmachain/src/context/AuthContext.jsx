import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginOrCreateUser } from '../api/userService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'karmachain_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep localStorage in sync whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginOrCreateUser(name);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.msg || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Refresh the currentUser from a fresh object (e.g. after coins change)
  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
