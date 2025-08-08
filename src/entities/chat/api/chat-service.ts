import { ApiChatRestClient } from "@/entities/chat/api/chat-rest-api.ts"
import { ApiChatSocketClient } from "@/entities/chat/api/chat-socket-api.ts"
import type {
  ChatHistoryResponse,
  ChatSearchResponse,
  SocketClient,
  SocketClientOptions,
} from "@/shared/types/chat.ts"

export interface ChatRestClient {
  fetchChatHistory(projectId: string, page?: number, size?: number): Promise<ChatHistoryResponse>
  searchChatMessages(projectId: string, keyword: string): Promise<ChatSearchResponse>
}

export interface ChatSocketClient {
  createProjectChatSocket(options: SocketClientOptions): SocketClient
}

export class ChatService {
  constructor(
    public readonly rest = new ApiChatRestClient(),
    public readonly socket = new ApiChatSocketClient()
  ) {}
}

export const chatService = new ChatService()
