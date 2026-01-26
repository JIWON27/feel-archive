import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/stores/auth-store';
import { LoginRequest, SignupRequest } from '@/types/auth';
import { AxiosError } from 'axios';

export const useAuth = () => {
  const router = useRouter();
  const { login: setAuth, logout: clearAuth } = useAuthStore();

  // 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // 인증 상태 저장
      setAuth(data.userId, data.accessToken);
      toast.success('로그인되었습니다');
      router.push('/');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '로그인에 실패했습니다';
      toast.error(message);
    },
  });

  // 회원가입 mutation
  const signupMutation = useMutation({
    mutationFn: (userData: SignupRequest) => authService.signup(userData),
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다');
      router.push('/login');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '회원가입에 실패했습니다';
      toast.error(message);
    },
  });

  // 로그아웃 mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      toast.success('로그아웃되었습니다');
      router.push('/login');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      // 에러가 발생해도 로컬 상태는 지움
      clearAuth();
      const message =
        error.response?.data?.message || '로그아웃에 실패했습니다';
      toast.error(message);
      router.push('/login');
    },
  });

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};
