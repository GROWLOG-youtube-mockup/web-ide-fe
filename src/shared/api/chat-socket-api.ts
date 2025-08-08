import { Client, type IMessage } from "@stomp/stompjs"
import SockJs from "sockjs-client"
import { getChatApiConfig } from "@/shared/api/chat-api.config"
import type { ChatSocketClient } from "@/shared/api/chat-service"
import type { SocketClient, SocketClientOptions } from "@/shared/types/chat"
import { SocketConnectionError, SocketConnectionState } from "@/shared/types/chat"

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
        connectionState = SocketConnectionState.Connecting
        client.activate()
      },
      publish: (destination, body) => {
        if (!connectedInternal) {
          throw new SocketConnectionError("Cannot publish message - not connected", "NOT_CONNECTED")
        }
        const payload = typeof body === "object" ? JSON.stringify(body) : body
        client.publish({ destination, body: payload })
      },
      deactivate: () => {
        client.deactivate()
        connectedInternal = false
        connectionState = SocketConnectionState.Disconnected
      },
      subscribe: (destination, callback) => {
        const subscription = client.subscribe(destination, (message: IMessage) => {
          try {
            callback(message)
          } catch (_e) {
            //
          }
        })
        return subscription
      },
      unsubscribe: subscription => {
        subscription.unsubscribe()
      },
      get connected() {
        return connectedInternal
      },
      get connectionState() {
        return connectionState
      },
      cleanup: () => {
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
    }
    client.onDisconnect = () => {
      connectedInternal = false
      connectionState = SocketConnectionState.Disconnected
      socket.onDisconnect?.()
    }
    client.onStompError = frame => {
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
      onError?.(error)
    }
    return socket
  }
}
