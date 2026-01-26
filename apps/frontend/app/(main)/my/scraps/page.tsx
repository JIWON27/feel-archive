'use client';

import React from 'react';
import Link from 'next/link';
import { useScrapList } from '@/hooks/use-archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { Button } from '@/components/ui/Button';

export default function MyScrapsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useScrapList();

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
          <p className="text-red-500 mb-4">스크랩 목록을 불러오지 못했습니다</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">스크랩한 아카이브</h1>
          <p className="mt-2 text-gray-600">
            관심있는 아카이브를 모아서 볼 수 있습니다
          </p>
        </div>

        {/* 아카이브 목록 */}
        {allArchives.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p className="text-gray-500 mb-4">스크랩한 아카이브가 없습니다</p>
            <Link href="/archives">
              <Button>아카이브 둘러보기</Button>
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
