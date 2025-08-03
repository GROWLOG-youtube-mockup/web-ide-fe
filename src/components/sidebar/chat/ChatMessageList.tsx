import { useMemo, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useProjectMembers } from "@/hooks/permissions/useProjectMembers"
import { useDelayedLoading } from "@/hooks/useDelayedLoading"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useUserStore } from "@/stores/user-store"
import type { ParsedChatMessage } from "@/types/chat"
import { getDateLabel, groupMessagesByDateWithParsedContent } from "@/utils/chat-parser"
import { formatTime } from "@/utils/format-time"
import ChatMessageContent from "./ChatMessageContent"

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

interface ChatMessageListProps {
  messages: ParsedChatMessage[]
  fetchNextPage: () => void
  hasMore: boolean
  isFetching: boolean
  projectId: string
  onCodeLinkClick?: (filePath: string, lineNumber: number) => void
}

const ChatMessageList = ({
  messages,
  fetchNextPage,
  hasMore,
  isFetching,
  projectId,
  onCodeLinkClick,
}: ChatMessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const { userInfo } = useUserStore()
  const { data: members } = useProjectMembers(projectId)

  // userId(number)를 키로 하는 프로필 이미지 Map 생성
  const profileImageMap = useMemo(() => {
    return new Map(
      members?.map(member => [
        Number(member.userId), // string을 number로 변환
        member.profileImageUrl,
      ])
    )
  }, [members])

  // 500ms 이상 fetch가 지속될 때만 로딩 표시 (커스텀 훅 사용)
  const delayedLoading = useDelayedLoading(isFetching, 500)

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
      {delayedLoading && hasMore && (
        <div
          className="flex justify-center py-2 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          Loading more...
        </div>
      )}
      {groupMessagesByDateWithParsedContent(messages).map((group, groupIdx, groupsArr) =>
        group.messages.map((msg, idx) => {
          const isOwnMessage = msg.userId === userInfo?.userId
          const isLastGroup = groupIdx === groupsArr.length - 1
          // 마지막 그룹이면 hasMore === false일 때만, 그 외 그룹은 항상 첫 메시지 위에 날짜 라벨
          const showDateLabel = idx === 0 && (!isLastGroup || (isLastGroup && !hasMore))

          // 프로필 이미지 가져오기
          const profileImage = msg.userId ? profileImageMap.get(msg.userId) : null
          const fallbackImage = msg.username
            ? `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.username}`
            : undefined

          return (
            <>
              {showDateLabel && <DateLabel date={msg.sentAt} key={`date-${group.date}`} />}
              <div
                className={`flex items-start gap-3 px-2 pb-4 ${
                  isOwnMessage ? "flex-row-reverse" : ""
                }`}
                key={`${msg.sentAt}-${msg.username}-${groupIdx}-${idx}`}
              >
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage src={profileImage || fallbackImage} />
                  <AvatarFallback>{msg.username?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <Card
                  className="min-w-[30%] max-w-[70%] rounded-2xl py-2"
                  style={
                    isOwnMessage
                      ? {
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }
                      : {
                          background: "var(--muted)",
                          color: "var(--card-foreground)",
                        }
                  }
                >
                  <CardContent className="flex flex-col gap-2 px-3 py-1">
                    <div className="text-sm leading-relaxed">
                      {msg.parts ? (
                        <ChatMessageContent parts={msg.parts} onCodeLinkClick={onCodeLinkClick} />
                      ) : (
                        msg.content
                      )}
                    </div>
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
