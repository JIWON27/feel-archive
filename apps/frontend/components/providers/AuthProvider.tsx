'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // silent refresh로 인증 상태 복원 후 렌더
    initialize().finally(() => setIsInitialized(true));
  }, [initialize]);

  // silent refresh 완료 전까지 렌더 블록 (리다이렉트 깜빡임 방지)
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};
