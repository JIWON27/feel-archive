import api from '@/lib/api';
import { NotificationResponse, NotificationPageResponse } from '@/types/notification';

export const notificationService = {
  // 알림 목록 조회
  async getList(params?: {
    page?: number;
    size?: number;
    isRead?: boolean;
  }): Promise<NotificationPageResponse> {
    const response = await api.get('/api/v1/notifications', { params });
    return response.data;
  },

  // 개별 알림 읽음 처리
  async markAsRead(id: number): Promise<void> {
    await api.patch(`/api/v1/notifications/${id}/read`);
  },

  // 전체 알림 읽음 처리
  async markAllAsRead(): Promise<void> {
    await api.patch('/api/v1/notifications/read-all');
  },
};
