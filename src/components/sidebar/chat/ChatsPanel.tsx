import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { useChatHistory } from "@/hooks/chat/useChatHistory"
import type { ChatMessage } from "@/types/cha-service"

interface ChatMessageListProps {
  messages: ChatMessage[]
  fetchNextPage: () => void
  hasMore: boolean
  isFetching: boolean
}

const ChatMessageList = ({
  messages,
  fetchNextPage,
  hasMore,
  isFetching,
}: ChatMessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 무한 스크롤: top 근처에서 이전 페이지 불러오기
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollTop < 100 && hasMore && !isFetching) {
        fetchNextPage()
      }
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [fetchNextPage, hasMore, isFetching])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <최신 메시지 보이기 목적, 의도적으로 messages만 의존>
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" })
    }
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-4"
    >
      {isFetching && hasMore && (
        <div className="flex justify-center py-2 text-muted-foreground text-xs">
          Loading more...
        </div>
      )}
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
  // 실제 프로젝트 ID로 교체 필요
  const projectId = 3

  const { messages, setMessages, loading, error, fetchNextPage, hasMore, isFetching } =
    useChatHistory(projectId, 30)

  // 입력은 ChatMessage 타입에 맞게 추가
  const handleSend = (msg: string) => {
    setMessages(prev => [
      ...prev,
      {
        messageType: "TALK",
        projectId,
        username: "나",
        content: msg,
        sentAt: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="flex h-full flex-col bg-[var(--background)]">
      {loading ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-red-500">{error}</div>
      ) : (
        <ChatMessageList
          messages={messages}
          fetchNextPage={fetchNextPage}
          hasMore={hasMore}
          isFetching={isFetching}
        />
      )}
      <div className="sticky bottom-0 shrink-0">
        <Separator />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
