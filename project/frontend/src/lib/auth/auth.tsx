import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, getToken, setToken as storeToken, clearToken } from './api';
import { isDevMode, getDevUser, getDevRole, clearDevUser } from './dev-auth';
import type { AuthUser } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(getToken);

  const setToken = useCallback((newToken: string | null) => {
    storeToken(newToken);
    setTokenState(newToken);
  }, []);

  const devUser = getDevUser();
  const devRole = getDevRole();
  const inDevMode = isDevMode() && !!devUser;

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await api.get<AuthUser>('/api/auth/me');
      setUser(userData);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  // Dev mode: create/fetch user from dev auth endpoint
  useEffect(() => {
    if (!inDevMode) return;
    setIsLoading(true);
    api
      .post<{ id: number; email: string; displayName: string; role: string }>(
        '/api/auth/dev/create',
        { email: devUser, role: devRole },
      )
      .then((userData) => {
        setUser({
          id: String(userData.id),
          email: userData.email,
          displayName: userData.displayName,
          role: devRole,
        });
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [devUser, devRole, inDevMode]);

  // Resolve user from JWT token (Authorization header).
  useEffect(() => {
    if (inDevMode) return;

    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, [token, fetchUser, inDevMode]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token: newToken } = await api.post<{ token: string }>(
        '/api/auth/login',
        { email, password },
      );
      setToken(newToken);
    },
    [setToken],
  );

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const { token: newToken } = await api.post<{ token: string }>(
        '/api/auth/register',
        { email, password, displayName },
      );
      setToken(newToken);
      await fetchUser();
    },
    [setToken, fetchUser],
  );

  const logout = useCallback(() => {
    if (inDevMode) {
      clearDevUser();
      const url = new URL(window.location.href);
      url.searchParams.delete('_user');
      url.searchParams.delete('_role');
      const sanitized = url.toString();
      if (new URL(sanitized).origin !== window.location.origin) return;
      window.location.assign(sanitized);
      return;
    }
    clearToken();
    setTokenState(null);
    setUser(null);
  }, [inDevMode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
