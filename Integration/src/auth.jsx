import { createContext, useContext, useEffect, useState } from 'react';
import api, { unwrap } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (localStorage.getItem('token')) {
      unwrap(api.get('/auth/me'))
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    }
    const expired = () => setUser(null);
    window.addEventListener('auth:expired', expired);
    return () => window.removeEventListener('auth:expired', expired);
  }, []);

  const authenticate = async (path, body) => {
    const { token, ...profile } = await unwrap(api.post(path, body));
    localStorage.setItem('token', token);
    setUser(profile);
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return (
    <Ctx.Provider value={{
      user, loading, logout,
      login: (b) => authenticate('/auth/login', b),
      register: (b) => authenticate('/auth/register', b),
    }}>{children}</Ctx.Provider>
  );
}
