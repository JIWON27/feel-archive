'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // 앱 시작 시 localStorage에서 인증 상태 복원
    initialize();
  }, [initialize]);

  return <>{children}</>;
};
