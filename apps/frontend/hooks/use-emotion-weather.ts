import { useQuery } from '@tanstack/react-query';
import { emotionService } from '@/services/emotion-service';

// 5분 폴링: 감정 날씨는 분 단위 실시간성이 불필요하므로 서버 부하를 고려한 주기
const POLL_INTERVAL_MS = 5 * 60 * 1000;

export const emotionWeatherKeys = {
  ranking: ['emotions', 'ranking'] as const,
};

export const useEmotionWeather = () => {
  return useQuery({
    queryKey: emotionWeatherKeys.ranking,
    queryFn: () => emotionService.getRanking(),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS,
  });
};
