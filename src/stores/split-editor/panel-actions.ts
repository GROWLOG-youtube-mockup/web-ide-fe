// stores/split-editor/panel-actions.ts
import type { StateCreator } from "zustand"
import type { SplitEditorStore } from "../../types/editor/types"

export const createPanelActions: StateCreator<
  SplitEditorStore,
  [],
  [],
  Pick<
    SplitEditorStore,
    "createPanel" | "removePanel" | "focusPanel" | "duplicatePanel" | "getFocusedPanel"
  >
> = (set, get) => ({
  /**
   * 새로운 분할 패널을 생성합니다
   * @param panelId - 생성할 패널의 고유 ID
   * @param position - 패널 위치 (기본값: 'right')
   */
  createPanel: (panelId, position = "right") => {
    try {
      console.log("➕ [SplitEditor] 패널 생성:", panelId, position)

      const { panels } = get()

      if (panels[panelId]) {
        console.warn("⚠️ [SplitEditor] 이미 존재하는 패널:", panelId)
        return
      }

      set(state => ({
        layout: {
          ...state.layout,
          panelPositions: {
            ...state.layout.panelPositions,
            [panelId]: position,
          },
        },
        panels: {
          ...state.panels,
          [panelId]: {
            activeFileId: null,
            createdAt: new Date(),
            isFocused: false,
            openTabs: [],
            panelId,
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 패널 생성 실패:", error)
    }
  },

  /**
   * 패널을 복제합니다
   * @param sourcePanelId - 원본 패널 ID
   * @param targetPanelId - 복제될 패널 ID
   */
  duplicatePanel: (sourcePanelId, targetPanelId) => {
    try {
      console.log("� [SplitEditor] 패널 복제:", sourcePanelId, "->", targetPanelId)

      const { panels, createPanel } = get()
      const sourcePanel = panels[sourcePanelId]

      if (!sourcePanel) {
        console.warn("⚠️ [SplitEditor] 원본 패널이 존재하지 않음:", sourcePanelId)
        return
      }

      createPanel(targetPanelId)

      set(state => ({
        panels: {
          ...state.panels,
          [targetPanelId]: {
            ...state.panels[targetPanelId],
            activeFileId: sourcePanel.activeFileId,
            openTabs: [...sourcePanel.openTabs],
          },
        },
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 패널 복제 실패:", error)
    }
  },

  /**
   * 특정 패널에 포커스를 설정합니다
   * @param panelId - 포커스할 패널 ID
   */
  focusPanel: panelId => {
    try {
      console.log("👆 [SplitEditor] 패널 포커스:", panelId)

      const { panels } = get()

      if (!panels[panelId]) {
        console.warn("⚠️ [SplitEditor] 존재하지 않는 패널:", panelId)
        return
      }

      set(state => ({
        focusedPanelId: panelId,
        panels: Object.fromEntries(
          Object.entries(state.panels).map(([id, panel]) => [
            id,
            {
              ...panel,
              isFocused: id === panelId,
              lastFocusedAt: id === panelId ? new Date() : panel.lastFocusedAt,
            },
          ])
        ),
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 패널 포커스 실패:", error)
    }
  },

  /**
   * 현재 포커스된 패널을 반환합니다
   * @returns 포커스된 패널 또는 null
   */
  getFocusedPanel: () => {
    const { focusedPanelId, panels } = get()
    return focusedPanelId ? panels[focusedPanelId] || null : null
  },

  /**
   * 패널을 제거합니다 (메인 패널 제외)
   * @param panelId - 제거할 패널 ID
   */
  removePanel: panelId => {
    try {
      console.log("�️ [SplitEditor] 패널 제거:", panelId)

      const { panels, focusedPanelId } = get()

      if (panelId === "main") {
        console.warn("⚠️ [SplitEditor] 메인 패널은 제거할 수 없음")
        return
      }

      const { [panelId]: _removed, ...remainingPanels } = panels
      const remainingPanelIds = Object.keys(remainingPanels)

      set(state => ({
        focusedPanelId:
          focusedPanelId === panelId ? remainingPanelIds[0] || "main" : focusedPanelId,
        layout: {
          ...state.layout,
          panelPositions: Object.fromEntries(
            Object.entries(state.layout.panelPositions).filter(([id]) => id !== panelId)
          ),
        },
        panels: remainingPanels,
      }))
    } catch (error) {
      console.error("❌ [SplitEditor] 패널 제거 실패:", error)
    }
  },
})
