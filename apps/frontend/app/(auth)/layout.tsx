'use client';

import { usePublicOnlyRoute } from '@/hooks/use-protected-route';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인된 사용자는 홈으로 리다이렉트
  usePublicOnlyRoute();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
