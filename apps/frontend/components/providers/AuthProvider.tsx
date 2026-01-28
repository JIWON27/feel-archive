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
    // 앱 시작 시 localStorage에서 인증 상태 복원
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  // 초기화가 완료될 때까지 아무것도 렌더링하지 않음
  // 이렇게 하면 리다이렉트 깜빡임을 방지할 수 있음
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};
