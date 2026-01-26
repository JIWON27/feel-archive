'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useArchiveDetail, useUpdateArchive } from '@/hooks/use-archives';
import { ArchiveForm } from '@/components/archive/ArchiveForm';
import { ArchiveFormData } from '@/lib/validations/archive';
import { Button } from '@/components/ui/Button';

export default function EditArchivePage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: archive, isLoading, error } = useArchiveDetail(id);
  const updateArchive = useUpdateArchive(id);

  const handleSubmit = (data: ArchiveFormData) => {
    updateArchive.mutate(data);
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

        <div className="bg-white rounded-lg shadow p-6">
          <ArchiveForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={updateArchive.isPending}
            submitLabel="수정하기"
          />
        </div>
      </div>
    </div>
  );
}
