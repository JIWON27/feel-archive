import { create } from 'zustand';
import axios from 'axios';
import { LoginResponse } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  accessToken: string | null;
  login: (userId: number, accessToken: string) => void;
  logout: () => void;
  setTokens: (userId: number, accessToken: string) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  accessToken: null,

  login: (userId: number, accessToken: string) => {
    set({ isAuthenticated: true, userId, accessToken });
  },

  logout: () => {
    set({ isAuthenticated: false, userId: null, accessToken: null });
  },

  // 401 interceptor에서 토큰 갱신 후 store 업데이트용
  setTokens: (userId: number, accessToken: string) => {
    set({ isAuthenticated: true, userId, accessToken });
  },

  // 앱 시작 시 silent refresh로 인증 상태 복원
  initialize: async () => {
    // 이전 버전 레거시 localStorage 데이터 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
    }
    try {
      const { data } = await axios.post<LoginResponse>(
        '/api/v1/token/reIssue',
        {},
        { withCredentials: true }
      );
      set({ isAuthenticated: true, userId: data.userId, accessToken: data.accessToken });
    } catch {
      set({ isAuthenticated: false, userId: null, accessToken: null });
    }
  },
}));
