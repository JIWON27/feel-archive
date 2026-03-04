'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Header } from '@/components/layout/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 미인증 사용자는 로그인 페이지로 리다이렉트
  const { isAuthenticated } = useProtectedRoute();

  // 인증되지 않았으면 빈 화면 (리다이렉트 중)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      {/* 헤더 높이(56px)만큼 아래로 */}
      <main className="flex-1 pt-14 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
