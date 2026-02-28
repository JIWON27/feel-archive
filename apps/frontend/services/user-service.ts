import apiClient from '@/lib/api';
import {
  MyPageResponse,
  UpdatePasswordRequest,
  UpdateEmailNotificationRequest,
  WithdrawRequest,
} from '@/types/user';

export const userService = {
  // 내 정보 조회
  async getMyInfo(): Promise<MyPageResponse> {
    const { data } = await apiClient.get<MyPageResponse>('/api/v1/users/me');
    return data;
  },

  // 비밀번호 변경
  async updatePassword(request: UpdatePasswordRequest): Promise<void> {
    await apiClient.patch('/api/v1/users/me/password', request);
  },

  // 이메일 알림 설정 변경
  async updateEmailNotification(
    request: UpdateEmailNotificationRequest
  ): Promise<void> {
    await apiClient.patch(
      '/api/v1/users/me/settings/email-notification',
      request
    );
  },

  // 회원탈퇴
  async withdraw(request: WithdrawRequest): Promise<void> {
    await apiClient.delete('/api/v1/users', { data: request });
  },
};
