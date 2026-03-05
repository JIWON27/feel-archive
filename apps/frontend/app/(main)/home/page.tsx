'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNearbyArchives } from '@/hooks/use-archives';
import { ArchiveListItem } from '@/components/archive/ArchiveListItem';
import { KakaoMap } from '@/components/map/KakaoMap';
import { Button } from '@/components/ui/Button';
import { ArchiveSummary, NearbyArchiveRequest } from '@/types/archive';
import { useEmotions } from '@/hooks/use-emotions';

export default function Home() {
  const router = useRouter();
  const { getLabel } = useEmotions();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [targetCenter, setTargetCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveSummary | null>(
    null
  );
  const [nearbyRequest, setNearbyRequest] = useState<NearbyArchiveRequest | null>(
    null
  );

  // 주변 아카이브 조회 (위치 기반)
  const {
    data: nearbyArchives,
    isLoading,
    error,
  } = useNearbyArchives(nearbyRequest);

  const allArchives = nearbyArchives ?? [];

  // 현재 위치 가져오기 및 주변 아카이브 조회 요청 설정
  useEffect(() => {
    // 기본 위치 설정 함수 (서울 용산 ITX역)
    const setDefaultLocation = () => {
      const defaultLocation = { lat: 37.5292, lng: 126.9642 };
      setCurrentLocation(defaultLocation);
      setNearbyRequest({
        latitude: 37.5292,
        longitude: 126.9642,
        radius: 50.0,
      });
    };

    if (!navigator.geolocation) {
      setDefaultLocation();
      return;
    }

    // 위치 가져오기 시도
    const timeoutId = setTimeout(() => {
      setDefaultLocation();
    }, 5000); // 5초 후 강제 폴백

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);
        setNearbyRequest({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 50.0,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        setDefaultLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000, // 1분 내 캐시 허용
      }
    );
  }, []);

  const handleArchiveClick = (archive: ArchiveSummary) => {
    setSelectedArchive(archive);

    // GIS 정보가 있으면 지도를 해당 위치로 이동
    if (archive.latitude && archive.longitude) {
      setTargetCenter({
        lat: archive.latitude,
        lng: archive.longitude,
      });
    }
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
    <div className="flex h-full overflow-hidden">
      {/* 왼쪽 사이드바 - 아카이브 리스트 */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col border-r border-gray-200 bg-white">
        {/* 사이드바 헤더 */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          {/* 현재 위치 표시 */}
          {currentLocation && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <svg
                className="w-3.5 h-3.5 text-primary"
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
                <div className="text-6xl mb-4">📍</div>
                <p className="text-gray-700 font-medium mb-1">
                  주변 아카이브가 없습니다
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  반경 50km 내에 기록된 아카이브가 없어요
                </p>
                <Link href="/archives/new">
                  <Button>이 장소에 첫 기록 남기기</Button>
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
      <div className="hidden md:block flex-1 relative">
        {currentLocation ? (
          <>
            <KakaoMap
              archives={allArchives}
              center={currentLocation}
              targetCenter={targetCenter}
              onArchiveClick={handleMapArchiveClick}
              selectedArchiveId={selectedArchive?.archiveId}
              userLocation={currentLocation}
            />

            {/* 선택된 아카이브 미리보기 */}
            {selectedArchive && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-xl p-4 z-10">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {getLabel(selectedArchive.emotion)}
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
