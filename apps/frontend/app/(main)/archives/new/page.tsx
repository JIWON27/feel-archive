'use client';

import { ArchiveForm } from '@/components/archive/ArchiveForm';
import { useCreateArchive } from '@/hooks/use-archives';
import { ArchiveFormData } from '@/lib/validations/archive';

export default function NewArchivePage() {
  const createArchive = useCreateArchive();

  const handleSubmit = (data: ArchiveFormData, images: File[]) => {
    createArchive.mutate({ data, images });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            새 아카이브 작성
          </h1>
          <p className="mt-2 text-gray-600">
            당신의 감정을 특정 장소와 함께 기록해보세요
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ArchiveForm
            onSubmit={handleSubmit}
            isLoading={createArchive.isPending}
            submitLabel="작성하기"
          />
        </div>
      </div>
    </div>
  );
}
