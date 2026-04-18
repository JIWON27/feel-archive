import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { notificationService } from '@/services/notification-service';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: object) => [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

// 알림 목록 조회 (무한 스크롤)
export function useNotificationList(isRead?: boolean) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list({ isRead }),
    queryFn: async ({ pageParam = 1 }) => {
      return notificationService.getList({ page: pageParam, size: 20, isRead });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageNo + 1;
    },
  });
}

// 읽지 않은 알림 조회 (헤더 배지용)
export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getList({ isRead: false, size: 20 }),
    refetchInterval: 60000, // 1분마다 폴링 (SSE 연결 실패 대비)
  });
}

// 개별 알림 읽음 처리
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      toast.error('알림 읽음 처리에 실패했습니다.');
    },
  });
}

// 전체 알림 읽음 처리
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success('모든 알림을 읽음 처리했습니다.');
    },
    onError: () => {
      toast.error('알림 처리에 실패했습니다.');
    },
  });
}
