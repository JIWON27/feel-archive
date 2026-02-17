'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmotionType, EmotionLabels } from '@/types/archive';
import { useCreateTimeCapsule } from '@/hooks/use-timecapsule';
import { ImageUploader } from '@/components/archive/ImageUploader';

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

// 로컬 시간 기준으로 datetime-local input 형식(YYYY-MM-DDTHH:mm) 반환
function toLocalDateTimeString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// 기본값: 1시간 후 (로컬 시간)
function getDefaultOpenAt() {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  d.setMinutes(0, 0, 0);
  return toLocalDateTimeString(d);
}

export default function NewTimeCapsulePage() {
  const router = useRouter();
  const { mutate: createCapsule, isPending } = useCreateTimeCapsule();

  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [content, setContent] = useState('');
  const [openAt, setOpenAt] = useState(getDefaultOpenAt());
  const [images, setImages] = useState<File[]>([]);

  // 최소값: 현재 로컬 시간 (백엔드는 @Future만 체크)
  const minOpenAt = toLocalDateTimeString(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotion) return;

    // datetime-local 입력값은 "YYYY-MM-DDTHH:mm" 형식
    // 백엔드 LocalDateTime은 "YYYY-MM-DDTHH:mm:ss" 형식 기대 (타임존 없음, 로컬 시간 그대로)
    const openAtFormatted = openAt.length === 16 ? `${openAt}:00` : openAt;

    createCapsule({
      data: { emotion, content, openAt: openAtFormatted },
      images,
    });
  };

  const isValid = emotion !== null && content.trim().length > 0 && openAt > minOpenAt;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/my/timecapsules" className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">타임캡슐 작성</h1>
            <p className="text-sm text-gray-500 mt-0.5">미래의 나에게 보내는 메시지</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 감정 선택 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              지금 나의 감정은? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(EmotionType).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmotion(e)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    emotion === e
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{EMOTION_EMOJIS[e]}</span>
                  <span className="text-xs font-medium text-gray-700">{EmotionLabels[e]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 내용 작성 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              미래의 나에게 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="지금의 감정, 생각, 하고 싶은 말을 적어보세요. 미래의 내가 읽게 될 거예요..."
              className="w-full h-48 p-3 text-sm text-gray-800 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
              maxLength={5000}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">{content.length} / 5000</span>
            </div>
          </div>

          {/* 공개 날짜 선택 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              열릴 날짜와 시간 <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              이 시간이 지나면 타임캡슐을 열어볼 수 있습니다
            </p>
            <input
              type="datetime-local"
              value={openAt}
              min={minOpenAt}
              onChange={(e) => setOpenAt(e.target.value)}
              className="w-full p-3 text-sm text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 이미지 첨부 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={5}
              maxSizePerFile={5}
              maxTotalSize={20}
            />
          </div>

          {/* 안내 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <div className="text-xs text-amber-800 space-y-1">
                <p className="font-semibold">작성 전에 꼭 확인하세요!</p>
                <p>• 타임캡슐은 작성 후 <strong>30분 이내</strong>에만 수정할 수 있습니다.</p>
                <p>• 30분이 지나면 내용을 변경하거나 삭제할 수 없습니다.</p>
                <p>• 설정한 날짜/시간이 되면 자동으로 알림이 발송됩니다.</p>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>작성 중...</span>
              </>
            ) : (
              <>
                <span>🎁</span>
                <span>타임캡슐 봉인하기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
