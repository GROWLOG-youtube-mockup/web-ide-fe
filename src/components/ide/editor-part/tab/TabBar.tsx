// components/Editor/TabBar.tsx
import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import type { FileTab } from "@/stores/file-store"
import { useFileStore } from "@/stores/file-store"
import { useSplitEditorStore } from "@/stores/split-editor/split-editor-store"
import { TabActions } from "./TabActions"
import { TabDragDropProvider } from "./TabDragDropProvider"
import { TabItem } from "./TabItem"

interface TabBarProps {
  panelId: string
}

interface BasePanel {
  isFocused: boolean
  openTabs?: FileTab[] // 선택적 속성으로 만들기
  activeFileId?: string | null
}

export function TabBar({ panelId = "main" }: TabBarProps) {
  const splitEditorStore = useSplitEditorStore()
  const fileStore = useFileStore()

  // 🔧 모드에 따라 다른 데이터 사용
  let tabs: FileTab[]
  let activeFileId: string | null
  let currentPanel: BasePanel

  if (fileStore.isSplitMode) {
    // 분할 모드: split-editor-store 사용
    currentPanel = splitEditorStore.panels[panelId]
    tabs = currentPanel?.openTabs || []
    activeFileId = currentPanel?.activeFileId || null
  } else {
    // 일반 모드: file-store 사용
    tabs = fileStore.openTabs
    activeFileId = fileStore.activeFileId
    currentPanel = { isFocused: true } // 일반 모드에서는 항상 포커스됨
  }

  // ==================== 탭 기본 동작 핸들러 ====================

  /**
   * 탭 클릭 시 해당 파일을 활성화
   */
  const handleTabClick = (fileId: string) => {
    if (fileStore.isSplitMode) {
      splitEditorStore.setActiveTabInPanel(panelId, fileId)
    } else {
      fileStore.setActiveTab(fileId)
    }
  }

  /**
   * 탭 닫기 (개별 탭)
   */
  const handleTabClose = (fileId: string) => {
    if (fileStore.isSplitMode) {
      splitEditorStore.closeTabInPanel(panelId, fileId)
    } else {
      fileStore.closeTab(fileId)
    }
  }

  // ==================== 탭 확장 기능 핸들러 ====================

  /**
   * 드래그 앤 드롭으로 탭 순서 변경
   * @param fromId - 이동할 탭의 파일 ID
   * @param toId - 이동 목표 위치의 파일 ID
   */
  const handleTabMove = (_fromId: string, _toId: string) => {
    //미구현
  }

  // ==================== 렌더링 ====================

  // 빈 탭 상태
  if (tabs.length === 0) {
    return (
      <div className="flex h-8">
        <div className="flex w-[150px] items-center justify-between border-zinc-400 border-r-[3px] bg-zinc-200 px-2">
          <div className="flex items-center gap-[5px]">
            <LucideIcons.fileText className={`${ICON_SIZES.sm} text-zinc-500`} />
            <span className="font-medium text-sm text-zinc-500">새 파일</span>
          </div>
        </div>
      </div>
    )
  }

  // 메인 탭바 렌더링
  return (
    <div aria-label="열린 파일 탭" className="flex h-8 ring-1 ring-blue-500" role="tablist">
      <TabDragDropProvider enabled={true} onTabMove={handleTabMove}>
        {tabs.map(tab => (
          <TabItem
            isActive={activeFileId === tab.fileId}
            isFocused={currentPanel?.isFocused || false}
            key={tab.fileId}
            maxWidth={200}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
            tab={tab}
          />
        ))}
      </TabDragDropProvider>

      <TabActions panelId={panelId} tabs={tabs} />
    </div>
  )
}
