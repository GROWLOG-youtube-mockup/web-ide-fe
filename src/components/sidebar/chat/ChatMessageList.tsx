import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

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

export default ChatMessageList
