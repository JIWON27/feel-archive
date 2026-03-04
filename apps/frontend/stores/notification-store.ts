import { create } from 'zustand';
import { NotificationEvent } from '@/types/notification';

interface NotificationStore {
  // 읽지 않은 알림 개수 (SSE 이벤트로 실시간 업데이트)
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;

  // SSE로 수신된 마지막 알림 (토스트 표시용)
  latestEvent: NotificationEvent | null;
  setLatestEvent: (event: NotificationEvent) => void;
  clearLatestEvent: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

  latestEvent: null,
  setLatestEvent: (event) => set({ latestEvent: event }),
  clearLatestEvent: () => set({ latestEvent: null }),
}));
