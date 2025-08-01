import { useCallback, useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useChatSocket } from "@/hooks/chat/useChatSocket"
import { type ChatMessage, chatService } from "@/services/api/chat-api"

// 메시지 리스트 컴포넌트
const ChatMessageList = ({ messages }: { messages: ChatMessage[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }) // 의존성 배열 제거 - 매 렌더링마다 실행

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-4">
      {messages.map((msg, idx) => (
        <div className="flex items-start gap-3" key={`${msg.sentAt}-${msg.username}-${idx}`}>
          <Avatar>
            <AvatarImage
              src={
                msg.username
                  ? `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.username}`
                  : undefined
              }
            />
            <AvatarFallback>{msg.username?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <Card className="max-w-[100%] rounded-2xl py-3">
            <CardContent className="px-3 py-1">
              <div className="text-[var(--card-foreground)] text-sm leading-relaxed">
                {msg.content}
              </div>
              <div className="mt-1 w-full text-right text-[var(--muted-foreground)] text-xs">
                {msg.sentAt}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

// 채팅 입력 컴포넌트
const ChatInput = ({ onSend, disabled }: { onSend: (msg: string) => void; disabled?: boolean }) => {
  const [value, setValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSend(value)
      setValue("")
    }
  }

  return (
    <form
      className="flex items-center gap-2 bg-[var(--background)] px-4 py-3"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="메시지를 입력하세요..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" className="rounded-lg px-6" disabled={disabled || !value.trim()}>
        전송
      </Button>
    </form>
  )
}

export const Chats = () => {
  // TODO: 실제 프로젝트 ID로 교체 필요
  const projectId = 1

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)

  const onMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const onError = useCallback((err: unknown) => {
    console.error("채팅 소켓 에러", err)
  }, [])

  const { connected, sendMessage, socketError } = useChatSocket({
    projectId,
    onMessage,
    onError,
  })

  // 채팅 히스토리 로드
  useEffect(() => {
    setLoading(true)
    chatService
      .fetchChatHistory(projectId, 0, 30)
      .then((res: { content: ChatMessage[] }) => {
        if (Array.isArray(res.content)) {
          setMessages(res.content.reverse())
        }
      })
      .catch((err: unknown) => {
        console.error("채팅 히스토리 로드 실패:", err)
      })
      .finally(() => setLoading(false))
  }, []) // projectId는 상수이므로 의존성에서 제거

  return (
    <div className="flex h-full flex-col bg-[var(--background)]">
      {loading ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : (
        <>
          {socketError && (
            <div className="flex items-center justify-center py-2 text-red-500 text-sm">
              실시간 연결이 불안정합니다. 이전 메시지만 표시됩니다.
            </div>
          )}
          <ChatMessageList messages={messages} />
        </>
      )}
      <div className="sticky bottom-0 shrink-0">
        <Separator />
        <ChatInput onSend={sendMessage} disabled={!connected || !!socketError} />
      </div>
    </div>
  )
}
