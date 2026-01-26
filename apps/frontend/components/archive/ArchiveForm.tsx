'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { archiveSchema, ArchiveFormData } from '@/lib/validations/archive';
import { EmotionType, EmotionLabels, Visibility } from '@/types/archive';
import { Button } from '@/components/ui/Button';
import { LocationPicker } from './LocationPicker';

interface ArchiveFormProps {
  defaultValues?: Partial<ArchiveFormData>;
  onSubmit: (data: ArchiveFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const ArchiveForm: React.FC<ArchiveFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = '작성하기',
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArchiveFormData>({
    resolver: zodResolver(archiveSchema),
    defaultValues: defaultValues || {
      emotions: [],
      content: '',
      visibility: Visibility.PUBLIC,
      location: undefined,
    },
  });

  const selectedEmotions = watch('emotions') || [];
  const visibility = watch('visibility');

  // 감정 선택/해제 토글
  const toggleEmotion = (emotion: EmotionType) => {
    const current = selectedEmotions;
    if (current.includes(emotion)) {
      setValue(
        'emotions',
        current.filter((e) => e !== emotion)
      );
    } else {
      setValue('emotions', [...current, emotion]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 감정 태그 선택 (복수) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          감정 태그 선택 (복수 선택 가능)
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(EmotionLabels).map(([key, label]) => {
            const emotion = key as EmotionType;
            const isSelected = selectedEmotions.includes(emotion);

            return (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.emotions && (
          <p className="mt-1 text-sm text-red-500">{errors.emotions.message}</p>
        )}
      </div>

      {/* 텍스트 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내용
        </label>
        <textarea
          {...register('content')}
          rows={10}
          placeholder="감정을 자유롭게 표현해보세요... (최대 5000자)"
          className={`
            w-full px-4 py-3 rounded-lg border resize-none
            ${errors.content ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2
            ${errors.content ? 'focus:ring-red-500' : 'focus:ring-primary'}
          `}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* 위치 선택 */}
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <LocationPicker
            value={field.value}
            onChange={field.onChange}
            error={errors.location?.message}
          />
        )}
      />

      {/* 공개/비공개 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공개 설정
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value={Visibility.PUBLIC}
              {...register('visibility')}
              className="mr-2"
            />
            <span className="text-sm">공개</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value={Visibility.PRIVATE}
              {...register('visibility')}
              className="mr-2"
            />
            <span className="text-sm">비공개</span>
          </label>
        </div>
        {errors.visibility && (
          <p className="mt-1 text-sm text-red-500">
            {errors.visibility.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          취소
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
