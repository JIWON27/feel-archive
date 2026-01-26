import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { archiveService } from '@/services/archive-service';
import {
  ArchiveCreateRequest,
  ArchiveUpdateRequest,
  ArchiveSearchCondition,
} from '@/types/archive';
import { AxiosError } from 'axios';

// Query Keys
export const archiveKeys = {
  all: ['archives'] as const,
  lists: () => [...archiveKeys.all, 'list'] as const,
  list: (condition?: ArchiveSearchCondition) =>
    [...archiveKeys.lists(), condition] as const,
  myLists: () => [...archiveKeys.all, 'my'] as const,
  scrapLists: () => [...archiveKeys.all, 'scraps'] as const,
  details: () => [...archiveKeys.all, 'detail'] as const,
  detail: (id: number) => [...archiveKeys.details(), id] as const,
};

// 아카이브 목록 조회 (무한 스크롤)
export const useArchiveList = (condition?: ArchiveSearchCondition) => {
  return useInfiniteQuery({
    queryKey: archiveKeys.list(condition),
    queryFn: ({ pageParam = 0 }) =>
      archiveService.getList({
        page: pageParam,
        size: 20,
        condition,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};

// 내 아카이브 목록 조회 (무한 스크롤)
export const useMyArchiveList = () => {
  return useInfiniteQuery({
    queryKey: archiveKeys.myLists(),
    queryFn: ({ pageParam = 0 }) =>
      archiveService.getMyList({
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};

// 스크랩 목록 조회 (무한 스크롤)
export const useScrapList = () => {
  return useInfiniteQuery({
    queryKey: archiveKeys.scrapLists(),
    queryFn: ({ pageParam = 0 }) =>
      archiveService.getScrapList({
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};

// 아카이브 상세 조회
export const useArchiveDetail = (id: number) => {
  return useQuery({
    queryKey: archiveKeys.detail(id),
    queryFn: () => archiveService.getDetail(id),
  });
};

// 아카이브 생성
export const useCreateArchive = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArchiveCreateRequest) => archiveService.create(data),
    onSuccess: (archiveId) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: archiveKeys.myLists() });
      toast.success('아카이브가 작성되었습니다');
      router.push(`/archives/${archiveId}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '아카이브 작성에 실패했습니다';
      toast.error(message);
    },
  });
};

// 아카이브 수정
export const useUpdateArchive = (id: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArchiveUpdateRequest) =>
      archiveService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: archiveKeys.myLists() });
      toast.success('아카이브가 수정되었습니다');
      router.push(`/archives/${id}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '아카이브 수정에 실패했습니다';
      toast.error(message);
    },
  });
};

// 아카이브 삭제
export const useDeleteArchive = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => archiveService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: archiveKeys.myLists() });
      toast.success('아카이브가 삭제되었습니다');
      router.push('/archives');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '아카이브 삭제에 실패했습니다';
      toast.error(message);
    },
  });
};

// 좋아요 토글
export const useLikeArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: { id: number; isLiked: boolean }) => {
      return isLiked
        ? archiveService.removeLike(id)
        : archiveService.addLike(id);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '좋아요 처리에 실패했습니다';
      toast.error(message);
    },
  });
};

// 스크랩 토글
export const useScrapArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isScraped }: { id: number; isScraped: boolean }) => {
      return isScraped
        ? archiveService.removeScrap(id)
        : archiveService.addScrap(id);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: archiveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: archiveKeys.scrapLists() });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '스크랩 처리에 실패했습니다';
      toast.error(message);
    },
  });
};

// 이미지 업로드
export const useUploadImages = (archiveId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => archiveService.uploadImages(archiveId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: archiveKeys.detail(archiveId),
      });
      toast.success('이미지가 업로드되었습니다');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '이미지 업로드에 실패했습니다';
      toast.error(message);
    },
  });
};

// 이미지 삭제
export const useDeleteImage = (archiveId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) =>
      archiveService.deleteImage(archiveId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: archiveKeys.detail(archiveId),
      });
      toast.success('이미지가 삭제되었습니다');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || '이미지 삭제에 실패했습니다';
      toast.error(message);
    },
  });
};
