import { useCallback } from "react"

import { Separator } from "@/components/ui/separator"
import { useChatHistory } from "@/hooks/chat/useChatHistory"
import { useChatSocket } from "@/hooks/chat/useChatSocket"
import type { ChatMessage } from "@/types/cha-service"
import ChatInput from "./ChatInput"
import ChatMessageList from "./ChatMessageList"

export const Chats = () => {
  // 실제 프로젝트 ID로 교체 필요
  const projectId = 3

  const { messages, setMessages, loading, error, fetchNextPage, hasMore, isFetching } =
    useChatHistory(projectId, 30)

  // 메시지 수신 시 바로 추가
  const handleReceive = useCallback(
    (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg])
    },
    [setMessages]
  )

  const { sendMessage, connected } = useChatSocket({
    projectId,
    onMessage: handleReceive,
  })

  const handleSend = useCallback(
    (msg: string) => {
      if (!connected) {
        alert("채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.")
        return
      }
      sendMessage(msg)
    },
    [sendMessage, connected]
  )

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
        <ChatInput onSend={handleSend} disabled={!connected} />
      </div>
    </div>
  )
}
