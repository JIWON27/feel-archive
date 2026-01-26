'use client';

import React from 'react';
import Link from 'next/link';
import { useMyArchiveList } from '@/hooks/use-archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { Button } from '@/components/ui/Button';

export default function MyArchivesPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useMyArchiveList();

  const allArchives = data?.pages.flatMap((page) => page.content) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">아카이브를 불러오지 못했습니다</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">내 아카이브</h1>
            <p className="mt-2 text-gray-600">
              내가 작성한 모든 아카이브 (공개 + 비공개)
            </p>
          </div>
          <Link href="/archives/new">
            <Button>+ 새 아카이브</Button>
          </Link>
        </div>

        {/* 아카이브 목록 */}
        {allArchives.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">
              아직 작성한 아카이브가 없습니다
            </p>
            <Link href="/archives/new">
              <Button>첫 아카이브 작성하기</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {allArchives.map((archive) => (
                <ArchiveCard key={archive.archiveId} archive={archive} />
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <div className="text-center">
                <Button
                  onClick={() => fetchNextPage()}
                  isLoading={isFetchingNextPage}
                  variant="secondary"
                >
                  더보기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
