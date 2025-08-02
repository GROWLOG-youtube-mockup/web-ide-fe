import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useUserStore } from "@/stores/user-store"
import type { ChatMessage } from "@/types/chat"
import { getDateLabel, groupMessagesByDate } from "@/utils/chat-date"
import { formatTime } from "@/utils/format-time"

interface ChatMessageListProps {
  messages: ChatMessage[]
  fetchNextPage: () => void
  hasMore: boolean
  isFetching: boolean
}

// 날짜 라벨 내부 컴포넌트
const DateLabel = ({ date }: { date: string }) => (
  <div className="mb-4 flex justify-center">
    <span
      className="rounded px-3 py-1 font-semibold text-xs"
      style={{ color: "var(--muted-foreground)" }}
    >
      {getDateLabel(date)}
    </span>
  </div>
)

const ChatMessageList = ({
  messages,
  fetchNextPage,
  hasMore,
  isFetching,
}: ChatMessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const { userInfo } = useUserStore()

  useInfiniteScroll({
    itemsLength: messages.length,
    hasMore,
    isFetching,
    fetchNextPage,
    containerRef,
    endRef,
  })

  return (
    <div
      ref={containerRef}
      style={{ boxSizing: "border-box", padding: 0 }}
      className="flex h-[400px] min-h-0 flex-col gap-5 overflow-y-auto"
    >
      {isFetching && hasMore && (
        <div
          className="flex justify-center py-2 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          Loading more...
        </div>
      )}
      {groupMessagesByDate(messages).map((group, groupIdx) =>
        group.messages.map((msg, idx) => {
          const isOwnMessage = msg.userId === userInfo?.userId
          const showDateLabel = idx === 0
          return (
            <>
              {showDateLabel && <DateLabel date={msg.sentAt} key={`date-${group.date}`} />}
              <div
                className={`flex items-start gap-3 px-4 pb-4 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                key={`${msg.sentAt}-${msg.username}-${groupIdx}-${idx}`}
              >
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
                <Card
                  className="min-w-[30%] max-w-[70%] rounded-2xl py-2"
                  style={
                    isOwnMessage
                      ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                      : { background: "var(--muted)", color: "var(--card-foreground)" }
                  }
                >
                  <CardContent className="flex flex-col gap-2 px-3 py-1">
                    <div className="text-sm leading-relaxed">{msg.content}</div>
                    <div
                      className="mt-1 w-full text-right text-xs"
                      style={{
                        color: isOwnMessage
                          ? "var(--primary-foreground)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {formatTime(msg.sentAt)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )
        })
      )}
      <div ref={endRef} />
    </div>
  )
}

export default ChatMessageList
