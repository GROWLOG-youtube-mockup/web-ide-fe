import * as dotenv from "dotenv"
import { beforeEach, describe, expect, it } from "vitest"
import { type ChatMessage, SocketConnectionState } from "@/types/cha-service"
import { ApiChatSocketClient } from "../client/chat-socket-client"

// .env.test 파일에서 환경변수 로드
dotenv.config({ path: ".env.test" })
const TEST_JWT_TOKEN = process.env.TEST_JWT_TOKEN || ""
const TEST_PROJECT_ID = process.env.TEST_PROJECT_ID ? Number(process.env.TEST_PROJECT_ID) : 1

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
