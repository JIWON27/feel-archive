import apiClient from '@/lib/api';
import { EmotionResponse } from '@/types/emotion';

export interface EmotionWeatherRanking {
  rank: number;
  emotion: string;
  count: number;
}

export const emotionService = {
  async getEmotions(): Promise<EmotionResponse[]> {
    const { data } = await apiClient.get<EmotionResponse[]>('/api/v1/emotions');
    return data;
  },

  async getRanking(): Promise<EmotionWeatherRanking[]> {
    const { data } = await apiClient.get<EmotionWeatherRanking[]>(
      '/api/v1/emotions/ranking'
    );
    return data;
  },
};
