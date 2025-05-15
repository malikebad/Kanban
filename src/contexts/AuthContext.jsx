import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('kanbanUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockUser = { id: `user-${Date.now()}`, email, username: email.split('@')[0] };
    localStorage.setItem('kanbanUser', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = (email, password) => {
    const mockUser = { id: `user-${Date.now()}`, email, username: email.split('@')[0] };
    localStorage.setItem('kanbanUserToRegister', JSON.stringify(mockUser));
  };

  const logout = () => {
    localStorage.removeItem('kanbanUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);