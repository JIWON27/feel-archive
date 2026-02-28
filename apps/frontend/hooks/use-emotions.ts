import { useQuery } from '@tanstack/react-query';
import { emotionService } from '@/services/emotion-service';

export const useEmotions = () => {
  const { data: emotions = [], isLoading } = useQuery({
    queryKey: ['emotions'],
    queryFn: emotionService.getEmotions,
    staleTime: Infinity, // 감정 목록은 변경되지 않으므로 캐시 유지
  });

  // 감정 이름으로 한글 라벨 조회
  const getLabel = (name: string): string =>
    emotions.find((e) => e.name === name)?.label ?? name;

  return { emotions, isLoading, getLabel };
};
