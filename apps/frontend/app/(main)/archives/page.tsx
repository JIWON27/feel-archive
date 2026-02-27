'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useArchiveList } from '@/hooks/use-archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { Button } from '@/components/ui/Button';
import { EmotionType, EmotionLabels, ArchiveSearchCondition } from '@/types/archive';

export default function ArchivesPage() {
  const [condition, setCondition] = useState<ArchiveSearchCondition>({
    sortType: 'LATEST',
  });
  const [keywordInput, setKeywordInput] = useState('');

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

  const handleSortChange = (sortType: 'LATEST' | 'OLDEST' | 'POPULAR' | 'LIKE') => {
    setCondition((prev) => ({ ...prev, sortType }));
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCondition((prev) => ({ ...prev, keyword: keywordInput.trim() || undefined }));
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

        {/* 검색 & 필터 & 정렬 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          {/* 키워드 검색 */}
          <div className="mb-4">
            <form onSubmit={handleKeywordSearch} className="relative">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="키워드로 검색..."
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary/90"
              >
                검색
              </button>
            </form>
            {condition.keyword && (
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>"{condition.keyword}" 검색 중</span>
                <button
                  onClick={() => {
                    setKeywordInput('');
                    setCondition((prev) => ({ ...prev, keyword: undefined }));
                  }}
                  className="text-primary hover:underline"
                >
                  초기화
                </button>
              </div>
            )}
          </div>

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
                onClick={() => handleSortChange('LATEST')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sortType === 'LATEST'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => handleSortChange('OLDEST')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sortType === 'OLDEST'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                오래된순
              </button>
              <button
                onClick={() => handleSortChange('POPULAR')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sortType === 'POPULAR'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                인기순
              </button>
              <button
                onClick={() => handleSortChange('LIKE')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition.sortType === 'LIKE'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                좋아요순
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
