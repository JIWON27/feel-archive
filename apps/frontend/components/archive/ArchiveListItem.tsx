'use client';

import React from 'react';
import { ArchiveSummary } from '@/types/archive';
import { useEmotions } from '@/hooks/use-emotions';
import { EMOTION_EMOJI, EMOTION_TAG_STYLE, EMOTION_AVATAR_GRADIENT } from '@/types/emotion';

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
  const tagStyle = EMOTION_TAG_STYLE[archive.emotion] ?? { bg: '#F3F4F6', text: '#6B7280' };
  const avatarGradient = EMOTION_AVATAR_GRADIENT[archive.emotion] ?? 'linear-gradient(135deg, #E5E7EB, #D1D5DB)';
  const emoji = EMOTION_EMOJI[archive.emotion] ?? '📍';

  return (
    <div
      onClick={onClick}
      className={`mx-3 my-2 rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden
        ${isSelected
          ? 'border-primary shadow-md -translate-y-0.5'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }
        bg-white
      `}
    >
      {/* 헤더 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
            style={{ background: avatarGradient }}
          >
            {emoji}
          </div>
          <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
            {archive.writer.nickname}
          </span>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
          {formatTime(archive.createdAt)}
        </span>
      </div>

      {/* 바디 */}
      <div className="px-4 py-3">
        <span
          className="inline-block text-xs font-bold px-2 py-1 rounded-md mb-2"
          style={{ background: tagStyle.bg, color: tagStyle.text }}
        >
          {emoji} {getLabel(archive.emotion)}
        </span>

        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
          {archive.contentPreview}
        </p>

        <div className="flex items-center justify-between">
          {archive.address ? (
            <div className="flex items-center gap-1 text-xs text-gray-400 truncate">
              <span>📍</span>
              <span className="truncate">{archive.address}</span>
            </div>
          ) : (
            <div />
          )}

          {archive.likeCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 ml-2">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{archive.likeCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
