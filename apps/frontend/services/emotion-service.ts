import apiClient from '@/lib/api';

export interface EmotionWeatherRanking {
  rank: number;
  emotion: string;
  count: number;
}

export const emotionService = {
  async getRanking(): Promise<EmotionWeatherRanking[]> {
    const { data } = await apiClient.get<EmotionWeatherRanking[]>(
      '/api/v1/emotions/ranking'
    );
    return data;
  },
};
