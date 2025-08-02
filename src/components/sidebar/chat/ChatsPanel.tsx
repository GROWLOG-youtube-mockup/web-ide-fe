import { useCallback, useRef } from "react"
import { Separator } from "@/components/ui/separator"
import { useChatHistory } from "@/hooks/chat/useChatHistory"
import { useChatSocket } from "@/hooks/chat/useChatSocket"
import type { ChatMessage } from "@/types/chat"
import ChatInput from "./ChatInput"
import ChatMessageList from "./ChatMessageList"

export const Chats = ({ projectId }: { projectId: string }) => {
  const { messages, setMessages, loading, error, fetchNextPage, hasMore, isFetching } =
    useChatHistory(projectId, 5)

  const shouldScrollToBottomRef = useRef(false)

  const handleReceive = useCallback(
    (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg])
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
        <ChatMessageList
          messages={messages}
          fetchNextPage={fetchNextPage}
          hasMore={hasMore}
          isFetching={isFetching}
          projectId={projectId}
        />
      )}
      <div className="sticky bottom-0 shrink-0">
        <Separator />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
