import { useSplitEditorStore } from "@/stores/split-editor-store"
import type { SplitPanelProps } from "@/types/editor-type"
import { ActiveFileContent } from "./ActiveFileContent"

// import { TabBar } from "./tab/TabBar";

const SplitPanel = ({ splitId, splitData, index, mode, layoutSizes }: SplitPanelProps) => {
  const isFocused = useSplitEditorStore(state => state.focusedSplitId === splitId)

  return (
    <div
      className={`flex flex-col bg-zinc-300 transition-all duration-200 ${
        isFocused ? "ring-2 ring-blue-400" : "ring-1 ring-gray-300"
      }`}
      style={{
        flex: mode === "single" ? 1 : `0 0 ${layoutSizes[index] || 50}%`,
      }}
    >
      {/*/ TODO : 탭바 */}

      <div className="editor-content-area relative w-full flex-1 overflow-hidden bg-neutral-50">
        {splitData.openTabs.length === 0 ? (
          <div className="flex h-full items-center justify-center px-[34px] py-2.5">
            <div
              className={`font-medium text-base tracking-tight ${
                isFocused ? "text-blue-600/80" : "text-black/60"
              }`}
            >
              파일을 선택하세요
            </div>
          </div>
        ) : (
          splitData.openTabs.map(tab => (
            <ActiveFileContent
              activeFile={tab}
              isVisible={tab.fileId === splitData.activeTabId}
              key={`${splitId}-${tab.fileId}`}
              splitId={splitId}
            />
          ))
        )}
      </div>
    </div>
  )
}

export const SplitEditorContainer = () => {
  //스토어 연동 잠시 todo로
  const { splitMode: mode, splits, layout } = useSplitEditorStore()

  return (
    <main aria-label="코드 에디터" className="flex w-full flex-1 flex-row">
      {Object.entries(splits).map(([splitId, splitData], index) => (
        <SplitPanel
          index={index}
          key={splitId}
          layoutSizes={layout.sizes}
          mode={mode}
          splitData={splitData}
          splitId={Number(splitId)}
        />
      ))}
    </main>
  )
}
