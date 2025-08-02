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
  const accessToken = localStorage.getItem("accessToken") || ""
  // 디버깅: accessToken 값 확인
  console.info("[ChatSocket][DEBUG] accessToken:", accessToken)

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
        console.error("[ChatSocket] 메시지 전송 실패: 소켓 연결 안 됨", error)
        return
      }
      try {
        client.publish(`/app/projects/${projectId}/chat/talk`, content)
      } catch (e) {
        setSocketError(e)
        onErrorRef.current?.(e)
        console.error("[ChatSocket] 메시지 전송 중 에러", e)
      }
    },
    [projectId]
  )

  useEffect(() => {
    if (!accessToken) {
      console.warn("[ChatSocket] accessToken 없음: 소켓 연결 시도 안 함")
      return
    }
    let isMounted = true
    setSocketError(null)

    // 프론트엔드에서 실제 서버 주소로 직접 연결
    const host = "/ws"
    console.info("[ChatSocket][DEBUG] wsHost:", host)
    console.info("[ChatSocket][DEBUG] 소켓 연결 시도 중...", { projectId, host, accessToken })
    let client: SocketClient | undefined
    try {
      client = chatService.socket.createProjectChatSocket({
        projectId,
        host: host,
        onMessage: (msg: ChatMessage) => {
          if (!isMounted) return
          console.info("[ChatSocket] onMessage 수신:", msg)
          try {
            onMessageRef.current?.(msg)
          } catch (e) {
            const error = new Error(`[ChatSocket] 메시지 파싱 에러: ${e}`)
            setSocketError(error)
            onErrorRef.current?.(error)
            console.error(error)
          }
        },
        onError: (err: unknown) => {
          if (!isMounted) return
          setSocketError(err)
          onErrorRef.current?.(err)
          // 더 자세한 에러 로그 출력
          console.error("[ChatSocket] 소켓 에러 (onError 콜백)", err)
          if (err instanceof Error) {
            console.error("[ChatSocket][DEBUG] err.message:", err.message)
            console.error("[ChatSocket][DEBUG] err.stack:", err.stack)
          }
          try {
            console.error("[ChatSocket][DEBUG] err(JSON):", JSON.stringify(err))
          } catch (e) {
            console.error("[ChatSocket][DEBUG] err(JSON) 변환 실패:", e)
          }
          console.error("[ChatSocket][DEBUG] typeof err:", typeof err)
          // reason 상세
          if (err && typeof err === "object" && "reason" in err) {
            console.error("[ChatSocket][DEBUG] err.reason:", err.reason)
            console.error(
              "[ChatSocket][DEBUG] err.reason.constructor:",
              err.reason?.constructor?.name
            )
            try {
              console.error("[ChatSocket][DEBUG] err.reason(JSON):", JSON.stringify(err.reason))
            } catch (e) {
              console.error("[ChatSocket][DEBUG] err.reason(JSON) 변환 실패:", e)
            }
          }
          // 전체 트리 구조
          console.dir(err, { depth: null })
          console.error(
            "[ChatSocket][DEBUG] connected:",
            connected,
            "projectId:",
            projectId,
            "accessToken:",
            accessToken
          )
        },
        jwt: accessToken,
      })
      // 디버깅: 반환된 client 객체 확인
      console.info("[ChatSocket][DEBUG] createProjectChatSocket 반환 client:", client)
    } catch (e) {
      setSocketError(e)
      onErrorRef.current?.(e)
      console.error("[ChatSocket] 소켓 생성 실패", e)
      return
    }

    clientRef.current = client

    if (client.onConnect !== undefined) {
      client.onConnect = () => {
        if (!isMounted) return
        setConnected(true)
        setSocketError(null)
        console.info("[ChatSocket] 소켓 연결 성공 (onConnect 콜백)")
      }
    }

    if (client.onDisconnect !== undefined) {
      client.onDisconnect = () => {
        if (!isMounted) return
        setConnected(false)
        console.warn("[ChatSocket] 소켓 연결 해제됨 (onDisconnect 콜백)")
      }
    }

    client.activate()

    return () => {
      isMounted = false
      if (clientRef.current) {
        try {
          clientRef.current.deactivate()
          console.info("[ChatSocket] 소켓 정상 해제")
        } catch (error) {
          console.warn("[ChatSocket] 소켓 해제 중 에러:", error)
        } finally {
          clientRef.current = null
        }
      }
      setConnected(false)
      setSocketError(null)
    }
  }, [projectId, accessToken, connected])

  return { connected, sendMessage, socketError } as const
}
