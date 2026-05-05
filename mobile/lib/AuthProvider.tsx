import { useQueryClient } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getToken, setToken } from './auth';
import { setUnauthorizedHandler } from './apiClient';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  bootstrapComplete: boolean;
  signIn: (nextToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setLocalToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const savedToken = await getToken();
      if (!mounted) return;
      setLocalToken(savedToken);
      setStatus(savedToken ? 'authenticated' : 'unauthenticated');
    };

    initialize();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearToken();
      setLocalToken(null);
      setStatus('unauthenticated');
      queryClient.clear();
    });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      bootstrapComplete: status !== 'loading',
      signIn: async (nextToken: string) => {
        await setToken(nextToken);
        setLocalToken(nextToken);
        setStatus('authenticated');
      },
      signOut: async () => {
        await clearToken();
        setLocalToken(null);
        setStatus('unauthenticated');
        queryClient.clear();
      },
    }),
    [queryClient, status, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthSession must be used within AuthProvider');
  }
  return context;
}
