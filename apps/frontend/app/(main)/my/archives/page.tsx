'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMyArchiveList } from '@/hooks/use-archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { Button } from '@/components/ui/Button';
import { EmotionType, ArchiveSearchCondition } from '@/types/archive';
import { useEmotions } from '@/hooks/use-emotions';
import { EMOTION_EMOJI } from '@/types/emotion';

export default function MyArchivesPage() {
  const { emotions, getLabel } = useEmotions();
  const [condition, setCondition] = useState<ArchiveSearchCondition>({
    sortType: 'LATEST',
  });
  const [showSearch, setShowSearch] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useMyArchiveList(condition);

  const allArchives = data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  const handleEmotionFilter = (emotion?: EmotionType) => {
    setCondition((prev) => ({ ...prev, emotion }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCondition((prev) => ({
      ...prev,
      sortType: e.target.value as ArchiveSearchCondition['sortType'],
    }));
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCondition((prev) => ({ ...prev, keyword: keywordInput.trim() || undefined }));
  };

  const clearKeyword = () => {
    setKeywordInput('');
    setCondition((prev) => ({ ...prev, keyword: undefined }));
    setShowSearch(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 아카이브</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              총 <span className="font-semibold text-primary">{totalElements}</span>개의 기록
            </p>
          </div>
          <Link href="/archives/new">
            <Button>+ 새 아카이브</Button>
          </Link>
        </div>

        {/* 필터 툴바 */}
        <div className="mb-6 space-y-3">
          {/* 감정 칩 + 정렬 드롭다운 한 줄 */}
          <div className="flex items-center gap-3">
            {/* 감정 칩 - 가로 스크롤 */}
            <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => handleEmotionFilter(undefined)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  !condition.emotion
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                전체
              </button>
              {emotions.map(({ name, label }) => {
                const emotion = name as EmotionType;
                const isSelected = condition.emotion === emotion;
                return (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionFilter(emotion)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span>{EMOTION_EMOJI[name]}</span>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* 우측: 검색 토글 + 정렬 드롭다운 */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {/* 검색 토글 버튼 */}
              <button
                onClick={() => {
                  setShowSearch((v) => !v);
                  if (showSearch) clearKeyword();
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  condition.keyword
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
                title="키워드 검색"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 정렬 드롭다운 */}
              <select
                value={condition.sortType ?? 'LATEST'}
                onChange={handleSortChange}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="LATEST">최신순</option>
                <option value="OLDEST">오래된순</option>
                <option value="POPULAR">인기순</option>
                <option value="LIKE">좋아요순</option>
              </select>
            </div>
          </div>

          {/* 검색 입력창 (토글) */}
          {showSearch && (
            <form onSubmit={handleKeywordSearch} className="relative">
              <input
                autoFocus
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="내 기록에서 검색..."
                className="w-full pl-4 pr-24 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute right-2 top-1.5 flex gap-1">
                {condition.keyword && (
                  <button
                    type="button"
                    onClick={clearKeyword}
                    className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    초기화
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary/90"
                >
                  검색
                </button>
              </div>
            </form>
          )}

          {/* 활성 필터 요약 */}
          {(condition.emotion || condition.keyword) && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>필터:</span>
              {condition.emotion && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {EMOTION_EMOJI[condition.emotion]} {getLabel(condition.emotion)}
                  <button onClick={() => handleEmotionFilter(undefined)} className="ml-1 hover:text-primary/70">×</button>
                </span>
              )}
              {condition.keyword && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                  &quot;{condition.keyword}&quot;
                  <button onClick={clearKeyword} className="ml-1 hover:text-gray-500">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 아카이브 목록 */}
        {allArchives.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            {condition.emotion || condition.keyword ? (
              <>
                <p className="text-gray-400 text-4xl mb-3">🔍</p>
                <p className="text-gray-500 mb-3">검색 결과가 없습니다</p>
                <button
                  onClick={() => {
                    setCondition({ sortType: 'LATEST' });
                    setKeywordInput('');
                    setShowSearch(false);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  필터 초기화
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-4xl mb-3">📝</p>
                <p className="text-gray-500 mb-4">아직 작성한 아카이브가 없습니다</p>
                <Link href="/archives/new">
                  <Button>첫 아카이브 작성하기</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {allArchives.map((archive) => (
                <ArchiveCard key={archive.archiveId} archive={archive} />
              ))}
            </div>
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
