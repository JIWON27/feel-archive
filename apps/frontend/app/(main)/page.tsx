'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchiveList } from '@/hooks/use-archives';
import { ArchiveListItem } from '@/components/archive/ArchiveListItem';
import { KakaoMap } from '@/components/map/KakaoMap';
import { Button } from '@/components/ui/Button';
import { ArchiveSummary, EmotionLabels } from '@/types/archive';

export default function Home() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveSummary | null>(
    null
  );

  // 아카이브 목록 조회
  const { data, isLoading, error } = useArchiveList();
  const allArchives = data?.pages.flatMap((page) => page.content) || [];

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 가져오기 실패:', error);
          // 기본 위치 (서울)
          setCurrentLocation({ lat: 37.5665, lng: 126.978 });
        }
      );
    } else {
      // 기본 위치 (서울)
      setCurrentLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, []);

  const handleArchiveClick = (archive: ArchiveSummary) => {
    setSelectedArchive(archive);
  };

  const handleArchiveDetail = (archive: ArchiveSummary) => {
    router.push(`/archives/${archive.archiveId}`);
  };

  const handleMapArchiveClick = (archive: ArchiveSummary) => {
    setSelectedArchive(archive);
    // 스크롤하여 해당 아카이브 보이기
    const element = document.getElementById(`archive-${archive.archiveId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 왼쪽 사이드바 - 아카이브 리스트 */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col border-r border-gray-200 bg-white">
        {/* 헤더 */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Feel-Archive</h1>
            <Link href="/archives/new">
              <button className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </Link>
          </div>

          {/* 검색 바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="아카이브 검색..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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
          </div>

          {/* 현재 위치 표시 */}
          {currentLocation && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>현재 위치 주변 아카이브</span>
            </div>
          )}
        </div>

        {/* 아카이브 리스트 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">로딩 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-500 mb-4">
                  아카이브를 불러오지 못했습니다
                </p>
                <Button onClick={() => window.location.reload()}>
                  다시 시도
                </Button>
              </div>
            </div>
          ) : allArchives.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 mb-4">
                  아직 작성된 아카이브가 없습니다
                </p>
                <Link href="/archives/new">
                  <Button>첫 아카이브 작성하기</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {allArchives.map((archive) => (
                <div
                  key={archive.archiveId}
                  id={`archive-${archive.archiveId}`}
                  onDoubleClick={() => handleArchiveDetail(archive)}
                >
                  <ArchiveListItem
                    archive={archive}
                    isSelected={
                      selectedArchive?.archiveId === archive.archiveId
                    }
                    onClick={() => handleArchiveClick(archive)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 - 지도 */}
      <div className="flex-1 relative">
        {currentLocation ? (
          <>
            <KakaoMap
              archives={allArchives}
              center={currentLocation}
              onArchiveClick={handleMapArchiveClick}
              selectedArchiveId={selectedArchive?.archiveId}
            />

            {/* 선택된 아카이브 미리보기 */}
            {selectedArchive && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-xl p-4 z-10">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {EmotionLabels[selectedArchive.emotion]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2 mb-2">
                      {selectedArchive.contentPreview}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {selectedArchive.writer.nickname}
                      </span>
                      <button
                        onClick={() => handleArchiveDetail(selectedArchive)}
                        className="text-sm text-primary hover:underline"
                      >
                        자세히 보기 →
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedArchive(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">현재 위치 확인 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
