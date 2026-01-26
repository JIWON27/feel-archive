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
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Kakao Maps 초기화
  useEffect(() => {
    if (!mapRef.current || map) return;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(
            value?.latitude || 37.5665,
            value?.longitude || 126.978
          ),
          level: 3,
        };

        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);

        // 기존 위치가 있으면 마커 표시
        if (value) {
          const position = new window.kakao.maps.LatLng(
            value.latitude,
            value.longitude
          );
          const kakaoMarker = new window.kakao.maps.Marker({
            position,
            map: kakaoMap,
          });
          setMarker(kakaoMarker);
        }

        // 지도 클릭 이벤트
        window.kakao.maps.event.addListener(
          kakaoMap,
          'click',
          (mouseEvent: any) => {
            const latlng = mouseEvent.latLng;
            handleLocationSelect(latlng.getLat(), latlng.getLng());
          }
        );
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // 위치 선택 처리
  const handleLocationSelect = async (lat: number, lng: number) => {
    if (!map) return;

    // 마커 이동
    const position = new window.kakao.maps.LatLng(lat, lng);

    if (marker) {
      marker.setPosition(position);
    } else {
      const newMarker = new window.kakao.maps.Marker({
        position,
        map,
      });
      setMarker(newMarker);
    }

    // 지도 중심 이동
    map.setCenter(position);

    // 주소 검색 (역지오코딩)
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      let locationLabel = '';
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const address = result[0].address;
        locationLabel = address.address_name;
      }

      onChange({
        latitude: lat,
        longitude: lng,
        locationLabel,
      });
    });
  };

  // 현재 위치 가져오기
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSelect(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('위치 가져오기 실패:', error);
        alert('위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        위치 선택 (필수)
      </label>

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
        ref={mapRef}
        className={`w-full h-[400px] rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />

      {value && (
        <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
          <p className="text-gray-700">
            <span className="font-medium">선택된 위치:</span>{' '}
            {value.locationLabel || `${value.latitude}, ${value.longitude}`}
          </p>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <p className="mt-2 text-xs text-gray-500">
        지도를 클릭하여 위치를 선택하거나, 현재 위치 버튼을 눌러주세요
      </p>
    </div>
  );
};
