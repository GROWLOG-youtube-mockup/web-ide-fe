import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { ChatMessage } from "@/types/chat"

interface ChatState {
  // 프로젝트별로 메시지를 관리
  messages: Record<string, ChatMessage[]>

  // 액션들
  setMessages: (projectId: string, messages: ChatMessage[]) => void
  addMessage: (projectId: string, message: ChatMessage) => void
  clearMessages: (projectId: string) => void
  getMessages: (projectId: string) => ChatMessage[]
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      messages: {},

      setMessages: (projectId: string, messages: ChatMessage[]) => {
        set(
          state => ({
            messages: {
              ...state.messages,
              [projectId]: messages,
            },
          }),
          false,
          "setMessages"
        )
      },

      addMessage: (projectId: string, message: ChatMessage) => {
        set(
          state => ({
            messages: {
              ...state.messages,
              [projectId]: [...(state.messages[projectId] || []), message],
            },
          }),
          false,
          "addMessage"
        )
      },

      clearMessages: (projectId: string) => {
        set(
          state => ({
            messages: {
              ...state.messages,
              [projectId]: [],
            },
          }),
          false,
          "clearMessages"
        )
      },

      getMessages: (projectId: string) => {
        return get().messages[projectId] || []
      },
    }),
    {
      name: "chat-store",
    }
  )
)
