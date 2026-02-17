import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { timeCapsuleService } from '@/services/timecapsule-service';
import {
  TimeCapsuleCreateRequest,
  TimeCapsuleUpdateRequest,
  CapsuleStatus,
} from '@/types/timecapsule';

export const capsuleKeys = {
  all: ['timeCapsules'] as const,
  lists: () => [...capsuleKeys.all, 'list'] as const,
  list: (params?: object) => [...capsuleKeys.lists(), params] as const,
  details: () => [...capsuleKeys.all, 'detail'] as const,
  detail: (id: number) => [...capsuleKeys.details(), id] as const,
};

// 내 타임캡슐 목록 조회 (무한 스크롤)
export function useTimeCapsuleList(status?: CapsuleStatus) {
  return useInfiniteQuery({
    queryKey: capsuleKeys.list({ status }),
    queryFn: async ({ pageParam = 1 }) => {
      return timeCapsuleService.getList({ page: pageParam, size: 10, status });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageNo + 1;
    },
  });
}

// 타임캡슐 상세 조회
export function useTimeCapsuleDetail(id: number) {
  return useQuery({
    queryKey: capsuleKeys.detail(id),
    queryFn: () => timeCapsuleService.getDetail(id),
    enabled: !!id,
  });
}

// 타임캡슐 작성
export function useCreateTimeCapsule() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ data, images }: { data: TimeCapsuleCreateRequest; images: File[] }) => {
      // 1. 캡슐 생성 → ID 획득
      const id = await timeCapsuleService.create(data);

      // 2. 이미지가 있으면 순차 업로드
      if (images.length > 0) {
        try {
          await timeCapsuleService.uploadImages(id, images);
        } catch {
          toast.error('이미지 업로드에 실패했지만 타임캡슐은 생성되었습니다.');
        }
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: capsuleKeys.lists() });
      toast.success('타임캡슐이 봉인되었습니다! 🎁');
      router.push(`/timecapsule/${id}`);
    },
    onError: () => {
      toast.error('타임캡슐 작성에 실패했습니다.');
    },
  });
}

// 타임캡슐 수정
export function useUpdateTimeCapsule(id: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TimeCapsuleUpdateRequest) => timeCapsuleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: capsuleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: capsuleKeys.lists() });
      toast.success('타임캡슐이 수정되었습니다.');
      router.push(`/timecapsule/${id}`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const msg = error?.response?.data?.message || '타임캡슐 수정에 실패했습니다.';
      toast.error(msg);
    },
  });
}

// 타임캡슐 삭제
export function useDeleteTimeCapsule() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => timeCapsuleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: capsuleKeys.lists() });
      toast.success('타임캡슐이 삭제되었습니다.');
      router.push('/my/timecapsules');
    },
    onError: () => {
      toast.error('타임캡슐 삭제에 실패했습니다.');
    },
  });
}

// 이미지 업로드
export function useUploadCapsuleImages(capsuleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => timeCapsuleService.uploadImages(capsuleId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: capsuleKeys.detail(capsuleId) });
    },
    onError: () => {
      toast.error('이미지 업로드에 실패했습니다.');
    },
  });
}
