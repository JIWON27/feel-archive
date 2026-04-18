'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MainContent>{children}</MainContent>
    </AuthProvider>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useProtectedRoute();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 pt-14 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
