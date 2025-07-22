// components/ide/editor-part/ActiveFileContent.tsx

import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { useFileStore } from "@/stores/file-store"
import { useSplitEditorStore } from "@/stores/split-editor/split-editor-store"
import { CollaborativeEditor } from "./CollaborativeEditor"

interface Props {
  panelId?: string // 분할 모드에서 특정 패널 지정용
  fallbackMessage?: string // 빈 상태 메시지 커스터마이징
  apiKey?: string // Liveblocks API 키 (환경변수로 관리 권장)
}

/**
 * 활성 파일의 에디터 컨텐츠를 렌더링하는 컴포넌트
 * - 일반 모드와 분할 모드 자동 감지
 * - 분할 모드 : 스플릿 별로 탭 별도 관리
 * - Liveblocks 실시간 협업 에디터 연동
 * - 빈 상태 처리
 */
export const ActiveFileContent = ({
  panelId,
  fallbackMessage = "파일을 선택하세요",
  apiKey = "pk_dev_lWz_vEA2Xx6PMB60x9l8v8gggPv0ttPTJ7pCvm5etnhIZXYbcsSALmQF7-qdql7G",
}: Props) => {
  // 활성 파일 정보 가져오기
  const activeFile = useFileStore(state => {
    // 분할 모드일 때
    if (state.isSplitMode) {
      const splitStore = useSplitEditorStore.getState()

      // 특정 패널이 지정된 경우
      if (panelId) {
        const panel = splitStore.panels[panelId]
        if (panel?.activeFileId) {
          return panel.openTabs.find(tab => tab.fileId === panel.activeFileId)
        }
        return null
      }

      // 포커스된 패널의 활성 파일(현재 내가 보고 있는 파일)
      const focusedPanel = splitStore.getFocusedPanel()
      if (focusedPanel?.activeFileId) {
        return focusedPanel.openTabs.find(tab => tab.fileId === focusedPanel.activeFileId)
      }
      return null
    }
    // 일반 모드 처리

    if (!state.activeFileId) return null
    return state.openTabs.find(tab => tab.fileId === state.activeFileId)
  })

  // 빈 상태 렌더링
  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center px-[34px] py-2.5">
        <div className="font-medium text-base text-black/60 tracking-tight">{fallbackMessage}</div>
      </div>
    )
  }

  // 파일 컨텐츠 렌더링
  return (
    <LiveblocksProvider publicApiKey={apiKey}>
      <RoomProvider id={`project-${activeFile.fileId}`}>
        <ClientSideSuspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-blue-500 border-b-2" />
                <div className="text-black/60 text-sm">{activeFile.fileName} 로딩 중...</div>
              </div>
            </div>
          }
        >
          <CollaborativeEditor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

// 편의를 위한 커스텀 훅
export const useActiveFile = (panelId?: string) => {
  return useFileStore(state => {
    if (state.isSplitMode && panelId) {
      const splitStore = useSplitEditorStore.getState()
      const panel = splitStore.panels[panelId]
      if (panel?.activeFileId) {
        return panel.openTabs.find(tab => tab.fileId === panel.activeFileId)
      }
      return null
    }

    if (state.isSplitMode) {
      const splitStore = useSplitEditorStore.getState()
      const focusedPanel = splitStore.getFocusedPanel()
      if (focusedPanel?.activeFileId) {
        return focusedPanel.openTabs.find(tab => tab.fileId === focusedPanel.activeFileId)
      }
      return null
    }

    if (!state.activeFileId) return null
    return state.openTabs.find(tab => tab.fileId === state.activeFileId)
  })
}
