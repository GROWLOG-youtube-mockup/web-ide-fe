import { Client, type IMessage } from "@stomp/stompjs"
import SockJs from "sockjs-client"
import { getChatApiConfig } from "@/services/chat/chat-api.config"
import type { ChatSocketClient } from "@/services/chat/service/chat-service"
import type { SocketClient, SocketClientOptions } from "@/types/chat"
import { SocketConnectionError, SocketConnectionState } from "@/types/chat"

export class ApiChatSocketClient implements ChatSocketClient {
  private readonly config: ReturnType<typeof getChatApiConfig>
  constructor(configOverrides?: Parameters<typeof getChatApiConfig>[0]) {
    this.config = getChatApiConfig(configOverrides)
  }
  createProjectChatSocket(options: SocketClientOptions): SocketClient {
    const { onError, host } = options

    const socketHost = host || this.config.socketHost
    const client = new Client({
      webSocketFactory: () => new SockJs(socketHost),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
    })

    let connectedInternal = false
    let connectionState = SocketConnectionState.Disconnected
    const socket: SocketClient = {
      activate: () => {
        console.log("[ChatSocket] activate() 호출됨")
        connectionState = SocketConnectionState.Connecting
        client.activate()
      },
      publish: (destination, body) => {
        console.log("[ChatSocket] publish() 호출", { destination, body, connectedInternal })
        if (!connectedInternal) {
          console.error("[ChatSocket] publish() 실패: 연결 안됨")
          throw new SocketConnectionError("Cannot publish message - not connected", "NOT_CONNECTED")
        }
        const payload = typeof body === "object" ? JSON.stringify(body) : body
        console.log("[ChatSocket] publish() 실제 전송 payload:", payload)
        client.publish({ destination, body: payload })
      },
      deactivate: () => {
        console.log("[ChatSocket] deactivate() 호출")
        client.deactivate()
        connectedInternal = false
        connectionState = SocketConnectionState.Disconnected
      },
      subscribe: (destination, callback) => {
        console.log(`[ChatSocket] subscribe() 호출: ${destination}`)
        const subscription = client.subscribe(destination, (message: IMessage) => {
          try {
            console.log(`[ChatSocket] 메시지 수신! destination: ${destination}`)
            console.log(`[ChatSocket] 메시지 전체:`, message)
            console.log(`[ChatSocket] 메시지 바디:`, message.body)
            callback(message)
          } catch (e) {
            console.error("[ChatSocket] subscribe 콜백 처리 중 에러:", e)
          }
        })
        console.log(`[ChatSocket] 구독 완료, subscription ID:`, subscription.id)
        return subscription
      },
      unsubscribe: subscription => {
        console.log("[ChatSocket] unsubscribe() 호출", subscription)
        subscription.unsubscribe()
      },
      get connected() {
        console.log("[ChatSocket] connected get 호출:", connectedInternal)
        return connectedInternal
      },
      get connectionState() {
        console.log("[ChatSocket] connectionState get 호출:", connectionState)
        return connectionState
      },
      cleanup: () => {
        console.log("[ChatSocket] cleanup() 호출")
        client.deactivate()
        connectedInternal = false
        connectionState = SocketConnectionState.Disconnected
      },
      onConnect: undefined,
      onDisconnect: undefined,
      onStompError: undefined,
      onWebSocketError: undefined,
      onReconnect: undefined,
    }
    client.onConnect = () => {
      console.log("[ChatSocket] ✅ 연결 성공! (onConnect)")
      connectedInternal = true
      connectionState = SocketConnectionState.Connected
      socket.onConnect?.()
    }
    client.onDisconnect = () => {
      console.log("[ChatSocket] ❌ 연결 해제됨 (onDisconnect)")
      connectedInternal = false
      connectionState = SocketConnectionState.Disconnected
      socket.onDisconnect?.()
    }
    client.onStompError = frame => {
      console.error("[ChatSocket] STOMP ERROR (onStompError) headers:", frame?.headers)
      console.error("[ChatSocket] STOMP ERROR (onStompError) body:", frame?.body)
      connectionState = SocketConnectionState.Error
      const error = new SocketConnectionError(
        "STOMP connection error",
        frame?.headers?.message || "Unknown STOMP error",
        frame
      )
      socket.onStompError?.(error)
      onError?.(error)
    }
    client.onWebSocketError = event => {
      connectionState = SocketConnectionState.Error
      const error = new SocketConnectionError("WebSocket connection error", event)
      socket.onWebSocketError?.(error)
      console.error("[ChatSocket] WebSocket ERROR (onWebSocketError):", event)
      onError?.(error)
    }
    return socket
  }
}
