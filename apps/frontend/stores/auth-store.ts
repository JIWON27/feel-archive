import { create } from 'zustand';
import { tokenUtils } from '@/lib/utils/token';

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  login: (userId: number, accessToken: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,

  // 로그인: 토큰과 userId를 저장하고 상태 업데이트
  login: (userId: number, accessToken: string) => {
    tokenUtils.setAccessToken(accessToken);
    tokenUtils.setUserId(userId);
    set({ isAuthenticated: true, userId });
  },

  // 로그아웃: 모든 인증 정보 삭제
  logout: () => {
    tokenUtils.clearAll();
    set({ isAuthenticated: false, userId: null });
  },

  // 초기화: localStorage에서 인증 상태 복원
  initialize: () => {
    const accessToken = tokenUtils.getAccessToken();
    const userId = tokenUtils.getUserId();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Initializing auth state:', {
        hasToken: !!accessToken,
        userId,
      });
    }

    if (accessToken && userId) {
      set({ isAuthenticated: true, userId });
    } else {
      // 토큰이나 userId 중 하나라도 없으면 전체 삭제
      tokenUtils.clearAll();
      set({ isAuthenticated: false, userId: null });
    }
  },
}));
