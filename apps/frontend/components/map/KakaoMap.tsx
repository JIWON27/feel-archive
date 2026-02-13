'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArchiveSummary, EmotionLabels } from '@/types/archive';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  archives: ArchiveSummary[];
  center?: { lat: number; lng: number };
  targetCenter?: { lat: number; lng: number } | null; // 특정 아카이브로 이동
  onArchiveClick?: (archive: ArchiveSummary) => void;
  selectedArchiveId?: number;
  userLocation?: { lat: number; lng: number } | null; // 현재 위치
}

export const KakaoMap: React.FC<KakaoMapProps> = ({
  archives,
  center,
  targetCenter,
  onArchiveClick,
  selectedArchiveId,
  userLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState<string | null>(null);

  // Kakao Maps 초기화
  useEffect(() => {
    if (!mapRef.current || map) return;

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(
            center?.lat || 37.5292,
            center?.lng || 126.9642
          ),
          level: 5,
        };

        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
        setIsLoading(false);
      });
      return;
    }

    // 스크립트가 이미 추가되어 있는지 확인
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = mapRef.current;
            if (!container) return;

            const options = {
              center: new window.kakao.maps.LatLng(
                center?.lat || 37.5292,
                center?.lng || 126.9642
              ),
              level: 5,
            };

            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);
            setIsLoading(false);
          });
        }
      });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

    if (!apiKey) {
      setScriptError('Kakao Maps API 키가 없습니다. .env.local 파일을 확인하세요.');
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = mapRef.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(
              center?.lat || 37.5292,
              center?.lng || 126.9642
            ),
            level: 5,
          };

          const kakaoMap = new window.kakao.maps.Map(container, options);
          setMap(kakaoMap);
          setIsLoading(false);
        });
      } else {
        setScriptError('Kakao Maps API 로드 실패');
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setScriptError('Kakao Maps 스크립트 로드 실패. 네트워크 연결을 확인하세요.');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  // 중심 위치 변경 (targetCenter가 있으면 우선)
  useEffect(() => {
    if (!map) return;
    const centerToUse = targetCenter || center;
    if (!centerToUse) return;

    const position = new window.kakao.maps.LatLng(centerToUse.lat, centerToUse.lng);
    map.panTo(position); // setCenter 대신 panTo로 부드럽게 이동
  }, [map, center, targetCenter]);

  // 현재 위치 마커 업데이트
  useEffect(() => {
    if (!map || !userLocation) return;

    // 기존 사용자 마커 제거
    if (userMarker) {
      userMarker.overlay.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(
      userLocation.lat,
      userLocation.lng
    );

    // 현재 위치 마커 DOM 생성
    const userMarkerDiv = document.createElement('div');
    userMarkerDiv.style.cssText = `
      position: relative;
      width: 20px;
      height: 20px;
    `;

    // 외곽 반투명 원 (정확도 표시)
    const outerCircle = document.createElement('div');
    outerCircle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(66, 133, 244, 0.2);
      border: 2px solid rgba(66, 133, 244, 0.5);
    `;

    // 중앙 파란색 점
    const innerCircle = document.createElement('div');
    innerCircle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #4285F4;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 1;
    `;

    userMarkerDiv.appendChild(outerCircle);
    userMarkerDiv.appendChild(innerCircle);

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position,
      content: userMarkerDiv,
      yAnchor: 0.5,
      zIndex: 100, // 다른 마커보다 위에 표시
    });

    customOverlay.setMap(map);

    setUserMarker({
      overlay: customOverlay,
      element: userMarkerDiv,
    });

    return () => {
      customOverlay.setMap(null);
    };
  }, [map, userLocation]);

  // 아카이브 마커 업데이트
  useEffect(() => {
    if (!map || !archives) return;

    // 기존 마커 제거
    markers.forEach((marker) => {
      marker.overlay.setMap(null);
    });

    // 새 마커 생성
    const newMarkers = archives
      .filter((archive) => archive.latitude && archive.longitude) // GIS 정보가 있는 것만
      .map((archive) => {
        const position = new window.kakao.maps.LatLng(
          archive.latitude!,
          archive.longitude!
        );

        // 감정에 따른 마커 색상
        const emotionColor = getEmotionColor(archive.emotion);

        // DOM 요소로 마커 생성
        const markerDiv = document.createElement('div');
        markerDiv.style.cssText = `
          background-color: ${emotionColor};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          ${selectedArchiveId === archive.archiveId ? 'transform: scale(1.2);' : ''}
        `;

        const emojiSpan = document.createElement('span');
        emojiSpan.style.cssText = 'color: white; font-size: 20px;';
        emojiSpan.textContent = getEmotionEmoji(archive.emotion);
        markerDiv.appendChild(emojiSpan);

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position,
          content: markerDiv,
          yAnchor: 1,
        });

        customOverlay.setMap(map);

        // 클릭 이벤트
        markerDiv.addEventListener('click', () => {
          if (onArchiveClick) {
            onArchiveClick(archive);
          }
        });

        return {
          overlay: customOverlay,
          element: markerDiv,
        };
      });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => {
        marker.overlay.setMap(null);
      });
    };
  }, [map, archives, selectedArchiveId, onArchiveClick]);

  if (scriptError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-2">{scriptError}</p>
          <p className="text-sm text-gray-600">
            Kakao Maps API 키를 확인해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">지도 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 감정에 따른 색상 매핑
function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    HAPPY: '#FFD700',
    SAD: '#4169E1',
    ANXIOUS: '#9370DB',
    ANGRY: '#DC143C',
    CALM: '#32CD32',
    EXCITED: '#FF69B4',
    LONELY: '#708090',
    GRATEFUL: '#FF8C00',
  };
  return colors[emotion] || '#D19D5E';
}

// 감정에 따른 이모지
function getEmotionEmoji(emotion: string): string {
  const emojis: Record<string, string> = {
    HAPPY: '😊',
    SAD: '😢',
    ANXIOUS: '😰',
    ANGRY: '😠',
    CALM: '😌',
    EXCITED: '🤩',
    LONELY: '😔',
    GRATEFUL: '🙏',
  };
  return emojis[emotion] || '📍';
}
