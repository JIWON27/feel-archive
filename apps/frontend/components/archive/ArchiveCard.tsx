'use client';

import React from 'react';
import Link from 'next/link';
import { ArchiveSummary, EmotionLabels } from '@/types/archive';
import { useLikeArchive, useScrapArchive } from '@/hooks/use-archives';

interface ArchiveCardProps {
  archive: ArchiveSummary;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ archive }) => {
  const likeArchive = useLikeArchive();
  const scrapArchive = useScrapArchive();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    likeArchive.mutate({
      id: archive.archiveId,
      isLiked: archive.isLiked || false,
    });
  };

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    scrapArchive.mutate({
      id: archive.archiveId,
      isScraped: archive.isScraped || false,
    });
  };

  return (
    <Link href={`/archives/${archive.archiveId}`} className="block h-full">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer flex flex-col h-full">
        {/* 감정 태그 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {EmotionLabels[archive.emotion]}
          </span>
        </div>

        {/* 내용 미리보기 - flex-1로 남은 공간 채움 */}
        <p className="text-gray-800 mb-4 line-clamp-3 flex-1">
          {archive.contentPreview}
        </p>

        {/* 위치 정보 */}
        {archive.address && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg
              className="w-4 h-4 mr-1 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{archive.address}</span>
          </div>
        )}

        {/* 하단 정보 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* 작성자 */}
            <span className="text-sm text-gray-600">
              {archive.writer.nickname}
            </span>

            {/* 작성일 */}
            <span className="text-xs text-gray-400">
              {new Date(archive.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          {/* 좋아요/스크랩 버튼 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={likeArchive.isPending}
              className={`flex items-center gap-1 text-sm ${
                archive.isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 transition-colors`}
            >
              <svg
                className="w-5 h-5"
                fill={archive.isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{archive.likeCount}</span>
            </button>

            <button
              onClick={handleScrap}
              disabled={scrapArchive.isPending}
              className={`flex items-center gap-1 text-sm ${
                archive.isScraped ? 'text-yellow-500' : 'text-gray-500'
              } hover:text-yellow-500 transition-colors`}
            >
              <svg
                className="w-5 h-5"
                fill={archive.isScraped ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
