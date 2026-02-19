'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { AuthImage } from '@/components/ui/AuthImage';
import { ArchiveImage } from '@/types/archive';

export interface EditImageState {
  existingImageIds: number[];
  newFiles: File[];
}

interface EditImageUploaderProps {
  initialImages: ArchiveImage[];
  onStateChange: (state: EditImageState) => void;
  maxImages?: number;
}

export const EditImageUploader: React.FC<EditImageUploaderProps> = ({
  initialImages,
  onStateChange,
  maxImages = 5,
}) => {
  const [existingImages, setExistingImages] = useState<ArchiveImage[]>(initialImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCount = existingImages.length + newFiles.length;

  const notify = (nextExisting: ArchiveImage[], nextFiles: File[]) => {
    onStateChange({
      existingImageIds: nextExisting.map((img) => img.id),
      newFiles: nextFiles,
    });
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (totalCount + files.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    const oversizedFiles = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('각 파일은 최대 5MB까지 업로드 가능합니다.');
      return;
    }

    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      if (imageFiles.length === 0) return;
    }

    const nextFiles = [...newFiles, ...imageFiles];
    setNewFiles(nextFiles);
    notify(existingImages, nextFiles);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExisting = (id: number) => {
    const nextExisting = existingImages.filter((img) => img.id !== id);
    setExistingImages(nextExisting);
    notify(nextExisting, newFiles);
  };

  const handleRemoveNew = (index: number) => {
    const nextFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(nextFiles);
    notify(existingImages, nextFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        사진 ({totalCount}/{maxImages})
      </label>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* 기존 이미지 */}
        {existingImages.map((image) => (
          <div
            key={`existing-${image.id}`}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <AuthImage
              src={image.url}
              alt="아카이브 이미지"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveExisting(image.id)}
              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* 새로 추가된 파일 (로컬 미리보기) */}
        {newFiles.map((file, index) => (
          <div
            key={`new-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`새 이미지 ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {/* 새 파일임을 구분하는 뱃지 */}
            <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
              NEW
            </span>
            <button
              type="button"
              onClick={() => handleRemoveNew(index)}
              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* 추가 버튼 */}
        {totalCount < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-primary"
          >
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">사진 추가</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        • 최대 {maxImages}개까지 업로드 가능
        <br />• 파일당 최대 5MB · 수정 완료 시 반영됩니다
      </p>
    </div>
  );
};
