// 아카이브 관련 타입 정의 (SPEC.md 기준)

// 감정 타입 (백엔드 Emotion enum과 동일)
export enum EmotionType {
  HAPPY = 'HAPPY',       // 행복한
  SAD = 'SAD',           // 슬픈
  ANXIOUS = 'ANXIOUS',   // 불안한
  ANGRY = 'ANGRY',       // 화난
  CALM = 'CALM',         // 차분한
  EXCITED = 'EXCITED',   // 신난
  LONELY = 'LONELY',     // 외로운
  GRATEFUL = 'GRATEFUL', // 감사한
  TIRED = 'TIRED',       // 지친
}

// 공개 설정
export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

// 위치 정보
export interface Location {
  latitude: number;
  longitude: number;
  locationLabel?: string; // 주소 또는 장소명
}

// 아카이브 작성 요청
export interface ArchiveCreateRequest {
  emotion: EmotionType;
  content: string;
  visibility: Visibility;
  location?: Location; // 선택
}

// 아카이브 수정 요청
export interface ArchiveUpdateRequest {
  emotion: EmotionType;
  content: string;
  visibility: Visibility;
  location?: Location;
  imageIds?: number[];
}

// 아카이브 상태 변경 요청 (현재 백엔드 지원)
export interface ArchiveStatusUpdateRequest {
  visibility: Visibility;
}

// 사용자 정보
export interface ArchiveUser {
  userId: number;
  nickname: string;
}

// 아카이브 요약 (목록용)
export interface ArchiveSummary {
  archiveId: number;
  emotion: EmotionType; // 단일 선택
  contentPreview: string;
  address?: string;
  latitude?: number; // GIS 위치 정보
  longitude?: number; // GIS 위치 정보
  createdAt: string;
  likeCount: number;
  isLiked?: boolean; // 현재 사용자가 좋아요 했는지
  isScraped?: boolean; // 현재 사용자가 스크랩 했는지
  writer: ArchiveUser;
}

// 아카이브 상세
export interface ArchiveDetail {
  archiveId: number;
  emotion: EmotionType; // 단일 선택
  content: string;
  images: ArchiveImage[];
  visibility: Visibility;
  location?: {
    address?: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked?: boolean;
  isScraped?: boolean;
  writer: ArchiveUser;
  isOwner: boolean; // 본인 글 여부
}

// 이미지 정보
export interface ArchiveImage {
  id: number;
  url: string;
}

// 페이징 응답
export interface PagingResponse<T> {
  content: T[];
  pageNo: number;    // 백엔드 PagingResponse.pageNo (1-based)
  pageSize: number;  // 백엔드 PagingResponse.pageSize
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// 아카이브 검색 조건 (백엔드 ArchiveSearchCondition 기준)
export interface ArchiveSearchCondition {
  emotion?: EmotionType;
  keyword?: string;
  sortType?: 'LATEST' | 'OLDEST' | 'POPULAR' | 'LIKE'; // 백엔드 ArchiveSortType enum과 일치
}

// 주변 아카이브 조회 요청
export interface NearbyArchiveRequest {
  latitude: number;
  longitude: number;
  radius: number; // 기본값 50.0 (백엔드에서 처리)
}

// 아카이브 마커 정보 (지도용)
export interface ArchiveMarker {
  archiveId: number;
  latitude: number;
  longitude: number;
  emotion: EmotionType;
}
