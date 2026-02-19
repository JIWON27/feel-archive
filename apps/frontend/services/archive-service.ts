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
  NearbyArchiveRequest,
} from '@/types/archive';

export const archiveService = {
  // 아카이브 생성
  async create(data: ArchiveCreateRequest): Promise<number> {
    const response = await apiClient.post('/api/v1/archives', data);

    // 디버깅: 모든 헤더 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('[Archive Create] Response headers:', response.headers);
      console.log('[Archive Create] Location header:', response.headers.location);
      console.log('[Archive Create] Location header (lowercase):', response.headers['location']);
    }

    // Location 헤더에서 생성된 ID 추출
    // 소문자로 시도 (Axios는 헤더를 소문자로 변환할 수 있음)
    const location = response.headers.location || response.headers['location'];

    if (!location) {
      console.error('[Archive Create] Location 헤더가 없습니다. 백엔드 CORS 설정을 확인하세요.');
      // 백업: response body에 ID가 있는지 확인 (백엔드가 추후 수정할 경우 대비)
      if (response.data && typeof response.data === 'object' && 'id' in response.data) {
        return response.data.id as number;
      }
      return 0;
    }

    const segment = location.split('/').pop() || '';
    const id = parseInt(segment.replace(/\D/g, ''));
    console.log('[Archive Create] Extracted ID:', id, 'from location:', location);
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

  // 아카이브 수정
  async update(id: number, data: ArchiveUpdateRequest): Promise<ArchiveDetail> {
    const { data: response } = await apiClient.patch<ArchiveDetail>(
      `/api/v1/archives/${id}`,
      data
    );
    return response;
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

  // 주변 아카이브 조회 (위치 기반)
  // 백엔드가 @ModelAttribute를 사용하므로 query parameter 방식으로 전송
  // 백엔드 수정: ArchiveSummaryResponse 반환 (지도 + 목록 표시용)
  async getNearbyArchives(
    request: NearbyArchiveRequest
  ): Promise<ArchiveSummary[]> {
    const { data } = await apiClient.get<ArchiveSummary[]>(
      '/api/v1/archives/nearby',
      {
        params: {
          latitude: request.latitude,
          longitude: request.longitude,
          radius: request.radius,
        },
      }
    );
    return data;
  },
};
