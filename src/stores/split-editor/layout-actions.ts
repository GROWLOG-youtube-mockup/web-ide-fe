// stores/split-editor/layout-actions.ts
import type { StateCreator } from "zustand"
import type { SplitEditorStore } from "../../types/editor/types"

export const createLayoutActions: StateCreator<
  SplitEditorStore,
  [],
  [],
  Pick<
    SplitEditorStore,
    | "setSplitType"
    | "updateMosaicNode"
    | "splitPanelVertical"
    | "splitPanelHorizontal"
    | "createQuadLayout"
  >
> = (set, get) => ({
  /**
   * 4분할 레이아웃을 생성합니다
   */
  createQuadLayout: () => {
    try {
      console.log("⬜ [SplitEditor] 4분할 레이아웃 생성")

      const { createPanel, setSplitType } = get()

      createPanel("top-right", "right")
      createPanel("bottom-left", "bottom")
      createPanel("bottom-right", "bottom-right")

      setSplitType("quad")
    } catch (error) {
      console.error("❌ [SplitEditor] 4분할 생성 실패:", error)
    }
  },
  /**
   * 분할 타입을 변경합니다
   * @param type - 분할 타입 ('single' | 'vertical' | 'horizontal' | 'quad')
   */
  setSplitType: type => {
    console.log("🔄 [SplitEditor] 분할 타입 변경:", type)

    set(state => ({
      layout: {
        ...state.layout,
        type,
      },
    }))
  },

  /**
   * 패널을 가로로 분할합니다
   * @param panelId - 분할할 기준 패널 ID
   */
  splitPanelHorizontal: panelId => {
    try {
      console.log("↕️ [SplitEditor] 가로 분할:", panelId)

      const { createPanel, setSplitType } = get()
      const newPanelId = `${panelId}-bottom`

      createPanel(newPanelId, "bottom")
      setSplitType("horizontal")
    } catch (error) {
      console.error("❌ [SplitEditor] 가로 분할 실패:", error)
    }
  },

  /**
   * 패널을 세로로 분할합니다
   * @param panelId - 분할할 기준 패널 ID
   */
  splitPanelVertical: panelId => {
    try {
      console.log("↔️ [SplitEditor] 세로 분할:", panelId)

      const { createPanel, setSplitType } = get()
      const newPanelId = `${panelId}-right`

      createPanel(newPanelId, "right")
      setSplitType("vertical")
    } catch (error) {
      console.error("❌ [SplitEditor] 세로 분할 실패:", error)
    }
  },

  /**
   * React Mosaic 노드를 업데이트합니다
   * @param node - 새로운 Mosaic 노드
   */
  updateMosaicNode: node => {
    console.log("🏗️ [SplitEditor] Mosaic 노드 업데이트")

    set(state => ({
      layout: {
        ...state.layout,
        mosaicNode: node,
      },
    }))
  },
})
