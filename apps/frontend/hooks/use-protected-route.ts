import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { tokenUtils } from '@/lib/utils/token';

/**
 * Protected route hook
 * 미인증 사용자를 로그인 페이지로 리다이렉트
 */
export const useProtectedRoute = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // localStorage와 store 상태 동기화 확인
    const hasToken = tokenUtils.isAuthenticated();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Protected Route] Auth check:', {
        storeAuth: isAuthenticated,
        hasToken,
      });
    }

    // store는 인증됨이지만 실제 토큰이 없는 경우 (불일치 상태)
    if (isAuthenticated && !hasToken) {
      console.warn('[Protected Route] Auth state mismatch - clearing store');
      logout();
      router.replace('/login');
      return;
    }

    // 인증되지 않은 경우
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
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // localStorage와 store 상태 동기화 확인
    const hasToken = tokenUtils.isAuthenticated();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Public Only Route] Auth check:', {
        storeAuth: isAuthenticated,
        hasToken,
      });
    }

    // store는 인증됨이지만 실제 토큰이 없는 경우 (불일치 상태)
    if (isAuthenticated && !hasToken) {
      console.warn('[Public Only Route] Auth state mismatch - clearing store');
      logout();
      return;
    }

    // 인증된 사용자는 홈으로
    if (isAuthenticated && hasToken) {
      router.replace('/');
    }
  }, [isAuthenticated, logout, router]);

  return { isAuthenticated };
};
