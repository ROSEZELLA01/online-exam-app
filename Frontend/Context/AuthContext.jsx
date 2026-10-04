import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('examwise-role'));
  function signIn(selectedRole) { localStorage.setItem('examwise-role', selectedRole); setRole(selectedRole); }
  function signOut() { localStorage.removeItem('examwise-role'); setRole(null); }
  return <AuthContext.Provider value={{ role, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
