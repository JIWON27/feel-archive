'use client';

import React from 'react';
import Link from 'next/link';
import { useTimeCapsuleList } from '@/hooks/use-timecapsule';
import { CapsuleStatus, TimeCapsuleSummary } from '@/types/timecapsule';
import { EmotionLabels } from '@/types/archive';
import { EmotionType } from '@/types/archive';

const EMOTION_EMOJIS: Record<EmotionType, string> = {
  [EmotionType.HAPPY]: '😊',
  [EmotionType.SAD]: '😢',
  [EmotionType.ANXIOUS]: '😰',
  [EmotionType.ANGRY]: '😤',
  [EmotionType.CALM]: '😌',
  [EmotionType.EXCITED]: '🤩',
  [EmotionType.LONELY]: '🥺',
  [EmotionType.GRATEFUL]: '🙏',
  [EmotionType.TIRED]: '😩',
};

// 백엔드에서 "yyyy.MM.dd HH:mm" 형식으로 오므로 파싱 처리
function parseDotDate(dateStr: string): Date {
  const normalized = dateStr.replace(/\./g, '-').replace(' ', 'T');
  return new Date(normalized);
}

function TimeCapsuleListItem({ capsule }: { capsule: TimeCapsuleSummary }) {
  const isLocked = capsule.status === CapsuleStatus.LOCKED;
  const openDate = parseDotDate(capsule.openAt);
  const now = new Date();

  // 남은 시간 계산
  const diffMs = openDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffHours = Math.floor((diffMs % 86400000) / 3600000);

  const remainingText = () => {
    if (!isLocked) return null;
    if (diffDays > 0) return `${diffDays}일 ${diffHours}시간 후 공개`;
    if (diffHours > 0) return `${diffHours}시간 후 공개`;
    return '곧 공개됩니다';
  };

  const formatDate = (dateStr: string) => {
    return parseDotDate(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/timecapsule/${capsule.id}`}>
      <div
        className={`bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
          isLocked
            ? 'border-gray-100'
            : 'border-primary/30 ring-1 ring-primary/20'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* 감정 아이콘 */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              isLocked ? 'bg-gray-100' : 'bg-primary/10'
            }`}
          >
            {isLocked ? '🔒' : EMOTION_EMOJIS[capsule.emotion]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isLocked
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {isLocked ? '잠금' : '열림 🎉'}
              </span>
              {!isLocked && (
                <span className="text-xs text-gray-500">
                  {EmotionLabels[capsule.emotion]}
                </span>
              )}
            </div>

            {/* 내용 미리보기 */}
            <p className={`text-sm mb-2 ${isLocked ? 'text-gray-400 italic' : 'text-gray-700'}`}>
              {isLocked ? '봉인된 타임캡슐입니다...' : capsule.contentPreview}
            </p>

            {/* 날짜 정보 */}
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">
                공개 예정: {formatDate(capsule.openAt)}
              </p>
              {isLocked && remainingText() && (
                <p className="text-xs font-medium text-amber-600">
                  ⏰ {remainingText()}
                </p>
              )}
              {!isLocked && (
                <p className="text-xs text-primary font-medium">
                  탭하여 확인하기 →
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MyTimeCapsulePage() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTimeCapsuleList();

  const allCapsules = data?.pages.flatMap((page) => page.content) || [];
  const lockedCapsules = allCapsules.filter((c) => c.status === CapsuleStatus.LOCKED);
  const openedCapsules = allCapsules.filter((c) => c.status === CapsuleStatus.OPENED);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">내 타임캡슐</h1>
            <p className="text-sm text-gray-500 mt-0.5">미래의 나에게 보낸 메시지들</p>
          </div>
          <Link
            href="/timecapsule/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <span>🎁</span>
            <span>새로 작성</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">타임캡슐 불러오는 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">타임캡슐을 불러오지 못했습니다.</p>
          </div>
        ) : allCapsules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🎁</span>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              아직 타임캡슐이 없어요
            </p>
            <p className="text-sm text-gray-500 mb-6">
              지금의 감정을 담아 미래의 나에게 메시지를 보내보세요!
            </p>
            <Link
              href="/timecapsule/new"
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              첫 타임캡슐 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 열린 타임캡슐 */}
            {openedCapsules.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                  열린 타임캡슐 🎉 ({openedCapsules.length})
                </h2>
                <div className="space-y-3">
                  {openedCapsules.map((capsule) => (
                    <TimeCapsuleListItem key={capsule.id} capsule={capsule} />
                  ))}
                </div>
              </section>
            )}

            {/* 잠긴 타임캡슐 */}
            {lockedCapsules.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                  봉인된 타임캡슐 🔒 ({lockedCapsules.length})
                </h2>
                <div className="space-y-3">
                  {lockedCapsules.map((capsule) => (
                    <TimeCapsuleListItem key={capsule.id} capsule={capsule} />
                  ))}
                </div>
              </section>
            )}

            {/* 더 불러오기 */}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-3 text-sm text-primary hover:bg-primary/5 rounded-xl transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
