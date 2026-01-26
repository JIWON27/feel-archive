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
  onArchiveClick?: (archive: ArchiveSummary) => void;
  selectedArchiveId?: number;
}

export const KakaoMap: React.FC<KakaoMapProps> = ({
  archives,
  center,
  onArchiveClick,
  selectedArchiveId,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
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
            center?.lat || 37.5665,
            center?.lng || 126.978
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
                center?.lat || 37.5665,
                center?.lng || 126.978
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

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = mapRef.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(
              center?.lat || 37.5665,
              center?.lng || 126.978
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
      setScriptError('Kakao Maps 스크립트 로드 실패');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  // 중심 위치 변경
  useEffect(() => {
    if (!map || !center) return;
    const position = new window.kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(position);
  }, [map, center]);

  // 마커 업데이트
  useEffect(() => {
    if (!map || !archives) return;

    // 기존 마커 제거
    markers.forEach((marker) => {
      marker.overlay.setMap(null);
    });

    // 새 마커 생성
    const newMarkers = archives
      .filter((archive) => archive.address) // 위치 정보가 있는 것만
      .map((archive) => {
        // 임시로 랜덤 위치 생성 (실제로는 archive.location 사용)
        const lat = 37.5665 + (Math.random() - 0.5) * 0.1;
        const lng = 126.978 + (Math.random() - 0.5) * 0.1;

        const position = new window.kakao.maps.LatLng(lat, lng);

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
