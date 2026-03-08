import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { NotificationEvent } from '@/types/notification';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

export function useSseNotification(enabled: boolean) {

  useEffect(() => {
    if (!enabled) return;

    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    let aborted = false;
    const abortController = new AbortController();

    const startSSE = async () => {
      try {
        console.log('[SSE] 연결 시도 중...');
        const response = await fetch(
          `${API_BASE_URL}/api/v1/notifications/subscribe`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'text/event-stream',
              'Cache-Control': 'no-cache',
            },
            signal: abortController.signal,
          }
        );

        if (!response.ok || !response.body) {
          console.warn('[SSE] 연결 실패:', response.status);
          if (!aborted) setTimeout(startSSE, 30000);
          return;
        }

        console.log('[SSE] 연결 성공');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // while 루프 밖에 선언 → 청크가 나뉘어 도착해도 eventType이 유지됨
        let eventType = '';
        let eventData = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('[SSE] 스트림 종료, 재연결 시도');
            if (!aborted) setTimeout(startSSE, 3000);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('event:')) {
              eventType = trimmed.slice(6).trim();
            } else if (trimmed.startsWith('data:')) {
              eventData = trimmed.slice(5).trim();
            } else if (trimmed === '') {
              if (eventData) {
                console.log('[SSE] 이벤트 수신:', eventType, eventData);
                handleSseEvent(eventType || 'message', eventData);
              }
              eventType = '';
              eventData = '';
            }
          }
        }
      } catch (err) {
        if (!aborted) {
          console.warn('[SSE] 오류 발생, 30초 후 재연결:', err);
          setTimeout(startSSE, 30000);
        }
      }
    };

    const handleSseEvent = (eventType: string, data: string) => {
      if (eventType === 'heartbeat' || data === '{}' || data === '') return;

      if (eventType === 'time-capsule') {
        try {
          const event: NotificationEvent = JSON.parse(data);
          // 클로저 대신 .getState()로 직접 접근 → 항상 최신 함수 참조
          useNotificationStore.getState().incrementUnread();
          // 토스트 팝업 표시
          toast.success(`${event.title}\n${event.content}`, {
            duration: 6000,
            icon: '🎁',
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '12px',
              padding: '12px 16px',
              maxWidth: '360px',
            },
          });
        } catch (e) {
          console.error('[SSE] 이벤트 파싱 오류:', e, data);
        }
      }
    };

    startSSE();

    return () => {
      aborted = true;
      abortController.abort();
      console.log('[SSE] 연결 해제');
    };
  }, [enabled]);
}
