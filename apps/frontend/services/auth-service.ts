import apiClient from '@/lib/api';
import { LoginRequest, LoginResponse, SignupRequest } from '@/types/auth';

export const authService = {
  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      '/api/v1/login',
      credentials
    );
    return data;
  },

  // 회원가입
  async signup(userData: SignupRequest): Promise<void> {
    await apiClient.post('/api/v1/users', userData);
  },

  // 로그아웃
  async logout(): Promise<void> {
    await apiClient.delete('/api/v1/logout');
  },
};
