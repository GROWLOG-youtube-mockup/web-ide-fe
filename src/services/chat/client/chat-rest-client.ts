import apiClient from "@/services/api"
import type { ChatRestClient } from "@/services/chat/service/chat-service"
import type { ChatHistoryResponse, ChatSearchResponse } from "@/types/cha-service"
import { ChatApiError } from "@/types/cha-service"

export class ApiChatRestClient implements ChatRestClient {
  async fetchChatHistory(projectId: number, page = 0, size = 20): Promise<ChatHistoryResponse> {
    try {
      const res = await apiClient.get(`/projects/${projectId}/chat/history`, {
        params: { page, size },
      })
      return res.data
    } catch (error) {
      throw new ChatApiError(
        `Failed to fetch chat history for project ${projectId}`,
        "FETCH_HISTORY_ERROR",
        error
      )
    }
  }

  async searchChatMessages(projectId: number, keyword: string): Promise<ChatSearchResponse> {
    try {
      const res = await apiClient.get(`/projects/${projectId}/chat/search`, {
        params: { keyword },
      })
      return res.data
    } catch (error) {
      throw new ChatApiError(
        `Failed to search chat messages for project ${projectId}`,
        "SEARCH_ERROR",
        error
      )
    }
  }
}
