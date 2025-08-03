import { SocketConnectionError } from "@/types/chat"

export interface ChatApiConfig {
  socketHost: string
  reconnectDelay: number
  heartbeatIncoming: number
  heartbeatOutgoing: number
}

/**
 * 기본 Chat API 설정
 */
export const defaultChatApiConfig: ChatApiConfig = {
  socketHost: import.meta.env.DEV ? "/ws" : "https://growlog-web-ide.duckdns.org/ws",
  reconnectDelay: 5000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
}

/**
 * 개발/프로덕션 환경별 설정 오버라이드
 */
export const getChatApiConfig = (overrides?: Partial<ChatApiConfig>): ChatApiConfig => {
  return {
    ...defaultChatApiConfig,
    ...overrides,
  }
}

/**
 * STOMP 연결 헤더 생성
 */

export const createConnectHeaders = (jwt: string | undefined): Record<string, string> => {
  const headers: Record<string, string> = {}
  if (typeof jwt === "string" && jwt.length > 0) {
    headers.Authorization = `Bearer ${jwt}`
    return headers
  }
  throw new SocketConnectionError("Failed to create connection headers", "HEADER_CREATION_ERROR")
}
