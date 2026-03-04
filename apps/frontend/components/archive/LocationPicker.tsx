'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationPickerProps {
  value?: {
    latitude: number;
    longitude: number;
    locationLabel?: string;
  };
  onChange: (location: {
    latitude: number;
    longitude: number;
    locationLabel?: string;
  }) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // state 대신 ref 사용 → 클릭 이벤트 클로저에서 항상 최신 값 참조 가능
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [geocodedLabel, setGeocodedLabel] = useState<string>(value?.locationLabel || '');
  const [customLabel, setCustomLabel] = useState<string>('');

  const selectLocation = (lat: number, lng: number) => {
    const kakaoMap = mapInstanceRef.current;
    if (!kakaoMap) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new window.kakao.maps.Marker({
        position,
        map: kakaoMap,
      });
    }

    kakaoMap.setCenter(position);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      let label = '';
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        label = result[0].address.address_name;
      }

      setGeocodedLabel(label);
      setCustomLabel('');

      onChange({
        latitude: lat,
        longitude: lng,
        locationLabel: label,
      });
    });
  };

  // Kakao Maps 초기화
  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // 이미 초기화된 경우 스킵

      window.kakao.maps.load(() => {
        const container = mapContainerRef.current;
        if (!container) return;

        const kakaoMap = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(
            value?.latitude || 37.5665,
            value?.longitude || 126.978
          ),
          level: 3,
        });

        mapInstanceRef.current = kakaoMap;

        // 기존 위치가 있으면 마커 표시
        if (value) {
          markerRef.current = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(value.latitude, value.longitude),
            map: kakaoMap,
          });
        }

        // 클릭 이벤트 — mapInstanceRef.current를 통해 항상 최신 map 참조
        window.kakao.maps.event.addListener(kakaoMap, 'click', (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          selectLocation(latlng.getLat(), latlng.getLng());
        });
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkKakao);
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        selectLocation(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      () => {
        alert('위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleGetCurrentLocation}
          isLoading={isLoading}
          className="w-auto"
        >
          📍 현재 위치 가져오기
        </Button>
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-[400px] rounded-lg border border-gray-300"
      />

      {value && (
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
            <span className="font-medium">역지오코딩 주소:</span>{' '}
            {geocodedLabel || `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              위치 메모{' '}
              <span className="text-gray-400 font-normal">(선택 · 미입력 시 주소로 저장)</span>
            </label>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => {
                const val = e.target.value;
                setCustomLabel(val);
                onChange({
                  latitude: value.latitude,
                  longitude: value.longitude,
                  locationLabel: val.trim() || geocodedLabel,
                });
              }}
              placeholder={geocodedLabel || '예) 자주 가는 카페, 추억의 장소...'}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        지도를 클릭하여 위치를 선택하거나, 현재 위치 버튼을 눌러주세요
      </p>
    </div>
  );
};
