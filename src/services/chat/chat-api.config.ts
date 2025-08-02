import { SocketConnectionError } from "@/types/cha-service"

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
  socketHost: "/api/ws",
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

/**
 * SockJS 라이브러리 동적 로딩
 */
export const loadSockJs = (): typeof import("sockjs-client") | undefined => {
  try {
    return require("sockjs-client/dist/sockjs")
  } catch {
    return undefined
  }
}
