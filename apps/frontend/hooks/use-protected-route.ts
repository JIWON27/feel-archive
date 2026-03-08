import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Protected route hook
 * 미인증 사용자를 로그인 페이지로 리다이렉트
 */
export const useProtectedRoute = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, logout, router]);

  return { isAuthenticated };
};

/**
 * Public only route hook
 * 인증된 사용자를 홈으로 리다이렉트 (로그인/회원가입 페이지용)
 */
export const usePublicOnlyRoute = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
};
