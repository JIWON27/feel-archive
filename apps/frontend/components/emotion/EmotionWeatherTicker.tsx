'use client';

import { useState, useEffect } from 'react';
import { useEmotionWeather } from '@/hooks/use-emotion-weather';

const EMOTION_META: Record<string, { label: string; emoji: string }> = {
  HAPPY:    { label: '행복한', emoji: '😊' },
  SAD:      { label: '슬픈',   emoji: '😢' },
  ANXIOUS:  { label: '불안한', emoji: '😰' },
  ANGRY:    { label: '화난',   emoji: '😤' },
  CALM:     { label: '차분한', emoji: '😌' },
  EXCITED:  { label: '신난',   emoji: '🎉' },
  LONELY:   { label: '외로운', emoji: '😔' },
  GRATEFUL: { label: '감사한', emoji: '🙏' },
  TIRED:    { label: '지친',   emoji: '😴' },
};

// 금·은·동 메달 스타일 (CSS only)
const MEDAL_STYLES = [
  { bg: '#F59E0B', shadow: '#B45309' }, // 금 (amber-400)
  { bg: '#9CA3AF', shadow: '#6B7280' }, // 은 (gray-400)
  { bg: '#B45309', shadow: '#78350F' }, // 동 (amber-700)
];

const SLIDE_STYLE = `
  @keyframes slideUp {
    0%   { transform: translateY(110%); opacity: 0; }
    12%  { transform: translateY(0);    opacity: 1; }
    88%  { transform: translateY(0);    opacity: 1; }
    100% { transform: translateY(-110%); opacity: 0; }
  }
  .emotion-ticker-slide {
    animation: slideUp 3s ease-in-out forwards;
  }
`;

export function EmotionWeatherTicker() {
  const { data: rankings } = useEmotionWeather();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const hasData = rankings && rankings.length > 0;

  useEffect(() => {
    if (!hasData) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rankings.length);
      setAnimKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasData, rankings?.length]);

  if (!hasData) return null;

  const current = rankings[currentIndex];
  const meta = EMOTION_META[current.emotion] ?? { label: current.emotion, emoji: '❓' };
  const medal = MEDAL_STYLES[currentIndex];

  return (
    <>
      <style>{SLIDE_STYLE}</style>
      <div className="hidden md:flex items-center gap-2">
        <span className="text-base leading-none">🌤</span>
        <span className="text-sm text-gray-500 font-medium">감정 날씨</span>
        <span className="text-gray-300 text-sm">·</span>
        {/* 슬라이드업 영역 */}
        <div className="relative h-6 overflow-hidden min-w-[100px]">
          <div
            key={animKey}
            className="emotion-ticker-slide absolute inset-0 flex items-center gap-1.5 whitespace-nowrap"
          >
            {/* CSS 원형 메달 */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: medal.bg,
                boxShadow: `0 2px 0 ${medal.shadow}`,
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {currentIndex + 1}
            </span>
            <span className="text-sm">{meta.emoji}</span>
            <span className="text-sm font-semibold text-gray-700">{meta.label}</span>
          </div>
        </div>
      </div>
    </>
  );
}
