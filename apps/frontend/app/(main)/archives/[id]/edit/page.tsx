'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useArchiveDetail, useUpdateArchive } from '@/hooks/use-archives';
import { ArchiveForm } from '@/components/archive/ArchiveForm';
import { EditImageUploader, EditImageState } from '@/components/archive/EditImageUploader';
import { ArchiveFormData } from '@/lib/validations/archive';
import { Button } from '@/components/ui/Button';

export default function EditArchivePage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: archive, isLoading, error } = useArchiveDetail(id);
  const updateArchive = useUpdateArchive(id);

  const [imageState, setImageState] = useState<EditImageState>({
    existingImageIds: [],
    newFiles: [],
  });

  const handleSubmit = (data: ArchiveFormData, _files: File[]) => {
    updateArchive.mutate({
      data,
      existingImageIds: imageState.existingImageIds,
      newFiles: imageState.newFiles,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !archive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">아카이브를 불러오지 못했습니다</p>
          <Button onClick={() => router.push('/archives')}>목록으로</Button>
        </div>
      </div>
    );
  }

  if (!archive.isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">수정 권한이 없습니다</p>
          <Button onClick={() => router.push(`/archives/${id}`)}>
            상세 페이지로
          </Button>
        </div>
      </div>
    );
  }

  const defaultValues: Partial<ArchiveFormData> = {
    emotion: archive.emotion,
    content: archive.content,
    visibility: archive.visibility,
    location: archive.location
      ? {
          latitude: archive.location.latitude,
          longitude: archive.location.longitude,
          locationLabel: archive.location.address,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">아카이브 수정</h1>
          <p className="mt-2 text-gray-600">내용을 수정해주세요</p>
        </div>

        {/* 이미지 안내 배너 */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg px-4 py-3 mb-4">
          <svg
            className="w-5 h-5 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>이미지 삭제/추가는 수정 완료 시 최종 반영됩니다.</span>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* 이미지 섹션 (즉시 업로드 / 삭제는 상태에서만 제거) */}
          <EditImageUploader
            initialImages={archive.images}
            onStateChange={setImageState}
          />

          {/* 나머지 폼 필드 (감정, 내용, 위치, 공개 설정) */}
          <ArchiveForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={updateArchive.isPending}
            submitLabel="수정 완료"
            hideImageUploader
          />
        </div>
      </div>
    </div>
  );
}
