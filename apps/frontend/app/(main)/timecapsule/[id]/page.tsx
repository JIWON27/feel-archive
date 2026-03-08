'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTimeCapsuleDetail, useDeleteTimeCapsule } from '@/hooks/use-timecapsule';
import { CapsuleStatus } from '@/types/timecapsule';
import { useCountdown } from '@/hooks/use-countdown';
import { AuthImage } from '@/components/ui/AuthImage';
import { useEmotions } from '@/hooks/use-emotions';
import { EMOTION_EMOJI } from '@/types/emotion';

// 백엔드에서 "yyyy.MM.dd HH:mm" 형식으로 오므로 파싱 처리
function parseDotDate(dateStr: string): Date {
  const normalized = dateStr.replace(/\./g, '-').replace(' ', 'T');
  return new Date(normalized);
}

function formatDate(dateStr: string) {
  return parseDotDate(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TimeCapsuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: capsule, isLoading, error } = useTimeCapsuleDetail(id);
  const { mutate: deleteCapsule, isPending: isDeleting } = useDeleteTimeCapsule();
  const { getLabel } = useEmotions();

  // 훅은 early return 전에 항상 호출 (Rules of Hooks)
  const openDate = capsule ? parseDotDate(capsule.openAt) : new Date();
  const { diffDays, diffHours, diffMins, diffSecs, isExpired } = useCountdown(openDate);

  // 수정 가능 여부: 작성 후 30분 이내 && LOCKED 상태
  const canEdit = (() => {
    if (!capsule || capsule.status === CapsuleStatus.OPENED) return false;
    const createdAt = parseDotDate(capsule.createdAt);
    const now = new Date();
    return now.getTime() - createdAt.getTime() < 30 * 60 * 1000;
  })();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-3">타임캡슐을 불러올 수 없습니다.</p>
          <Link href="/my/timecapsules" className="text-primary hover:underline text-sm">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = capsule.status === CapsuleStatus.LOCKED;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/my/timecapsules"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">타임캡슐 목록</span>
          </Link>

          {/* 수정/삭제 버튼 (30분 내 + LOCKED) */}
          {canEdit && (
            <div className="flex items-center gap-2">
              <Link
                href={`/timecapsule/${id}/edit`}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                수정
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-sm px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 잠금 상태 */}
        {isLocked ? (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            {/* 상단 봉인 영상 */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-10 text-center">
              <div className="text-7xl mb-4 animate-pulse">🔒</div>
              <h2 className="text-xl font-bold text-white mb-2">봉인된 타임캡슐</h2>
              <p className="text-gray-300 text-sm">아직 열릴 시간이 되지 않았어요</p>
            </div>

            {/* 카운트다운 */}
            <div className="p-6 text-center border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">열리기까지</p>
              {!isExpired ? (
                <div className="flex items-center justify-center gap-4">
                  {diffDays > 0 && (
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{diffDays}</p>
                      <p className="text-xs text-gray-500">일</p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{String(diffHours).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">시간</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{String(diffMins).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">분</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{String(diffSecs).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">초</p>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-semibold text-primary">곧 열립니다...</p>
              )}
            </div>

            {/* 메타 정보 */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">작성일</span>
                <span className="text-gray-700">{formatDate(capsule.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">공개 예정일</span>
                <span className="font-medium text-primary">{formatDate(capsule.openAt)}</span>
              </div>
            </div>

            {/* 안내 */}
            <div className="px-6 pb-6">
              <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-700 text-center">
                공개 시간이 되면 이메일과 알림으로 알려드릴게요 📬
              </div>
            </div>
          </div>
        ) : (
          /* 열린 상태 */
          <div className="space-y-4">
            {/* 상단 배너 */}
            <div className="bg-gradient-to-r from-primary/20 to-amber-100 rounded-2xl p-5 text-center">
              <div className="text-5xl mb-2">{EMOTION_EMOJI[capsule.emotion]}</div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{formatDate(capsule.createdAt)}</span>에 보낸 메시지
              </p>
              <span className="inline-block mt-2 text-xs px-3 py-1 bg-primary text-white rounded-full font-medium">
                {getLabel(capsule.emotion)}
              </span>
            </div>

            {/* 내용 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-3">✉️ 과거의 내가 보낸 메시지</p>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                {capsule.content}
              </p>
            </div>

            {/* 이미지 */}
            {capsule.images && capsule.images.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-3">📸 첨부 사진</p>
                <div className="grid grid-cols-2 gap-2">
                  {capsule.images.map((img) => (
                    <AuthImage
                      key={img.id}
                      src={img.url}
                      alt="타임캡슐 이미지"
                      className="w-full h-40 object-contain bg-gray-50 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 위치 */}
            {capsule.location?.address && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>{capsule.location.address}</span>
                </div>
              </div>
            )}

            {/* 메타 정보 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">작성일</span>
                  <span className="text-gray-700">{formatDate(capsule.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">열린 날</span>
                  <span className="text-primary font-medium">{formatDate(capsule.openAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">타임캡슐 삭제</h3>
            <p className="text-sm text-gray-600 mb-6">
              타임캡슐을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠어요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  deleteCapsule(id);
                  setShowDeleteModal(false);
                }}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
