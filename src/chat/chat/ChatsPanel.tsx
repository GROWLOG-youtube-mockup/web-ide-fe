import { useCallback, useRef } from "react"
import { useLineClickStore } from "@/backup/stores/line-click-store"
import type { ChatMessage } from "@/backup/types/chat"
import { toParsedChatMessage } from "@/backup/utils/chat-parser"
import ChatInput from "@/chat/chat/ChatInput"
import ChatMessageList from "@/chat/chat/ChatMessageList"
import { useChatHistory } from "@/chat/hooks/chat/useChatHistory"
import { useChatSocket } from "@/chat/hooks/chat/useChatSocket"
import { Separator } from "@/shared/ui/separator"

export const Chats = ({ projectId }: { projectId: string }) => {
  const { messages, setMessages, loading, error, fetchNextPage, hasMore, isFetching } =
    useChatHistory(projectId, 30)

  const shouldScrollToBottomRef = useRef(false)

  const handleReceive = useCallback(
    (msg: ChatMessage) => {
      setMessages(msg) // 이제 단일 메시지를 추가하는 방식
    },
    [setMessages]
  )

  const { sendMessage } = useChatSocket({
    projectId,
    onMessage: handleReceive,
  })

  const handleSend = useCallback(
    (msg: string) => {
      sendMessage(msg)
      shouldScrollToBottomRef.current = true
    },
    [sendMessage]
  )

  const { jumpToLineFromChat } = useLineClickStore()

  const handleCodeLinkClick = (filePath: string, lineNumber: number) => {
    jumpToLineFromChat(filePath, lineNumber)
  }

  // Only scroll to bottom if a new message was sent by the user
  const shouldScrollToBottom = shouldScrollToBottomRef.current
  if (shouldScrollToBottom) {
    shouldScrollToBottomRef.current = false
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
        <>
          <ChatMessageList
            messages={messages.map(toParsedChatMessage)}
            fetchNextPage={fetchNextPage}
            hasMore={hasMore}
            isFetching={isFetching}
            projectId={projectId}
            onCodeLinkClick={handleCodeLinkClick}
          />
          <div className="sticky bottom-0 shrink-0">
            <Separator />
            <ChatInput onSend={handleSend} />
          </div>
        </>
      )}
    </div>
  )
}
