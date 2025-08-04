import { useEffect, useState } from "react"
import { useChatStore } from "@/backup/stores/chat-store"
import type { ChatMessage } from "@/backup/types/chat"
import { chatService } from "@/shared/api/chat/chat-service"

export function useChatHistory(projectId: string, pageSize = 30) {
  const { setMessages, getMessages } = useChatStore()
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 현재 프로젝트의 메시지들
  const projectMessages = getMessages(projectId)

  useEffect(() => {
    // 이미 메시지가 있으면 서버에서 다시 가져오지 않음
    if (projectMessages.length > 0) {
      setLoading(false)
      return
    }

    setHasMore(true)
    setLoading(true)
    setError(null)
    chatService.rest
      .fetchChatHistory(projectId, 0, pageSize)
      .then(res => {
        if (Array.isArray(res.content)) {
          setMessages(projectId, res.content.reverse())
          setHasMore(res.content.length === pageSize)
        } else {
          setMessages(projectId, [])
          setHasMore(false)
        }
      })
      .catch(() => {
        setError("Failed to load chat history")
      })
      .finally(() => setLoading(false))
  }, [projectId, pageSize, projectMessages.length, setMessages])

  const fetchNextPage = () => {
    if (isFetching || !hasMore) return
    setIsFetching(true)
    const nextPage = Math.floor(projectMessages.length / pageSize)
    chatService.rest
      .fetchChatHistory(projectId, nextPage, pageSize)
      .then(res => {
        if (Array.isArray(res.content) && res.content.length > 0) {
          const currentMessages = getMessages(projectId)
          setMessages(projectId, [...res.content.reverse(), ...currentMessages])
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

  // 새 메시지 추가를 위한 helper 함수
  const addMessage = (message: ChatMessage) => {
    useChatStore.getState().addMessage(projectId, message)
  }

  return {
    messages: projectMessages,
    setMessages: addMessage, // ChatsPanel에서 사용하는 setMessages를 addMessage로 매핑
    loading,
    error,
    fetchNextPage,
    hasMore,
    isFetching,
  }
}
