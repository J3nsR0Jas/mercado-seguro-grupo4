import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, jsonBody, saveToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  const acceptSession = useCallback((session) => {
    saveToken(session.token);
    setUser(session.usuario);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setLoading(false);
      return () => { active = false; };
    }
    api('/auth/me')
      .then(({ usuario }) => { if (active) setUser(usuario); })
      .catch(() => { if (active) logout(); })
      .finally(() => { if (active) setLoading(false); });
    const expire = () => logout();
    window.addEventListener('mercado-session-expired', expire);
    return () => {
      active = false;
      window.removeEventListener('mercado-session-expired', expire);
    };
  }, [logout]);

  const login = async (correo, contrasena) => acceptSession(
    await api('/auth/login', { method: 'POST', body: jsonBody({ correo, contrasena }) })
  );
  const register = async (nombre, correo, contrasena) => acceptSession(
    await api('/auth/registro', { method: 'POST', body: jsonBody({ nombre, correo, contrasena }) })
  );
  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
