import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"

interface LineClickInfo {
  codeLinkMessage: string // "[main.js 25번째 줄](ide://src/main.js:25)" 형태
}

interface LineClickState {
  lastLineClick: LineClickInfo | null
  isLineSharingMode: boolean
  pendingJump: { filePath: string; lineNumber: number } | null

  /** 라인 클릭 정보 저장 (채팅 전송용) */
  setLineClick: (info: LineClickInfo) => void

  /** 채팅에서 받은 정보로 점프 실행 */
  jumpToLineFromChat: (filePath: string, lineNumber: number) => void

  /** 대기 중인 점프 요청 클리어 */
  clearPendingJump: () => void // ✅ 추가

  /** 라인 공유 모드 활성화 */
  enableLineSharingMode: () => void

  /** 라인 공유 모드 비활성화 */
  disableLineSharingMode: () => void
}

export const useLineClickStore = create<LineClickState>()(
  devtools(
    set => ({
      lastLineClick: null,
      isLineSharingMode: false,
      pendingJump: null,

      setLineClick: info => {
        console.log("💾 라인 클릭 정보 저장:", info)
        set({ lastLineClick: info }, false, "setLineClick")
      },

      jumpToLineFromChat: (filePath: string, lineNumber: number) => {
        console.log("🚀 채팅에서 점프 요청:", { filePath, lineNumber })

        // 1단계: 파일 열기
        const { openFileInEditor } = useEditorTabsStore.getState()
        openFileInEditor(filePath)

        // 2-3단계를 위해 대기 등록
        set({ pendingJump: { filePath, lineNumber } }, false, "jumpToLineFromChat")
      },

      clearPendingJump: () => {
        set({ pendingJump: null }, false, "clearPendingJump")
      },

      enableLineSharingMode: () => {
        console.log("🔴 라인 공유 모드 활성화")
        set({ isLineSharingMode: true }, false, "enableLineSharingMode")
      },

      disableLineSharingMode: () => {
        console.log("⚫ 라인 공유 모드 비활성화")
        set({ isLineSharingMode: false }, false, "disableLineSharingMode")
      },
    }),
    {
      name: "line-click-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
)
