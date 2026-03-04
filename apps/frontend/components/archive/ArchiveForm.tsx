'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { archiveSchema, ArchiveFormData } from '@/lib/validations/archive';
import { EmotionType, Visibility } from '@/types/archive';
import { useEmotions } from '@/hooks/use-emotions';
import { Button } from '@/components/ui/Button';
import { LocationPicker } from './LocationPicker';
import { ImageUploader } from './ImageUploader';

interface ArchiveFormProps {
  defaultValues?: Partial<ArchiveFormData>;
  onSubmit: (data: ArchiveFormData, images: File[]) => void;
  isLoading?: boolean;
  submitLabel?: string;
  hideImageUploader?: boolean;
}

export const ArchiveForm: React.FC<ArchiveFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = '작성하기',
  hideImageUploader = false,
}) => {
  const { emotions } = useEmotions();
  const [images, setImages] = useState<File[]>([]);
  const [shareLocation, setShareLocation] = useState<boolean>(
    defaultValues?.location != null
  );

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
      emotion: undefined,
      content: '',
      visibility: Visibility.PUBLIC,
      location: undefined,
    },
  });

  const selectedEmotion = watch('emotion');
  const visibility = watch('visibility');

  const handleFormSubmit = (data: ArchiveFormData) => {
    onSubmit(data, images);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 감정 태그 선택 (단일) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          감정 태그 선택 (단일 선택)
        </label>
        <div className="flex flex-wrap gap-2">
          {emotions.map(({ name, label }) => {
            const emotion = name as EmotionType;
            const isSelected = selectedEmotion === emotion;

            return (
              <button
                key={emotion}
                type="button"
                onClick={() => setValue('emotion', emotion)}
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
        {errors.emotion && (
          <p className="mt-1 text-sm text-red-500">{errors.emotion.message}</p>
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

      {/* 이미지 업로드 (수정 페이지에서는 숨김) */}
      {!hideImageUploader && (
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={5}
          maxSizePerFile={5}
          maxTotalSize={20}
        />
      )}

      {/* 위치 공유 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          위치 정보
        </label>
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => {
              setShareLocation(true);
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
              ${
                shareLocation
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }
            `}
          >
            📍 위치 공유
          </button>
          <button
            type="button"
            onClick={() => {
              setShareLocation(false);
              setValue('location', undefined);
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
              ${
                !shareLocation
                  ? 'bg-gray-700 text-white border-gray-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }
            `}
          >
            🚫 공유 안함
          </button>
        </div>

        {shareLocation && (
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocationPicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </div>

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
