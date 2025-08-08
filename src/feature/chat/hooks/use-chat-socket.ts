import { useCallback, useEffect, useRef, useState } from "react"
import type { ChatMessage } from "@/shared/types/chat"
import { chatService } from "../../../entities/chat/api/chat-service.ts"
import { ApiChatSocketClient } from "../../../entities/chat/api/chat-socket-api.ts"

export interface UseChatSocketReturn {
  connected: boolean
  sendMessage: (content: string) => void
  socketError: unknown
}

interface UseChatSocketOptions {
  projectId: string
  onMessage?: (msg: ChatMessage) => void
  onError?: (err: unknown) => void
}

export function useChatSocket({ projectId, onMessage, onError }: UseChatSocketOptions) {
  const [connected, setConnected] = useState(false)
  const [socketError, setSocketError] = useState<unknown>(null)
  const socketRef = useRef<ReturnType<ApiChatSocketClient["createProjectChatSocket"]> | null>(null)
  const subscriptionRef = useRef<ReturnType<
    ReturnType<ApiChatSocketClient["createProjectChatSocket"]>["subscribe"]
  > | null>(null)
  const onMessageRef = useRef(onMessage)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])
  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const sendMessage = useCallback(
    (content: string) => {
      const socket = socketRef.current
      if (!socket || !socket.connected) {
        const error = new Error("Socket not connected")
        setSocketError(error)
        onErrorRef.current?.(error)
        return
      }
      socket.publish(`/app/projects/${projectId}/chat/talk`, content)
    },
    [projectId]
  )

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || ""
    if (!accessToken) return

    setSocketError(null)

    const apiClient = chatService.socket
    const socket = apiClient.createProjectChatSocket({
      projectId,
      onError: err => {
        setSocketError(err)
        onErrorRef.current?.(err)
      },
    })
    socketRef.current = socket

    socket.onConnect = () => {
      setConnected(true)
      setSocketError(null)
      const topicUrl = `/topic/projects/${projectId}/chat`
      // 기존 구독 해제 후 재구독
      if (subscriptionRef.current) {
        socket.unsubscribe(subscriptionRef.current)
        subscriptionRef.current = null
      }
      subscriptionRef.current = socket.subscribe(topicUrl, message => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body)
          onMessageRef.current?.(chatMessage)
        } catch {
          // 파싱 실패시 무시
        }
      })
      // ENTER 메시지는 TopBar의 useParticipantTracking에서 관리하므로 여기서는 제거
    }
    socket.onDisconnect = () => {
      setConnected(false)
    }
    socket.onStompError = err => {
      setSocketError(err)
      onErrorRef.current?.(err)
    }
    socket.onWebSocketError = err => {
      setSocketError(err)
      onErrorRef.current?.(err)
    }
    socket.activate()

    return () => {
      if (subscriptionRef.current && socketRef.current) {
        socketRef.current.unsubscribe(subscriptionRef.current)
        subscriptionRef.current = null
      }
      if (socketRef.current) {
        socketRef.current.deactivate()
        socketRef.current = null
      }
    }
  }, [projectId])

  return { connected, sendMessage, socketError } as const
}
