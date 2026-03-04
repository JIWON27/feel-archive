import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from './utils/token';
import { LoginResponse } from '@/types/auth';

// API 기본 URL
// 프록시를 통해 same-origin 요청으로 처리 (쿠키 전송 문제 방지)
// next.config.mjs에서 /api/* → http://localhost:8080/api/* 로 프록시됨
const API_BASE_URL = '';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // refreshToken 쿠키 전송을 위해 필요
});

// Request Interceptor: Authorization 헤더에 JWT 자동 추가
// 외부 URL(S3 등)은 Bearer 토큰 미지원이므로 제외
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getAccessToken();
    const isExternalUrl = config.url?.startsWith('http');
    if (token && !isExternalUrl) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 에러 시 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 재발급 시도 (refreshToken은 httpOnly 쿠키로 자동 전송됨)
        const { data } = await axios.post<LoginResponse>(
          `${API_BASE_URL}/api/v1/token/reIssue`,
          {},
          { withCredentials: true }
        );

        // 새로운 accessToken 저장
        tokenUtils.setAccessToken(data.accessToken);
        tokenUtils.setUserId(data.userId);

        // 원래 요청에 새 토큰 적용
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        // 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        if (process.env.NODE_ENV === 'development') {
          console.warn('[API] Token refresh failed, clearing auth state');
        }

        tokenUtils.clearAll();

        // 로그인 페이지로 리다이렉트 (클라이언트 사이드)
        // Note: Zustand store는 protected route hook에서 동기화됨
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
