'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useArchiveList } from '@/hooks/use-archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { Button } from '@/components/ui/Button';
import { EmotionType, EmotionLabels, ArchiveSearchCondition } from '@/types/archive';

export default function ArchivesPage() {
  const [condition, setCondition] = useState<ArchiveSearchCondition>({
    sort: 'latest',
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useArchiveList(condition);

  const allArchives = data?.pages.flatMap((page) => page.content) || [];

  const handleEmotionFilter = (emotion?: EmotionType) => {
    setCondition((prev) => ({ ...prev, emotion }));
  };

  const handleSortChange = (sort: 'latest' | 'oldest' | 'popular') => {
    setCondition((prev) => ({ ...prev, sort }));
  };

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
            <h1 className="text-3xl font-bold text-gray-900">아카이브</h1>
            <p className="mt-2 text-gray-600">모든 감정 기록을 탐색해보세요</p>
          </div>
          <Link href="/archives/new">
            <Button>+ 새 아카이브</Button>
          </Link>
        </div>

        {/* 필터 & 정렬 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          {/* 감정 필터 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              감정 필터
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEmotionFilter(undefined)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !condition.emotion
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {Object.entries(EmotionLabels).map(([key, label]) => {
                const emotion = key as EmotionType;
                const isSelected = condition.emotion === emotion;

                return (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionFilter(emotion)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 정렬 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정렬
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange('latest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sort === 'latest'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sort === 'oldest'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                오래된순
              </button>
              <button
                onClick={() => handleSortChange('popular')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sort === 'popular'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                인기순
              </button>
            </div>
          </div>
        </div>

        {/* 아카이브 목록 */}
        {allArchives.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">아직 작성된 아카이브가 없습니다</p>
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
