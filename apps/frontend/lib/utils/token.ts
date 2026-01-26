// 토큰 및 사용자 정보 localStorage 관리 유틸리티

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';

export const tokenUtils = {
  // Access Token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // User ID
  getUserId(): number | null {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem(USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  },

  setUserId(userId: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_ID_KEY, userId.toString());
  },

  removeUserId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_ID_KEY);
  },

  // 모든 인증 정보 삭제
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  // 인증 상태 확인
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getUserId();
  },
};
