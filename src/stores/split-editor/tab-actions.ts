// stores/split-editor/tab-actions.ts
import type { StateCreator } from "zustand"
import type { SplitEditorStore } from "../../types/editor/types"

export const createTabActions: StateCreator<
  SplitEditorStore,
  [],
  [],
  Pick<
    SplitEditorStore,
    | "openFileInPanel"
    | "openFileInFocusedPanel"
    | "closeTabInPanel"
    | "setActiveTabInPanel"
    | "closeAllTabsInPanel"
    | "closeOtherTabsInPanel"
  >
> = (set, get) => ({
  /**
   * 특정 패널의 모든 탭을 닫습니다
   * @param panelId - 패널 ID
   */
  closeAllTabsInPanel: panelId => {
    try {
      console.log("🗑️ [SplitEditor] 패널의 모든 탭 닫기:", panelId)

      const { panels } = get()
      const panel = panels[panelId]

      if (!panel) {
        console.warn("⚠️ [SplitEditor] 존재하지 않는 패널:", panelId)
        return
      }

      set(state => ({
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            activeFileId: null,
            openTabs: [],
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 모든 탭 닫기 실패:", error)
    }
  },

  /**
   * 특정 패널에서 지정된 탭을 제외한 나머지 탭들을 닫습니다
   * @param panelId - 패널 ID
   * @param keepFileId - 유지할 파일 ID
   */
  closeOtherTabsInPanel: (panelId, keepFileId) => {
    try {
      console.log("🗑️ [SplitEditor] 다른 탭들 닫기:", panelId, "keep:", keepFileId)

      const { panels } = get()
      const panel = panels[panelId]

      if (!panel) {
        console.warn("⚠️ [SplitEditor] 존재하지 않는 패널:", panelId)
        return
      }

      const keepTab = panel.openTabs.find(tab => tab.fileId === keepFileId)
      if (!keepTab) {
        console.warn("⚠️ [SplitEditor] 유지할 탭이 없음:", keepFileId)
        return
      }

      set(state => ({
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            activeFileId: keepFileId,
            openTabs: [keepTab],
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 다른 탭들 닫기 실패:", error)
    }
  },

  /**
   * 패널의 특정 탭을 닫습니다
   * @param panelId - 패널 ID
   * @param fileId - 닫을 파일 ID
   */
  closeTabInPanel: (panelId, fileId) => {
    try {
      console.log("🗑️ [SplitEditor] 패널 탭 닫기:", panelId, fileId)

      const { panels } = get()
      const panel = panels[panelId]

      if (!panel) {
        console.warn("⚠️ [SplitEditor] 존재하지 않는 패널:", panelId)
        return
      }

      const tabToClose = panel.openTabs.find(tab => tab.fileId === fileId)
      if (tabToClose?.isDirty) {
        console.warn("⚠️ [SplitEditor] 저장되지 않은 변경사항:", tabToClose.fileName)
      }

      const remainingTabs = panel.openTabs.filter(tab => tab.fileId !== fileId)

      // 다음 활성 탭 결정
      let newActiveFileId = null
      if (panel.activeFileId === fileId && remainingTabs.length > 0) {
        newActiveFileId = remainingTabs[remainingTabs.length - 1].fileId
      } else if (panel.activeFileId !== fileId) {
        newActiveFileId = panel.activeFileId
      }

      set(state => ({
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            activeFileId: newActiveFileId,
            openTabs: remainingTabs,
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 탭 닫기 실패:", error)
    }
  },

  /**
   * 포커스된 패널에 파일을 엽니다
   * @param fileId - 파일 고유 ID
   * @param fileName - 표시될 파일명
   * @param filePath - 파일 경로
   */
  openFileInFocusedPanel: (fileId, fileName, filePath) => {
    const { focusedPanelId, openFileInPanel } = get()

    if (focusedPanelId) {
      console.log("🎯 [SplitEditor] 포커스된 패널에 파일 열기:", fileName)
      openFileInPanel(focusedPanelId, fileId, fileName, filePath)
    } else {
      console.warn("⚠️ [SplitEditor] 포커스된 패널이 없음")
      openFileInPanel("main", fileId, fileName, filePath)
    }
  },
  /**
   * 특정 패널에 파일을 열고 탭으로 추가합니다
   * @param panelId - 대상 패널 ID
   * @param fileId - 파일 고유 ID
   * @param fileName - 표시될 파일명
   * @param filePath - 파일 경로
   */
  openFileInPanel: (panelId, fileId, fileName, filePath) => {
    try {
      console.log("📂 [SplitEditor] 패널에 파일 열기:", panelId, fileName)

      const { panels } = get()
      const panel = panels[panelId]

      if (!panel) {
        console.warn("⚠️ [SplitEditor] 존재하지 않는 패널:", panelId)
        return
      }

      // 이미 열린 파일인지 확인
      const existingTab = panel.openTabs.find(tab => tab.fileId === fileId)
      if (existingTab) {
        console.log("🔄 [SplitEditor] 기존 탭 활성화:", fileName)
        set(state => ({
          panels: {
            ...state.panels,
            [panelId]: {
              ...panel,
              activeFileId: fileId,
              lastFocusedAt: new Date(),
            },
          },
        }))
        return
      }

      // 새 탭 추가
      console.log("➕ [SplitEditor] 새 탭 생성:", fileName)
      set(state => ({
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            activeFileId: fileId,
            lastFocusedAt: new Date(),
            openTabs: [
              ...panel.openTabs,
              {
                fileId,
                fileName,
                filePath,
                lastModified: new Date(),
              },
            ],
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 파일 열기 실패:", error)
    }
  },

  /**
   * 패널의 활성 탭을 변경합니다
   * @param panelId - 패널 ID
   * @param fileId - 활성화할 파일 ID
   */
  setActiveTabInPanel: (panelId, fileId) => {
    try {
      console.log("👆 [SplitEditor] 패널 활성 탭 변경:", panelId, fileId)

      const { panels } = get()
      const panel = panels[panelId]

      if (!panel) {
        console.warn("⚠️ [SplitEditor] 존재하지 않는 패널:", panelId)
        return
      }

      const targetTab = panel.openTabs.find(tab => tab.fileId === fileId)
      if (!targetTab) {
        console.warn("⚠️ [SplitEditor] 패널에 해당 파일이 없음:", panelId, fileId)
        return
      }

      set(state => ({
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            activeFileId: fileId,
            lastFocusedAt: new Date(),
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 활성 탭 변경 실패:", error)
    }
  },
})
