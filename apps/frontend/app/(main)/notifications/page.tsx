'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useNotificationList,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/use-notifications';
import { NotificationResponse } from '@/types/notification';

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationList();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const allNotifications = data?.pages.flatMap((page) => page.content) || [];
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.relatedId) {
      router.push(`/timecapsule/${notification.relatedId}`);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">알림</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">
                읽지 않은 알림 <span className="font-semibold text-primary">{unreadCount}개</span>
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
              className="text-sm text-primary hover:underline disabled:opacity-50 font-medium"
            >
              모두 읽음
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">알림을 불러오지 못했습니다.</p>
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🔔</span>
            <p className="text-lg font-semibold text-gray-700 mb-2">알림이 없어요</p>
            <p className="text-sm text-gray-500 mb-6">
              타임캡슐이 열리면 알림이 도착할 거예요!
            </p>
            <Link
              href="/timecapsule/new"
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              타임캡슐 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {allNotifications.map((notification) => (
              <button
                key={notification.id}
                className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                  !notification.isRead
                    ? 'border-primary/30 ring-1 ring-primary/10'
                    : 'border-transparent'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      !notification.isRead ? 'bg-primary/10' : 'bg-gray-100'
                    }`}
                  >
                    🎁
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          !notification.isRead
                            ? 'font-semibold text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {/* 더 불러오기 */}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-3 text-sm text-primary hover:bg-white rounded-xl transition-colors disabled:opacity-50 mt-2"
              >
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
