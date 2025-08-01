import apiClient from "./index"

// 채팅 메시지 타입 (실시간/히스토리 공통)
export interface ChatMessage {
  messageType: "ENTER" | "TALK" | "LEAVE"
  projectId: number
  username: string
  content: string
  sentAt: string
}

// 검색 결과 메시지 타입 (검색 API 응답)
export interface SearchChatMessage {
  chatId: number
  projectId: number
  userId: number
  content: string
  sendAt: string
}

// 소켓 클라이언트 인터페이스
export interface SocketClient {
  activate: () => void
  publish: (destination: string, body: string) => void
  deactivate: () => void
  subscribe: (destination: string, callback: (message: ChatMessage) => void) => void
  connected: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onStompError?: (error: unknown) => void
  onWebSocketError?: (error: unknown) => void
}

/**
 * 채팅 서비스를 위한 인터페이스
 */
export interface ChatService {
  /**
   * 채팅 히스토리 조회 (페이징)
   */
  fetchChatHistory(
    projectId: number,
    page?: number,
    size?: number
  ): Promise<{
    content: ChatMessage[]
    pageNumber: number
    totalElements: number
    totalPages: number
  }>

  /**
   * 채팅 메시지 검색
   */
  searchChatMessages(projectId: number, keyword: string): Promise<{ results: SearchChatMessage[] }>

  /**
   * 실시간 채팅 소켓 클라이언트 생성
   */
  createProjectChatSocket(options: {
    projectId: number
    onMessage?: (msg: ChatMessage) => void
    onError?: (err: unknown) => void
    host?: string
  }): SocketClient
}

/**
 * Mock 구현체
 */
export class MockChatService implements ChatService {
  async fetchChatHistory(
    projectId: number,
    page = 0,
    size = 20
  ): Promise<{
    content: ChatMessage[]
    pageNumber: number
    totalElements: number
    totalPages: number
  }> {
    console.log(`[Mock] 채팅 히스토리 조회: projectId=${projectId}, page=${page}, size=${size}`)

    // Mock 데이터 반환
    return {
      content: [
        {
          messageType: "ENTER",
          projectId,
          username: "user1",
          content: "채팅방에 입장했습니다.",
          sentAt: new Date().toISOString(),
        },
        {
          messageType: "TALK",
          projectId,
          username: "user2",
          content: "안녕하세요!",
          sentAt: new Date().toISOString(),
        },
      ],
      pageNumber: page,
      totalElements: 2,
      totalPages: 1,
    }
  }

  async searchChatMessages(
    projectId: number,
    keyword: string
  ): Promise<{ results: SearchChatMessage[] }> {
    console.log(`[Mock] 채팅 메시지 검색: projectId=${projectId}, keyword=${keyword}`)

    // Mock 데이터 반환
    return {
      results: [
        {
          chatId: 1,
          projectId,
          userId: 123,
          content: `검색 키워드 "${keyword}"가 포함된 메시지입니다.`,
          sendAt: new Date().toISOString(),
        },
      ],
    }
  }

  createProjectChatSocket({
    projectId,
    onMessage: _onMessage,
    onError: _onError,
    host = "/ws",
  }: {
    projectId: number
    onMessage?: (msg: ChatMessage) => void
    onError?: (err: unknown) => void
    host?: string
  }): SocketClient {
    console.log(`[SOCKET][MOCK] Creating mock client for project ${projectId} at ${host}`)

    return {
      activate: () => {
        console.log("[SOCKET][MOCK] activate() called")
      },
      publish: (destination: string, body: string) => {
        console.log(`[SOCKET][MOCK] publish() called: ${destination}`, body)
      },
      deactivate: () => {
        console.log("[SOCKET][MOCK] deactivate() called")
      },
      subscribe: (destination: string, callback: (message: ChatMessage) => void) => {
        console.log(`[SOCKET][MOCK] subscribe() called: ${destination}`, callback)
      },
      connected: false,
      onConnect: undefined,
      onDisconnect: undefined,
      onStompError: undefined,
      onWebSocketError: undefined,
    }
  }
}

/**
 * 실제 API 구현체
 */
export class ApiChatService implements ChatService {
  async fetchChatHistory(
    projectId: number,
    page = 0,
    size = 20
  ): Promise<{
    content: ChatMessage[]
    pageNumber: number
    totalElements: number
    totalPages: number
  }> {
    const res = await apiClient.get(`/projects/${projectId}/chat/history`, {
      params: { page, size },
    })
    return res.data
  }

  async searchChatMessages(
    projectId: number,
    keyword: string
  ): Promise<{ results: SearchChatMessage[] }> {
    const res = await apiClient.get(`/projects/${projectId}/chat/search`, {
      params: { keyword },
    })
    return res.data
  }

  createProjectChatSocket({
    projectId: _projectId,
    onMessage: _onMessage,
    onError: _onError,
    host: _host = "/ws",
  }: {
    projectId: number
    onMessage?: (msg: ChatMessage) => void
    onError?: (err: unknown) => void
    host?: string
  }): SocketClient {
    // TODO: 실제 STOMP 소켓 클라이언트 구현
    throw new Error("실제 소켓 구현 필요")
  }
}

// 현재는 Mock 서비스 사용
export const chatService: ChatService = new MockChatService()

// 기존 함수들을 유지 (하위 호환성)
export async function fetchChatHistory(projectId: number, page = 0, size = 20) {
  return chatService.fetchChatHistory(projectId, page, size)
}

export async function searchChatMessages(projectId: number, keyword: string) {
  return chatService.searchChatMessages(projectId, keyword)
}
