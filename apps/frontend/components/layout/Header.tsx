'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUnreadNotifications } from '@/hooks/use-notifications';
import { useSseNotification } from '@/hooks/use-sse';
import { NotificationDropdown } from '@/components/notification/NotificationDropdown';
import { useAuthStore } from '@/stores/auth-store';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/stores/notification-store';
import { EmotionWeatherTicker } from '@/components/emotion/EmotionWeatherTicker';

function NavItem({
  href,
  label,
  currentPath,
}: {
  href: string;
  label: string;
  currentPath: string;
}) {
  const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { logout: handleLogoutFn } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Zustand 스토어: 실시간 배지 카운트
  const { unreadCount, setUnreadCount } = useNotificationStore();

  // 서버에서 초기 unread count 로드 → Zustand 동기화 (SSE 연결 실패 대비 1분 폴링)
  const { data: unreadData } = useUnreadNotifications();
  useEffect(() => {
    if (unreadData?.totalElements !== undefined) {
      setUnreadCount(unreadData.totalElements);
    }
  }, [unreadData?.totalElements, setUnreadCount]);

  // SSE 실시간 알림 수신
  useSseNotification(isAuthenticated);

  const handleLogout = () => {
    handleLogoutFn();
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-14">
      <div className="flex items-center justify-between h-full px-4 max-w-full">
        {/* 로고 + 감정 날씨 (가로 배치) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🗂️</span>
            <span className="font-bold text-gray-900 text-base">Feel-Archive</span>
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <EmotionWeatherTicker />
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem href="/" label="홈" currentPath={pathname} />
          <NavItem href="/archives" label="피드" currentPath={pathname} />
          <NavItem href="/my/timecapsules" label="타임캡슐" currentPath={pathname} />
          <NavItem href="/my/archives" label="내 아카이브" currentPath={pathname} />
        </nav>

        {/* 오른쪽 액션 */}
        <div className="flex items-center gap-2">
          {/* 글 작성 버튼 */}
          <Link
            href="/archives/new"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>글 쓰기</span>
          </Link>

          {/* 타임캡슐 작성 버튼 */}
          <Link
            href="/timecapsule/new"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <span>🎁</span>
            <span>타임캡슐</span>
          </Link>

          {/* 알림 버튼 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="알림"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* 유저 메뉴 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="사용자 메뉴"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="py-1">
                  <Link
                    href="/my/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    마이페이지
                  </Link>
                  <Link
                    href="/my/archives"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    내 아카이브
                  </Link>
                  <Link
                    href="/my/timecapsules"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    내 타임캡슐
                  </Link>
                  <Link
                    href="/my/scraps"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    스크랩
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    알림 전체 보기
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
