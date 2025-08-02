import { useCallback, useEffect, useRef, useState } from "react"
import { chatService } from "@/services/chat/service/chat-service"
import type { ChatMessage, SocketClient } from "@/types/cha-service"

export interface UseChatSocketReturn {
  connected: boolean
  sendMessage: (content: string) => void
  socketError: unknown
}

interface UseChatSocketOptions {
  projectId: number
  onMessage?: (msg: ChatMessage) => void
  onError?: (err: unknown) => void
}

export function useChatSocket({ projectId, onMessage, onError }: UseChatSocketOptions) {
  const [connected, setConnected] = useState(false)
  const [socketError, setSocketError] = useState<unknown>(null)
  const clientRef = useRef<SocketClient | null>(null)
  const onMessageRef = useRef(onMessage)
  const onErrorRef = useRef(onError)

  // 최신 콜백을 ref에 저장
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const sendMessage = useCallback(
    (content: string) => {
      const client = clientRef.current
      if (!client || !client.connected) {
        const error = new Error("Socket not connected")
        setSocketError(error)
        onErrorRef.current?.(error)
        return
      }
      try {
        client.publish(`/app/projects/${projectId}/chat/talk`, content)
      } catch (e) {
        setSocketError(e)
        onErrorRef.current?.(e)
      }
    },
    [projectId]
  )

  useEffect(() => {
    let isMounted = true
    setSocketError(null)

    const wsHost = import.meta.env.PROD ? "http://15.165.2.193:8080/ws" : "/ws"
    const client = chatService.socket.createProjectChatSocket({
      projectId,
      onMessage: (msg: ChatMessage) => {
        if (!isMounted) return
        try {
          onMessageRef.current?.(msg)
        } catch (e) {
          const error = new Error(`Message parsing error: ${e}`)
          setSocketError(error)
          onErrorRef.current?.(error)
        }
      },
      onError: (err: unknown) => {
        if (!isMounted) return
        setSocketError(err)
        onErrorRef.current?.(err)
      },
      host: wsHost,
    })

    clientRef.current = client

    // Mock에서는 onConnect/onDisconnect가 undefined이므로 설정
    if (client.onConnect !== undefined) {
      client.onConnect = () => {
        if (!isMounted) return
        setConnected(true)
        setSocketError(null)
      }
    }

    if (client.onDisconnect !== undefined) {
      client.onDisconnect = () => {
        if (!isMounted) return
        setConnected(false)
      }
    }

    client.activate()

    return () => {
      isMounted = false
      if (clientRef.current) {
        try {
          clientRef.current.deactivate()
        } catch (error) {
          console.warn("Error deactivating chat socket:", error)
        } finally {
          clientRef.current = null
        }
      }
      setConnected(false)
      setSocketError(null)
    }
  }, [projectId])

  return { connected, sendMessage, socketError } as const
}
