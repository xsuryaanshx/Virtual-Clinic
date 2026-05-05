import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'patient' | 'doctor';

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  name: string | null;
}

interface AuthContextType extends AuthState {
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredAuth = (): AuthState => {
  try {
    const stored = localStorage.getItem('vc_auth');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { isLoggedIn: false, role: null, name: null };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(getStoredAuth);

  const login = useCallback((role: UserRole, name?: string) => {
    const state: AuthState = {
      isLoggedIn: true,
      role,
      name: name || (role === 'patient' ? 'Patient' : 'Doctor'),
    };
    localStorage.setItem('vc_auth', JSON.stringify(state));
    setAuth(state);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vc_auth');
    setAuth({ isLoggedIn: false, role: null, name: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};