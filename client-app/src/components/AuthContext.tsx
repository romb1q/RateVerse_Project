// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'guest' | 'user' | 'admin';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('guest');
  const isLoggedIn = role !== 'guest';

  const login = (role: Role) => setRole(role);
  const logout = () => setRole('guest');

  return (
    <AuthContext.Provider value={{ role, setRole, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
