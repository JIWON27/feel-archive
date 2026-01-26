'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';

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

  return <>{children}</>;
}
