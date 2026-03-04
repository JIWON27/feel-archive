'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useUnreadNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/use-notifications';
import { NotificationResponse } from '@/types/notification';

interface NotificationDropdownProps {
  onClose: () => void;
}

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
  return `${days}일 전`;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useUnreadNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const notifications = data?.content || [];
  const hasNotifications = notifications.length > 0;

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onClose();
    if (notification.relatedId) {
      router.push(`/timecapsule/${notification.relatedId}`);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">알림</h3>
        {hasNotifications && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 알림 목록 */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : !hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <span className="text-3xl mb-2">🔔</span>
            <p className="text-sm text-gray-500">새로운 알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                !notification.isRead ? 'bg-primary/5' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5 flex-shrink-0">🎁</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5"></span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* 하단 - 전체 보기 */}
      <div className="border-t border-gray-100">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block text-center py-3 text-sm text-primary hover:bg-primary/5 transition-colors font-medium"
        >
          전체 알림 보기
        </Link>
      </div>
    </div>
  );
}
