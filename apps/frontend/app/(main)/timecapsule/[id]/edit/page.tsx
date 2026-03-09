'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmotionType } from '@/types/archive';
import { CapsuleStatus } from '@/types/timecapsule';
import { useTimeCapsuleDetail, useUpdateTimeCapsule } from '@/hooks/use-timecapsule';
import { useEmotions } from '@/hooks/use-emotions';
import { EMOTION_EMOJI } from '@/types/emotion';

function toLocalDateTimeString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseDotDate(dateStr: string): Date {
  const normalized = dateStr.replace(/\./g, '-').replace(' ', 'T');
  return new Date(normalized);
}

export default function TimeCapsuleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: capsule, isLoading, error } = useTimeCapsuleDetail(id);
  const { mutate: updateCapsule, isPending } = useUpdateTimeCapsule(id);
  const { emotions } = useEmotions();

  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [content, setContent] = useState('');
  const [openAt, setOpenAt] = useState('');

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (!capsule) return;
    setEmotion(capsule.emotion as EmotionType);
    setContent(capsule.content ?? '');
    setOpenAt(toLocalDateTimeString(parseDotDate(capsule.openAt)));
  }, [capsule]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">타임캡슐을 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 수정 불가 상태 처리 (OPENED이거나 30분 초과)
  const isEditable = (() => {
    if (capsule.status === CapsuleStatus.OPENED) return false;
    const createdAt = parseDotDate(capsule.createdAt);
    return Date.now() - createdAt.getTime() < 30 * 60 * 1000;
  })();

  if (!isEditable) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-3">수정 가능한 시간이 지났습니다.</p>
          <Link href={`/timecapsule/${id}`} className="text-primary hover:underline text-sm">
            상세 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const minOpenAt = toLocalDateTimeString(new Date());
  const isValid = emotion !== null && content.trim().length > 0 && openAt > minOpenAt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotion) return;
    const openAtFormatted = `${openAt.length === 16 ? `${openAt}:00` : openAt}+09:00`;
    updateCapsule({ emotion, content, openAt: openAtFormatted });
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/timecapsule/${id}`} className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">타임캡슐 수정</h1>
            <p className="text-sm text-gray-500 mt-0.5">작성 후 30분 이내에만 수정할 수 있어요</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 감정 선택 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              감정 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {emotions.map(({ name, label }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEmotion(name as EmotionType)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    emotion === name
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{EMOTION_EMOJI[name]}</span>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 p-3 text-sm text-gray-800 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={5000}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">{content.length} / 5000</span>
            </div>
          </div>

          {/* 공개 날짜 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              열릴 날짜와 시간 <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">미래 시간으로만 설정할 수 있습니다</p>
            <input
              type="datetime-local"
              value={openAt}
              min={minOpenAt}
              onChange={(e) => setOpenAt(e.target.value)}
              className="w-full p-3 text-sm text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>수정 중...</span>
              </>
            ) : (
              '수정 완료'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
