import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { userService } from '@/services/user-service';
import { useAuthStore } from '@/stores/auth-store';
import {
  UpdatePasswordRequest,
  UpdateEmailNotificationRequest,
  WithdrawRequest,
} from '@/types/user';

export const useMyPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useAuthStore();

  // 내 정보 조회
  const myInfoQuery = useQuery({
    queryKey: ['myInfo'],
    queryFn: () => userService.getMyInfo(),
  });

  // 비밀번호 변경
  const updatePasswordMutation = useMutation({
    mutationFn: (request: UpdatePasswordRequest) =>
      userService.updatePassword(request),
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '비밀번호 변경에 실패했습니다';
      toast.error(message);
    },
  });

  // 이메일 알림 설정 변경
  const updateEmailNotificationMutation = useMutation({
    mutationFn: (request: UpdateEmailNotificationRequest) =>
      userService.updateEmailNotification(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      toast.success('이메일 알림 설정이 변경되었습니다');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '알림 설정 변경에 실패했습니다';
      toast.error(message);
    },
  });

  // 회원탈퇴
  const withdrawMutation = useMutation({
    mutationFn: (request: WithdrawRequest) => userService.withdraw(request),
    onSuccess: () => {
      logout();
      toast.success('회원탈퇴가 완료되었습니다');
      router.push('/login');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '회원탈퇴에 실패했습니다';
      toast.error(message);
    },
  });

  return {
    myInfo: myInfoQuery.data,
    isLoading: myInfoQuery.isLoading,
    isError: myInfoQuery.isError,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatePasswordPending: updatePasswordMutation.isPending,
    updateEmailNotification: updateEmailNotificationMutation.mutate,
    isUpdateEmailNotificationPending:
      updateEmailNotificationMutation.isPending,
    withdraw: withdrawMutation.mutate,
    isWithdrawPending: withdrawMutation.isPending,
  };
};
