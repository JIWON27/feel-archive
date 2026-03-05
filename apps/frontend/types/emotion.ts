// 백엔드 GET /api/v1/emotions 응답 타입
export interface EmotionResponse {
  name: string;
  label: string;
  sortOrder: number;
}

// 감정 한국어 라벨 (백엔드 Emotion enum 기준)
export const EMOTION_LABEL: Record<string, string> = {
  HAPPY:    '행복한',
  SAD:      '슬픈',
  ANXIOUS:  '불안한',
  ANGRY:    '화난',
  CALM:     '차분한',
  EXCITED:  '신난',
  LONELY:   '외로운',
  GRATEFUL: '감사한',
  TIRED:    '지친',
};

// 감정 이모지 매핑 (프론트엔드 전용 - 중앙 관리)
export const EMOTION_EMOJI: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😢',
  ANXIOUS: '😰',
  ANGRY: '😠',
  CALM: '😌',
  EXCITED: '🤩',
  LONELY: '😔',
  GRATEFUL: '🙏',
  TIRED: '😴',
};

// 감정 태그 색상 매핑 - 카드 태그용 (bg + text)
export const EMOTION_TAG_STYLE: Record<string, { bg: string; text: string }> = {
  HAPPY:    { bg: '#FFF8E1', text: '#B45309' },
  SAD:      { bg: '#F0F9FF', text: '#0369A1' },
  ANXIOUS:  { bg: '#F5F3FF', text: '#6D28D9' },
  ANGRY:    { bg: '#FFF1F2', text: '#BE123C' },
  CALM:     { bg: '#E3FDF3', text: '#047857' },
  EXCITED:  { bg: '#FDF2F8', text: '#BE185D' },
  LONELY:   { bg: '#F1F5F9', text: '#475569' },
  GRATEFUL: { bg: '#FFF7ED', text: '#C2410C' },
  TIRED:    { bg: '#F9FAFB', text: '#6B7280' },
};

// 감정 아바타 그라디언트 매핑 - 카드 아바타용
export const EMOTION_AVATAR_GRADIENT: Record<string, string> = {
  HAPPY:    'linear-gradient(135deg, #FFE5B4, #FFB347)',
  SAD:      'linear-gradient(135deg, #B4B4DC, #8484C6)',
  ANXIOUS:  'linear-gradient(135deg, #E8B4DC, #C884C6)',
  ANGRY:    'linear-gradient(135deg, #FFBDB4, #FF8C84)',
  CALM:     'linear-gradient(135deg, #A8E6CF, #56AB91)',
  EXCITED:  'linear-gradient(135deg, #FFD1DC, #FF69B4)',
  LONELY:   'linear-gradient(135deg, #C8D8E8, #8AA8C8)',
  GRATEFUL: 'linear-gradient(135deg, #FFD9B4, #FFA874)',
  TIRED:    'linear-gradient(135deg, #DEDEDE, #ABABAB)',
};

// 감정 색상 매핑 - 지도 마커용 (프론트엔드 전용 - 중앙 관리)
export const EMOTION_COLOR: Record<string, string> = {
  HAPPY: '#FFD700',
  SAD: '#4169E1',
  ANXIOUS: '#9370DB',
  ANGRY: '#DC143C',
  CALM: '#32CD32',
  EXCITED: '#FF69B4',
  LONELY: '#708090',
  GRATEFUL: '#FF8C00',
  TIRED: '#A0A0A0',
};
