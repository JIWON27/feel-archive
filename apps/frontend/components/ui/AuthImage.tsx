'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';

interface AuthImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * JWT 인증이 필요한 이미지 엔드포인트를 위한 이미지 컴포넌트.
 * apiClient를 통해 이미지를 fetch(JWT 헤더 자동 포함)한 뒤 Blob URL로 표시합니다.
 */
export function AuthImage({ src, alt, className }: AuthImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    let objectUrl: string | null = null;

    apiClient
      .get(src, { responseType: 'blob' })
      .then((response) => {
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        setError(true);
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}>
        이미지 없음
      </div>
    );
  }

  if (!blobUrl) {
    return <div className={`bg-gray-100 animate-pulse ${className}`} />;
  }

  return <img src={blobUrl} alt={alt} className={className} />;
}
