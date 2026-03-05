'use client';

import React from 'react';
import Link from 'next/link';
import { ArchiveSummary } from '@/types/archive';
import { useEmotions } from '@/hooks/use-emotions';
import { useLikeArchive, useScrapArchive } from '@/hooks/use-archives';
import { EMOTION_EMOJI, EMOTION_TAG_STYLE, EMOTION_AVATAR_GRADIENT } from '@/types/emotion';

interface ArchiveCardProps {
  archive: ArchiveSummary;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ archive }) => {
  const { getLabel } = useEmotions();
  const likeArchive = useLikeArchive();
  const scrapArchive = useScrapArchive();

  const tagStyle = EMOTION_TAG_STYLE[archive.emotion] ?? { bg: '#F3F4F6', text: '#6B7280' };
  const avatarGradient = EMOTION_AVATAR_GRADIENT[archive.emotion] ?? 'linear-gradient(135deg, #E5E7EB, #D1D5DB)';
  const emoji = EMOTION_EMOJI[archive.emotion] ?? '📍';

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    likeArchive.mutate({ id: archive.archiveId, isLiked: archive.isLiked || false });
  };

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    scrapArchive.mutate({ id: archive.archiveId, isScraped: archive.isScraped || false });
  };

  return (
    <Link href={`/archives/${archive.archiveId}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col h-full">

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
        <div className="px-4 py-4 flex flex-col flex-1">
          <span
            className="inline-block text-xs font-bold px-2 py-1 rounded-md mb-3 self-start"
            style={{ background: tagStyle.bg, color: tagStyle.text }}
          >
            {emoji} {getLabel(archive.emotion)}
          </span>

          <p className="text-sm text-gray-700 line-clamp-3 flex-1 mb-3">
            {archive.contentPreview}
          </p>

          {archive.address && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3 truncate">
              <span>📍</span>
              <span className="truncate">{archive.address}</span>
            </div>
          )}

          {/* 좋아요 / 스크랩 */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
            <button
              onClick={handleLike}
              disabled={likeArchive.isPending}
              className={`flex items-center gap-1 text-sm transition-colors ${
                archive.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={archive.isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{archive.likeCount}</span>
            </button>

            <button
              onClick={handleScrap}
              disabled={scrapArchive.isPending}
              className={`flex items-center gap-1 text-sm transition-colors ${
                archive.isScraped ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={archive.isScraped ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
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
