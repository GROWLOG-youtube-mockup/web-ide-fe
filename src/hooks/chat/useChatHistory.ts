import { useEffect, useState } from "react"
import { chatService } from "@/services/chat/service/chat-service"
import type { ChatMessage } from "@/types/chat"

export function useChatHistory(projectId: string, pageSize = 30) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMessages([])
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

  const fetchNextPage = () => {
    if (isFetching || !hasMore) return
    setIsFetching(true)
    const nextPage = Math.floor(messages.length / pageSize)
    chatService.rest
      .fetchChatHistory(projectId, nextPage, pageSize)
      .then(res => {
        if (Array.isArray(res.content) && res.content.length > 0) {
          setMessages(prev => [...res.content.reverse(), ...prev])
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
