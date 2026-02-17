// 타임캡슐 관련 타입 정의 (백엔드 DTO 기준)

import { EmotionType } from './archive';

// 캡슐 상태
export enum CapsuleStatus {
  LOCKED = 'LOCKED',   // 잠금
  OPENED = 'OPENED',   // 열림
}

// 위치 요청 (타임캡슐용)
export interface TimeCapsuleLocationRequest {
  latitude?: number;
  longitude?: number;
  locationLabel?: string;
}

// 위치 상세 (응답용)
export interface LocationDetail {
  address?: string;
  latitude?: number;
  longitude?: number;
}

// 타임캡슐 작성 요청
export interface TimeCapsuleCreateRequest {
  emotion: EmotionType;
  content: string;
  openAt: string; // ISO 8601 datetime (미래 날짜)
  location?: TimeCapsuleLocationRequest;
}

// 타임캡슐 수정 요청
export interface TimeCapsuleUpdateRequest {
  emotion?: EmotionType;
  content?: string;
  openAt?: string;
}

// 타임캡슐 이미지
export interface TimeCapsuleImage {
  id: number;
  url: string;
}

// 타임캡슐 목록 요약 (백엔드 TimeCapsuleSummaryResponse)
export interface TimeCapsuleSummary {
  id: number;
  emotion: EmotionType;
  contentPreview: string;
  location?: LocationDetail;
  status: CapsuleStatus;
  openAt: string;  // "yyyy.MM.dd HH:mm" 형식
  createdAt: string;  // "yyyy.MM.dd HH:mm" 형식
}

// 타임캡슐 상세 (백엔드 TimeCapsuleDetailResponse)
export interface TimeCapsuleDetail {
  id: number;
  emotion: EmotionType;
  content: string | null; // 잠금 상태에서는 null
  images: TimeCapsuleImage[];
  location?: LocationDetail;
  status: CapsuleStatus;
  openAt: string;
  createdAt: string;
}

// 타임캡슐 페이징 응답 (백엔드 PagingResponse)
export interface TimeCapsulePagingResponse {
  content: TimeCapsuleSummary[];
  pageNo: number;      // 1-indexed
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
