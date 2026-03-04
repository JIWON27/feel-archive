// 백엔드 GET /api/v1/emotions 응답 타입
export interface EmotionResponse {
  name: string;
  label: string;
  sortOrder: number;
}

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
