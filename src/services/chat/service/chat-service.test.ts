import { beforeEach, describe, expect, it } from "vitest"
import { type ChatMessage, SocketConnectionState } from "@/types/chat"
import { ApiChatSocketClient } from "../client/chat-socket-client"

// .env.test 파일에서 환경변수 로드
const TEST_JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzU0MTQzMDM3LCJleHAiOjE3NTQxNDY2Mzd9.rYHGxbwsRR-WuF-Mr7DZgQyM-iUFa5LC7bUKAjk2wAQ"
const TEST_PROJECT_ID = "3"
// 테스트에서는 프록시가 아닌 실제 주소를 사용해야 함
const WS_HOST = "http://15.165.2.193:8080/ws"

describe("ApiChatSocketClient WebSocket", () => {
  let socketClient: ApiChatSocketClient

  beforeEach(() => {
    socketClient = new ApiChatSocketClient()
  })

  it("실제 서버와 연결/구독/발행/수신 통합 테스트", async () => {
    expect(TEST_JWT_TOKEN, "토큰 없음").toBeTruthy()
    const received: ChatMessage[] = []
    const errors: Error[] = []
    const socket = socketClient.createProjectChatSocket({
      projectId: TEST_PROJECT_ID,
      host: WS_HOST,
      jwt: TEST_JWT_TOKEN,
      onMessage: (msg: ChatMessage) => {
        received.push(msg)
      },
      onError: (err: unknown) => {
        errors.push(err as Error)
        // onError 발생 시 테스트 즉시 실패 처리
        expect(err, `WebSocket onError 발생: ${(err as Error).message}`).toBeUndefined()
      },
    })

    // 연결
    socket.activate()

    // 연결 대기 (최대 5초)
    let tries = 0
    while (socket.connectionState !== SocketConnectionState.Connected && tries < 50) {
      await new Promise(res => setTimeout(res, 100))
      tries++
    }

    console.log("WebSocket 연결 상태:", socket.connectionState)

    expect(socket.connected, `WebSocket 연결 실패: ${socket.connectionState}`).toBe(true)

    const testMsg = `message_${Date.now()}`

    // 메시지 발행
    socket.publish(`/app/projects/${TEST_PROJECT_ID}/chat/talk`, testMsg)

    // 메시지 수신 대기 (최대 5초)
    let found = false
    for (let i = 0; i < 50; i++) {
      found = received.some(m => m.content === testMsg)
      if (found) break
      await new Promise(res => setTimeout(res, 100))
    }
    expect(found, "메시지 수신 실패").toBe(true)

    socket.deactivate()
    expect(socket.connected, "WebSocket 연결 해제 실패").toBe(false)
  }, 15000)
})
