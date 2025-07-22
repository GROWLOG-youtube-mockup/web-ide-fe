// stores/split-editor/utils-actions.ts
import type { StateCreator } from "zustand"
import type { FileTab, SplitEditorStore } from "../../types/editor/types"

export const createUtilsActions: StateCreator<
  SplitEditorStore,
  [],
  [],
  Pick<
    SplitEditorStore,
    | "getPanelByFileId"
    | "getAllOpenFiles"
    | "getPanelStats"
    | "canSplitMore"
    | "clearEmptyPanels"
    | "resetToSinglePanel"
  >
> = (set, get) => ({
  /**
   * 추가 분할이 가능한지 확인합니다 (최대 4개)
   * @returns 분할 가능 여부
   */
  canSplitMore: () => {
    const { panels } = get()
    return Object.keys(panels).length < 4
  },

  /**
   * 빈 패널들을 자동으로 정리합니다 (메인 패널 제외)
   */
  clearEmptyPanels: () => {
    console.log("🧹 [SplitEditor] 빈 패널 정리")

    const { panels, removePanel } = get()

    Object.values(panels).forEach(panel => {
      if (panel.panelId !== "main" && panel.openTabs.length === 0) {
        removePanel(panel.panelId)
      }
    })
  },

  /**
   * 모든 패널의 열린 파일 목록을 반환합니다 (중복 제거)
   * @returns 고유한 파일 목록
   */
  getAllOpenFiles: () => {
    const { panels } = get()
    const allFiles: FileTab[] = []

    Object.values(panels).forEach(panel => {
      panel.openTabs.forEach(tab => {
        if (!allFiles.some(f => f.fileId === tab.fileId)) {
          allFiles.push(tab)
        }
      })
    })

    return allFiles
  },
  /**
   * 특정 파일이 열린 패널을 찾습니다
   * @param fileId - 찾을 파일 ID
   * @returns 파일이 열린 패널 또는 null
   */
  getPanelByFileId: fileId => {
    const { panels } = get()
    return (
      Object.values(panels).find(panel => panel.openTabs.some(tab => tab.fileId === fileId)) || null
    )
  },

  /**
   * 패널 및 파일 통계를 반환합니다
   * @returns 통계 정보 객체
   */
  getPanelStats: () => {
    const { panels } = get()
    const totalPanels = Object.keys(panels).length
    let totalTabs = 0
    const uniqueFiles = new Set<string>()

    Object.values(panels).forEach(panel => {
      totalTabs += panel.openTabs.length
      panel.openTabs.forEach(tab => uniqueFiles.add(tab.fileId))
    })

    return {
      totalFiles: uniqueFiles.size,
      totalPanels,
      totalTabs,
    }
  },

  /**
   * 모든 분할을 해제하고 단일 패널로 초기화합니다
   */
  resetToSinglePanel: () => {
    try {
      console.log("🔄 [SplitEditor] 단일 패널로 리셋")

      set({
        focusedPanelId: "main",
        layout: {
          mosaicNode: null,
          panelPositions: { main: "main" },
          type: "single",
        },
        panels: {
          main: {
            activeFileId: null,
            createdAt: new Date(),
            isFocused: true,
            lastFocusedAt: new Date(),
            openTabs: [],
            panelId: "main",
          },
        },
      })
    } catch (error) {
      console.error("❌ [SplitEditor] 리셋 실패:", error)
    }
  },
})
