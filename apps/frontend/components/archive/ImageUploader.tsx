'use client';

import React, { useRef, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
  maxSizePerFile?: number; // MB
  maxTotalSize?: number; // MB
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
  maxSizePerFile = 5,
  maxTotalSize = 20,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // 파일 개수 확인
    if (images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    // 개별 파일 크기 확인
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizePerFile * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      alert(`각 파일은 최대 ${maxSizePerFile}MB까지 업로드 가능합니다.`);
      return;
    }

    // 전체 파일 크기 확인
    const currentSize = images.reduce((sum, file) => sum + file.size, 0);
    const newSize = files.reduce((sum, file) => sum + file.size, 0);
    if ((currentSize + newSize) > maxTotalSize * 1024 * 1024) {
      alert(`전체 이미지 크기는 최대 ${maxTotalSize}MB까지 업로드 가능합니다.`);
      return;
    }

    // 이미지 파일만 필터링
    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== files.length) {
      alert('이미지 파일만 업로드할 수 있습니다.');
    }

    onChange([...images, ...imageFiles]);

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        사진 ({images.length}/{maxImages})
      </label>

      {/* 이미지 그리드 (인스타그램 스타일) */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {images.map((file, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* 이미지 추가 버튼 */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleClick}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-primary"
          >
            <svg
              className="w-8 h-8 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs">사진 추가</span>
          </button>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500">
        • 최대 {maxImages}개까지 업로드 가능
        <br />• 파일당 최대 {maxSizePerFile}MB, 전체 최대 {maxTotalSize}MB
      </p>
    </div>
  );
};
