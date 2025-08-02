import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

import type { ChatMessage } from "@/types/chat"

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
  const endRef = useRef<HTMLDivElement>(null)
  const isFirstLoadRef = useRef(true)

  // 최초 진입 하단 이동, 페이징 후 위치 보정 모두 하나의 useEffect에서 처리
  const prevHeightRef = useRef<number>(0)
  const prevMsgLen = useRef(messages.length)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 최초 진입 시 맨 아래로 이동
    if (isFirstLoadRef.current && endRef.current) {
      endRef.current.scrollIntoView({ block: "end" })
      isFirstLoadRef.current = false
      prevMsgLen.current = messages.length
      return
    }

    // messages가 늘어나면(페이징) 기존 위치 보정
    if (messages.length > prevMsgLen.current) {
      const diff = container.scrollHeight - prevHeightRef.current
      if (diff > 0) container.scrollTop = diff
    }
    prevMsgLen.current = messages.length
  }, [messages.length])

  // 무한 스크롤 (위로 스크롤 시 이전 메시지 로드)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !isFetching) {
        prevHeightRef.current = container.scrollHeight
        fetchNextPage()
      }
    }
    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [fetchNextPage, hasMore, isFetching])

  return (
    <div
      ref={containerRef}
      style={{ boxSizing: "border-box", padding: 0 }}
      className="flex h-[400px] min-h-0 flex-col gap-5 overflow-y-auto"
    >
      {isFetching && hasMore && (
        <div className="flex justify-center py-2 text-muted-foreground text-xs">
          Loading more...
        </div>
      )}
      {messages.map((msg, idx) => (
        <div
          className="flex items-start gap-3 px-4 pt-4"
          key={`${msg.sentAt}-${msg.username}-${idx}`}
        >
          {" "}
          {/* 메시지 wrapper에만 padding 적용 */}
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
      <div ref={endRef} />
    </div>
  )
}

export default ChatMessageList
