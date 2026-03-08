import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { LoginResponse } from '@/types/auth';
import { useAuthStore } from '@/stores/auth-store';

const API_BASE_URL = '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Zustand 메모리에서 Access Token 읽어 헤더 추가
// 외부 URL(S3 등)은 Bearer 토큰 미지원이므로 제외
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    const isExternalUrl = config.url?.startsWith('http');
    if (accessToken && !isExternalUrl) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token 쿠키 자동 전송으로 재발급
        const { data } = await axios.post<LoginResponse>(
          `${API_BASE_URL}/api/v1/token/reIssue`,
          {},
          { withCredentials: true }
        );

        // Zustand 메모리에 새 토큰 저장
        useAuthStore.getState().setTokens(data.userId, data.accessToken);

        // 원래 요청에 새 토큰 적용 후 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[API] Token refresh failed, clearing auth state');
        }

        useAuthStore.getState().logout();

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
