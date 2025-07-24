import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { FileTab, LayoutConfig, SplitMode, SplitsState } from "@/types/editor-type"

/**
 * 스플릿 에디터 상태 관리 인터페이스 (최소 기능)
 * 파일 열기만 남겼습니다.
 */
interface SplitEditorStore {
  // === 상태 ===
  splitMode: SplitMode
  focusedSplitId: number
  splits: SplitsState
  layout: LayoutConfig

  // === 필수 액션 ===
  openFile: (fileId: string, fileName: string, filePath: string, targetSplitId?: number) => void
}

const initialState = {
  focusedSplitId: 1,
  layout: {
    sizes: [100],
  } as LayoutConfig,
  splitMode: "single" as SplitMode,
  splits: {
    1: {
      activeTabId: null,
      openTabs: [],
    },
  } as SplitsState,
}

export const useSplitEditorStore = create<SplitEditorStore>()(
  devtools(
    set => ({
      ...initialState,

      openFile: (fileId, fileName, filePath, targetSplitId) => {
        set(state => {
          const splitId = targetSplitId || state.focusedSplitId
          const targetSplit = state.splits[splitId]

          const existingTab = targetSplit.openTabs.find(tab => tab.fileId === fileId)

          if (existingTab) {
            return {
              ...state,
              splits: {
                ...state.splits,
                [splitId]: {
                  ...targetSplit,
                  activeTabId: fileId,
                },
              },
            }
          }

          const newTab: FileTab = { fileId, fileName, filePath }
          return {
            ...state,
            splits: {
              ...state.splits,
              [splitId]: {
                ...targetSplit,
                activeTabId: fileId,
                openTabs: [...targetSplit.openTabs, newTab],
              },
            },
          }
        })
      },
    }),
    { name: "SplitEditorStore" }
  )
)
