import apiClient from '@/lib/api';
import {
  ArchiveCreateRequest,
  ArchiveUpdateRequest,
  ArchiveStatusUpdateRequest,
  ArchiveDetail,
  ArchiveSummary,
  PagingResponse,
  ArchiveSearchCondition,
  ArchiveImage,
} from '@/types/archive';

export const archiveService = {
  // 아카이브 생성
  async create(data: ArchiveCreateRequest): Promise<number> {
    const response = await apiClient.post('/api/v1/archives', data);
    // Location 헤더에서 생성된 ID 추출
    const location = response.headers.location;
    const id = location ? parseInt(location.split('/').pop() || '0') : 0;
    return id;
  },

  // 아카이브 목록 조회 (공개 글)
  async getList(
    params: {
      page?: number;
      size?: number;
      condition?: ArchiveSearchCondition;
    } = {}
  ): Promise<PagingResponse<ArchiveSummary>> {
    const { data } = await apiClient.get<PagingResponse<ArchiveSummary>>(
      '/api/v1/archives',
      { params }
    );
    return data;
  },

  // 내 아카이브 목록 조회
  async getMyList(params: {
    page?: number;
    size?: number;
  } = {}): Promise<PagingResponse<ArchiveSummary>> {
    const { data } = await apiClient.get<PagingResponse<ArchiveSummary>>(
      '/api/v1/archives/me',
      { params }
    );
    return data;
  },

  // 스크랩한 아카이브 목록 조회
  async getScrapList(params: {
    page?: number;
    size?: number;
  } = {}): Promise<PagingResponse<ArchiveSummary>> {
    const { data } = await apiClient.get<PagingResponse<ArchiveSummary>>(
      '/api/v1/archives/scraps',
      { params }
    );
    return data;
  },

  // 아카이브 상세 조회
  async getDetail(id: number): Promise<ArchiveDetail> {
    const { data } = await apiClient.get<ArchiveDetail>(
      `/api/v1/archives/${id}`
    );
    return data;
  },

  // 아카이브 수정 (백엔드 API 추가 필요)
  async update(id: number, data: ArchiveUpdateRequest): Promise<void> {
    await apiClient.patch(`/api/v1/archives/${id}`, data);
  },

  // 아카이브 상태 변경 (현재 백엔드 지원)
  async updateStatus(
    id: number,
    data: ArchiveStatusUpdateRequest
  ): Promise<void> {
    await apiClient.patch(`/api/v1/archives/${id}/status`, data);
  },

  // 아카이브 삭제 (백엔드 API 추가 필요 - Soft Delete)
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/archives/${id}`);
  },

  // 좋아요 추가
  async addLike(id: number): Promise<void> {
    await apiClient.post(`/api/v1/archives/${id}/like`);
  },

  // 좋아요 제거
  async removeLike(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/archives/${id}/like`);
  },

  // 스크랩 추가
  async addScrap(id: number): Promise<void> {
    await apiClient.post(`/api/v1/archives/${id}/scrap`);
  },

  // 스크랩 제거
  async removeScrap(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/archives/${id}/scrap`);
  },

  // 이미지 업로드
  async uploadImages(id: number, files: File[]): Promise<ArchiveImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const { data } = await apiClient.post<ArchiveImage[]>(
      `/api/v1/archives/${id}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  // 이미지 삭제
  async deleteImage(archiveId: number, imageId: number): Promise<void> {
    await apiClient.delete(`/api/v1/archives/${archiveId}/images/${imageId}`);
  },
};
