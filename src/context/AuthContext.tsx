import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  login: (userId: string, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    if (storedUserId && storedUserName) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, []);

  const login = (userId: string, userName: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    setIsAuthenticated(true);
    setUserId(userId);
    setUserName(userName);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 