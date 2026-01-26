'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useArchiveDetail,
  useDeleteArchive,
  useLikeArchive,
  useScrapArchive,
} from '@/hooks/use-archives';
import { Button } from '@/components/ui/Button';
import { EmotionLabels } from '@/types/archive';

export default function ArchiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: archive, isLoading, error } = useArchiveDetail(id);
  const deleteArchive = useDeleteArchive();
  const likeArchive = useLikeArchive();
  const scrapArchive = useScrapArchive();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLike = () => {
    if (!archive) return;
    likeArchive.mutate({
      id: archive.archiveId,
      isLiked: archive.isLiked || false,
    });
  };

  const handleScrap = () => {
    if (!archive) return;
    scrapArchive.mutate({
      id: archive.archiveId,
      isScraped: archive.isScraped || false,
    });
  };

  const handleDelete = () => {
    deleteArchive.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !archive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">아카이브를 불러오지 못했습니다</p>
          <Button onClick={() => router.push('/archives')}>목록으로</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로
          </button>

          {archive.isOwner && (
            <div className="flex gap-2">
              <Link href={`/archives/${id}/edit`}>
                <Button variant="secondary">수정</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(true)}
              >
                삭제
              </Button>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow p-8">
          {/* 감정 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {EmotionLabels[archive.emotion]}
            </span>
          </div>

          {/* 내용 */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {archive.content}
            </p>
          </div>

          {/* 이미지 */}
          {archive.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {archive.images.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="아카이브 이미지"
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          )}

          {/* 위치 정보 */}
          {archive.location && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-gray-600 mt-0.5"
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
                <div>
                  <p className="text-gray-800 font-medium">
                    {archive.location.address || '위치 정보'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {archive.location.latitude.toFixed(6)},{' '}
                    {archive.location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {archive.writer.nickname}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(archive.createdAt).toLocaleString('ko-KR')}
              </span>
              {archive.visibility === 'PRIVATE' && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  비공개
                </span>
              )}
            </div>

            {/* 좋아요/스크랩 */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={likeArchive.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  archive.isLiked
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
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
                <span className="font-medium">{archive.likeCount}</span>
              </button>

              <button
                onClick={handleScrap}
                disabled={scrapArchive.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  archive.isScraped
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
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
                <span className="font-medium">스크랩</span>
              </button>
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold mb-2">아카이브 삭제</h3>
              <p className="text-gray-600 mb-6">
                정말 이 아카이브를 삭제하시겠습니까? 이 작업은 되돌릴 수
                없습니다.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleDelete}
                  isLoading={deleteArchive.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
