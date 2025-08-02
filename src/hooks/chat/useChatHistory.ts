import { useEffect, useState } from "react"
import { chatService } from "@/services/chat/service/chat-service"
import type { ChatMessage } from "@/types/cha-service"

export function useChatHistory(projectId: number, pageSize = 30) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 최초 로딩 및 projectId 변경 시 초기화
  useEffect(() => {
    setMessages([])
    setPage(0)
    setHasMore(true)
    setLoading(true)
    setError(null)
    chatService.rest
      .fetchChatHistory(projectId, 0, pageSize)
      .then(res => {
        if (Array.isArray(res.content)) {
          setMessages(res.content.reverse())
          setHasMore(res.content.length === pageSize)
        } else {
          setMessages([])
          setHasMore(false)
        }
      })
      .catch(() => {
        setError("Failed to load chat history")
      })
      .finally(() => setLoading(false))
  }, [projectId, pageSize])

  // 다음 페이지 불러오기
  const fetchNextPage = () => {
    if (isFetching || !hasMore) return
    setIsFetching(true)
    chatService.rest
      .fetchChatHistory(projectId, page + 1, pageSize)
      .then(res => {
        if (Array.isArray(res.content) && res.content.length > 0) {
          setMessages(prev => [
            ...res.content.reverse(), // prepend
            ...prev,
          ])
          setPage(prev => prev + 1)
          setHasMore(res.content.length === pageSize)
        } else {
          setHasMore(false)
        }
      })
      .catch(() => {
        setError("Failed to load more chat history")
      })
      .finally(() => setIsFetching(false))
  }

  return { messages, setMessages, loading, error, fetchNextPage, hasMore, isFetching }
}
