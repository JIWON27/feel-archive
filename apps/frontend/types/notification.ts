// 알림 관련 타입 정의 (백엔드 DTO 기준)

// 알림 타입
export enum NotificationType {
  TIME_CAPSULE = 'TIME_CAPSULE',
  SYSTEM_NOTICE = 'SYSTEM_NOTICE',
}

// 알림 응답 (백엔드 NotificationResponse)
export interface NotificationResponse {
  id: number;
  title: string;
  content: string;
  notificationType: NotificationType;
  relatedId: number | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

// SSE 알림 이벤트 페이로드 (백엔드 NotificationEvent)
export interface NotificationEvent {
  notificationId: number;
  type: string;
  title: string;
  content: string;
  relatedId: number | null;
  createdAt: string;
}

// 알림 목록 응답 (백엔드 PagingResponse)
export interface NotificationPageResponse {
  content: NotificationResponse[];
  pageNo: number;    // 1-based
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
