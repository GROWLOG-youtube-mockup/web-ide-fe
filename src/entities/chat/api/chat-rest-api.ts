import type { ChatRestClient } from "@/entities/chat/api/chat-service.ts"
import apiClient from "@/shared/api/api-client.ts"
import type { ChatHistoryResponse, ChatSearchResponse } from "@/shared/types/chat.ts"
import { ChatApiError } from "@/shared/types/chat.ts"

export class ApiChatRestClient implements ChatRestClient {
  async fetchChatHistory(projectId: string, page = 0, size = 30): Promise<ChatHistoryResponse> {
    try {
      const res = await apiClient.get(`/projects/${projectId}/chat/history`, {
        params: { page, size },
      })
      return res.data
    } catch (error) {
      console.error("[ApiChatRestClient] fetchChatHistory 에러", error)
      throw new ChatApiError(
        `Failed to fetch chat history for project ${projectId}`,
        "FETCH_HISTORY_ERROR",
        error
      )
    }
  }

  async searchChatMessages(projectId: string, keyword: string): Promise<ChatSearchResponse> {
    try {
      const res = await apiClient.get(`/projects/${projectId}/chat/search`, {
        params: { keyword },
      })
      return res.data
    } catch (error) {
      console.error("[ApiChatRestClient] searchChatMessages 에러", error)
      throw new ChatApiError(
        `Failed to search chat messages for project ${projectId}`,
        "SEARCH_ERROR",
        error
      )
    }
  }
}
