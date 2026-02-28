'use client';

import React from 'react';
import { ArchiveSummary } from '@/types/archive';
import { useEmotions } from '@/hooks/use-emotions';
import { EMOTION_EMOJI } from '@/types/emotion';

interface ArchiveListItemProps {
  archive: ArchiveSummary;
  isSelected?: boolean;
  onClick: () => void;
}

export const ArchiveListItem: React.FC<ArchiveListItemProps> = ({
  archive,
  isSelected = false,
  onClick,
}) => {
  const { getLabel } = useEmotions();
  return (
    <div
      onClick={onClick}
      className={`
        p-4 border-b border-gray-200 cursor-pointer transition-colors
        hover:bg-gray-50
        ${isSelected ? 'bg-gray-100' : 'bg-white'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
            {EMOTION_EMOJI[archive.emotion] ?? '📍'}
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-900 truncate">
              {archive.writer.nickname}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(archive.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {getLabel(archive.emotion)}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-1">
            {archive.contentPreview}
          </p>

          {archive.address && (
            <div className="flex items-center gap-1 mt-1">
              <svg
                className="w-3 h-3 text-gray-400"
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
              <span className="text-xs text-gray-500 truncate">
                {archive.address}
              </span>
            </div>
          )}
        </div>

        {/* 좋아요 카운트 */}
        {archive.likeCount > 0 && (
          <div className="flex-shrink-0 flex items-center gap-1 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">{archive.likeCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 시간 포맷팅
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

