import { ApiChatRestClient } from "@/services/chat/client/chat-rest-client"
import { ApiChatSocketClient } from "@/services/chat/client/chat-socket-client"
import type {
  ChatHistoryResponse,
  ChatSearchResponse,
  SocketClient,
  SocketClientOptions,
} from "@/types/cha-service"

export interface ChatRestClient {
  fetchChatHistory(projectId: number, page?: number, size?: number): Promise<ChatHistoryResponse>
  searchChatMessages(projectId: number, keyword: string): Promise<ChatSearchResponse>
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
