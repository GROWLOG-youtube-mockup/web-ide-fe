import { Client, type IMessage } from "@stomp/stompjs"
import { createConnectHeaders, getChatApiConfig, loadSockJs } from "@/services/chat/chat-api.config"
import type { ChatSocketClient } from "@/services/chat/service/chat-service"
import type { SocketClient, SocketClientOptions } from "@/types/cha-service"
import { SocketConnectionError, SocketConnectionState } from "@/types/cha-service"

export class ApiChatSocketClient implements ChatSocketClient {
  private readonly config: ReturnType<typeof getChatApiConfig>
  constructor(configOverrides?: Parameters<typeof getChatApiConfig>[0]) {
    this.config = getChatApiConfig(configOverrides)
  }
  createProjectChatSocket(options: SocketClientOptions): SocketClient {
    const { projectId, onMessage, onError, host, jwt } = options
    let SockJs: typeof import("sockjs-client") | undefined
    try {
      SockJs = loadSockJs()
    } catch (e) {
      SockJs = undefined
      console.warn("SockJS load failed, fallback to native WebSocket only.", e)
    }
    const connectHeaders = createConnectHeaders(jwt)
    const socketHost = host || this.config.socketHost
    const client = new Client({
      webSocketFactory: SockJs ? () => new SockJs(socketHost) : undefined,
      brokerURL: SockJs ? undefined : socketHost,
      connectHeaders,
      reconnectDelay: this.config.reconnectDelay,
      heartbeatIncoming: this.config.heartbeatIncoming,
      heartbeatOutgoing: this.config.heartbeatOutgoing,
    })
    let connectedInternal = false
    let connectionState = SocketConnectionState.Disconnected
    const subscriptions: Map<string, ReturnType<Client["subscribe"]>> = new Map()
    const socket: SocketClient = {
      activate: () => {
        connectionState = SocketConnectionState.Connecting
        client.activate()
      },
      publish: (destination, body) => {
        if (!connectedInternal) {
          throw new SocketConnectionError("Cannot publish message - not connected", "NOT_CONNECTED")
        }
        client.publish({ destination, body })
      },
      deactivate: () => {
        client.deactivate()
        connectedInternal = false
        connectionState = SocketConnectionState.Disconnected
      },
      subscribe: (destination, callback) => {
        const subscription = client.subscribe(destination, (message: IMessage) => {
          try {
            const body = JSON.parse(message.body)
            callback(body)
          } catch (e) {
            onError?.(new SocketConnectionError("Failed to parse message", "PARSE_ERROR", e))
          }
        })
        subscriptions.set(destination, subscription)
        return subscription
      },
      unsubscribe: subscription => {
        subscription.unsubscribe()
        for (const [dest, sub] of subscriptions.entries()) {
          if (sub === subscription) {
            subscriptions.delete(dest)
            break
          }
        }
      },
      get connected() {
        return connectedInternal
      },
      get connectionState() {
        return connectionState
      },
      cleanup: () => {
        for (const subscription of subscriptions.values()) {
          subscription.unsubscribe()
        }
        subscriptions.clear()
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
      connectedInternal = true
      connectionState = SocketConnectionState.Connected
      socket.onConnect?.()
      const topic = `/topic/projects/${projectId}/chat`
      const subscription = client.subscribe(topic, (message: IMessage) => {
        try {
          const body = JSON.parse(message.body)
          onMessage?.(body)
        } catch (e) {
          onError?.(new SocketConnectionError("Failed to parse message", "PARSE_ERROR", e))
        }
      })
      subscriptions.set(topic, subscription)
    }
    client.onDisconnect = () => {
      connectedInternal = false
      connectionState = SocketConnectionState.Disconnected
      socket.onDisconnect?.()
    }
    client.onStompError = frame => {
      console.error("[STOMP ERROR] headers:", frame?.headers)
      console.error("[STOMP ERROR] body:", frame?.body)
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
      console.error("[WebSocket ERROR]", event)
      onError?.(error)
    }
    return socket
  }
}
