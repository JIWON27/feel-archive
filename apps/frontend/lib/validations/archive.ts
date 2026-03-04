import { z } from 'zod';
import { EmotionType, Visibility } from '@/types/archive';

// 아카이브 작성/수정 스키마 (SPEC.md 기준)
export const archiveSchema = z.object({
  // 감정 태그: 단일 선택 필수
  emotion: z.nativeEnum(EmotionType),

  // 텍스트: 2000자 이상 허용
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(5000, '내용은 최대 5000자까지 입력 가능합니다'),

  // 공개/비공개: 필수 선택
  visibility: z.nativeEnum(Visibility),

  // 위치: 선택
  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      locationLabel: z.string().optional(),
    })
    .optional(),
});

export type ArchiveFormData = z.infer<typeof archiveSchema>;

// 위치 선택 스키마 (별도 사용)
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationLabel: z.string().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
