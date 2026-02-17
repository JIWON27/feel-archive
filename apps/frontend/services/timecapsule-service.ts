import api from '@/lib/api';
import {
  TimeCapsuleCreateRequest,
  TimeCapsuleUpdateRequest,
  TimeCapsuleSummary,
  TimeCapsuleDetail,
  TimeCapsulePagingResponse,
} from '@/types/timecapsule';
import { CapsuleStatus } from '@/types/timecapsule';

export const timeCapsuleService = {
  // 타임캡슐 작성
  async create(data: TimeCapsuleCreateRequest): Promise<number> {
    const response = await api.post('/api/v1/time-capsule', data);
    const location = response.headers['location'] || response.headers['Location'];
    if (location) {
      const segment = location.split('/').pop() || '';
      return parseInt(segment.replace(/\D/g, ''));
    }
    return response.data?.id;
  },

  // 내 타임캡슐 목록 조회
  async getList(params?: {
    page?: number;
    size?: number;
    status?: CapsuleStatus;
  }): Promise<TimeCapsulePagingResponse> {
    const response = await api.get('/api/v1/time-capsule', { params });
    return response.data;
  },

  // 타임캡슐 상세 조회
  async getDetail(id: number): Promise<TimeCapsuleDetail> {
    const response = await api.get(`/api/v1/time-capsule/${id}`);
    return response.data;
  },

  // 타임캡슐 수정 (작성 후 30분 이내)
  async update(id: number, data: TimeCapsuleUpdateRequest): Promise<void> {
    await api.put(`/api/v1/time-capsule/${id}`, data);
  },

  // 타임캡슐 삭제
  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/time-capsule/${id}`);
  },

  // 이미지 업로드
  async uploadImages(id: number, files: File[]): Promise<{ id: number; url: string }[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await api.post(`/api/v1/time-capsule/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 이미지 삭제
  async deleteImage(capsuleId: number, imageId: number): Promise<void> {
    await api.delete(`/api/v1/time-capsule/${capsuleId}/images/${imageId}`);
  },
};
