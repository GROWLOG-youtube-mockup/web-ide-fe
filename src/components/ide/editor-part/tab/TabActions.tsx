// components/Editor/TabActions.tsx
import { useState } from "react"
import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { useFileStore } from "@/stores/file-store" // 추가
import { useSplitEditorStore } from "@/stores/split-editor/split-editor-store"

interface Props {
  tabs: FileTab[]
  panelId?: string
}

interface FileTab {
  fileId: string
  fileName: string
  filePath: string
}

export function TabActions({ tabs, panelId }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const editorStore = useSplitEditorStore()
  const fileStore = useFileStore() // 추가

  const currentPanel = panelId ? editorStore.panels[panelId] : undefined
  const activeFileId = fileStore.isSplitMode ? currentPanel?.activeFileId : fileStore.activeFileId

  if (tabs.length <= 1) return null

  return (
    <div className="relative flex items-center border-zinc-300 border-l bg-zinc-50 px-2">
      <button
        className="rounded p-1 hover:bg-zinc-200"
        onClick={() => setShowMenu(!showMenu)}
        title="탭 액션"
        type="button"
      >
        <LucideIcons.moreHorizontal className={`${ICON_SIZES.sm} text-zinc-600`} />
      </button>

      {showMenu && (
        <>
          <div className="absolute top-full right-0 z-50 min-w-[160px] rounded border bg-white py-1 shadow-lg">
            {/* 모든 탭 닫기 */}
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-100"
              onClick={() => {
                if (fileStore.isSplitMode) {
                  if (panelId) {
                    editorStore.closeAllTabsInPanel(panelId)
                  }
                } else {
                  fileStore.clearAllTabs()
                }
                setShowMenu(false)
              }}
              type="button"
            >
              모든 탭 닫기
            </button>

            {/* 다른 탭 닫기 */}
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-100"
              onClick={() => {
                if (activeFileId) {
                  if (fileStore.isSplitMode) {
                    if (panelId) {
                      editorStore.closeOtherTabsInPanel(panelId, activeFileId)
                    }
                  } else {
                    // 일반 모드에서 다른 탭들 닫기
                    const otherTabs = tabs.filter(tab => tab.fileId !== activeFileId)
                    otherTabs.forEach(tab => {
                      fileStore.closeTab(tab.fileId)
                    })
                  }
                }
                setShowMenu(false)
              }}
              type="button"
            >
              다른 탭 닫기
            </button>
          </div>

          <button className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} type="button" />
        </>
      )}
    </div>
  )
}
