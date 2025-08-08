import { ApiChatRestClient } from "@/shared/api/chat-rest-api"
import { ApiChatSocketClient } from "@/shared/api/chat-socket-api"
import type {
  ChatHistoryResponse,
  ChatSearchResponse,
  SocketClient,
  SocketClientOptions,
} from "@/shared/types/chat"

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
