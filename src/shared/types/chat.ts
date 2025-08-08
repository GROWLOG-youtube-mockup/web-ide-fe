import type { IMessage, StompSubscription } from "@stomp/stompjs"

// 코드 링크 파싱 타입
export interface ParsedCodeLink {
  fileName: string
  lineNumber: number
  fullPath: string
  originalText: string
}

// 메시지 본문 파싱 결과 타입 (텍스트/링크 조각)
export type ChatMessagePart = { type: "text"; value: string } | ({ type: "link" } & ParsedCodeLink)

// ===== 에러 타입 =====
export class ChatApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = "ChatApiError"
  }
}

export class SocketConnectionError extends Error {
  constructor(
    message: string,
    public readonly reason?: string,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = "SocketConnectionError"
  }
}

// ===== 소켓 연결 상태 =====
export enum SocketConnectionState {
  Disconnected = "DISCONNECTED",
  Connecting = "CONNECTING",
  Connected = "CONNECTED",
  Reconnecting = "RECONNECTING",
  Error = "ERROR",
}

// ===== 채팅 메시지 및 응답 타입 =====

/**
 * 단일 채팅 메시지 객체
 * @property messageType 메시지 타입 (입장/대화/퇴장)
 * @property projectId 프로젝트 ID
 * @property username 발신자 닉네임
 * @property content 메시지 본문
 * @property sentAt 전송 시각
 */
export interface ChatMessage {
  messageType: "ENTER" | "TALK" | "LEAVE"
  projectId: number
  userId?: number
  username: string
  content: string
  sentAt: string
}

/**
 * 채팅 메시지 검색 결과 객체
 * @property chatId 메시지 고유 ID
 * @property projectId 프로젝트 ID
 * @property userId 유저 ID
 * @property content 메시지 본문
 * @property sendAt 전송 시각
 */
export interface SearchChatMessage {
  chatId: number
  projectId: number
  userId: number
  content: string
  sendAt: string
}

/**
 * 채팅 히스토리(페이지네이션) 응답
 * @property content 메시지 배열
 * @property pageNumber 현재 페이지 번호
 * @property totalElements 전체 메시지 개수
 * @property totalPages 전체 페이지 수
 */
export interface ChatHistoryResponse {
  content: ChatMessage[]
  pageNumber: number
  totalElements: number
  totalPages: number
}

/**
 * 채팅 검색 결과 응답
 * @property results 검색된 메시지 배열
 */
export interface ChatSearchResponse {
  results: SearchChatMessage[]
}

/**
 * 프론트엔드 파싱/렌더링용 채팅 메시지 타입
 * @property links 코드 링크 파싱 결과
 * @property parts 텍스트/링크 조각 배열
 */
export interface ParsedChatMessage extends ChatMessage {
  links?: ParsedCodeLink[]
  parts?: ChatMessagePart[]
}

// ===== 소켓 클라이언트 관련 타입 =====

/**
 * 채팅 소켓 클라이언트 인터페이스 (STOMP/WebSocket 추상화)
 * - activate: 연결 시작
 * - publish: 메시지 전송
 * - subscribe: 메시지 구독
 * - unsubscribe: 구독 해제
 * - cleanup: 모든 구독/연결 해제
 * - onConnect/onDisconnect/onStompError/onWebSocketError/onReconnect: 이벤트 콜백
 */
export interface SocketClient {
  activate: () => void
  publish: (destination: string, body: string) => void
  deactivate: () => void
  subscribe: (destination: string, callback: (message: IMessage) => void) => StompSubscription
  unsubscribe: (subscription: StompSubscription) => void
  connectionState: SocketConnectionState
  connected: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onStompError?: (error: SocketConnectionError) => void
  onWebSocketError?: (error: SocketConnectionError) => void
  onReconnect?: () => void
  cleanup: () => void
}

/**
 * 소켓 클라이언트 생성 옵션
 * @property projectId 프로젝트 ID
 * @property onMessage 메시지 수신 콜백
 * @property onError 에러 콜백
 * @property host 소켓 서버 호스트(선택)
 * @property jwt 인증 토큰(선택)
 */
export interface SocketClientOptions {
  projectId: string
  onMessage?: (msg: ChatMessage) => void
  onError?: (err: SocketConnectionError) => void
  host?: string
  jwt?: string
}
