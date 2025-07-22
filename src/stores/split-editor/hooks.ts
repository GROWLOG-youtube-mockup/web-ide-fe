// stores/split-editor/hooks.ts
import { useSplitEditorStore } from "./split-editor-store"

/**
 * 현재 포커스된 패널 정보를 가져오는 훅
 * @returns 포커스된 패널 또는 null
 */
export const useFocusedPanel = () => {
  return useSplitEditorStore(state => state.getFocusedPanel())
}

/**
 * 특정 패널의 탭 목록을 가져오는 훅
 * @param panelId - 패널 ID
 * @returns 패널의 탭 목록
 */
export const usePanelTabs = (panelId: string) => {
  return useSplitEditorStore(state => state.panels[panelId]?.openTabs || [])
}

/**
 * 특정 패널의 활성 파일을 가져오는 훅
 * @param panelId - 패널 ID
 * @returns 활성 파일 또는 null
 */
export const useActivePanelFile = (panelId: string) => {
  return useSplitEditorStore(state => {
    const panel = state.panels[panelId]
    if (!panel?.activeFileId) return null
    return panel.openTabs.find(tab => tab.fileId === panel.activeFileId) || null
  })
}

/**
 * 패널 존재 여부를 확인하는 훅
 * @param panelId - 패널 ID
 * @returns 패널 존재 여부
 */
export const usePanelExists = (panelId: string) => {
  return useSplitEditorStore(state => !!state.panels[panelId])
}

/**
 * 분할 에디터 통계를 가져오는 훅
 * @returns 패널/탭/파일 통계
 */
export const useSplitStats = () => {
  return useSplitEditorStore(state => state.getPanelStats())
}

/**
 * 추가 분할 가능 여부를 확인하는 훅
 * @returns 분할 가능 여부
 */
export const useCanSplitMore = () => {
  return useSplitEditorStore(state => state.canSplitMore())
}

/**
 * 현재 레이아웃 타입을 가져오는 훅
 * @returns 현재 분할 타입
 */
export const useCurrentLayout = () => {
  return useSplitEditorStore(state => state.layout.type)
}

/**
 * 특정 파일이 열린 모든 패널을 가져오는 훅
 * @param fileId - 파일 ID
 * @returns 해당 파일이 열린 패널 목록
 */
export const usePanelsWithFile = (fileId: string) => {
  return useSplitEditorStore(state =>
    Object.values(state.panels).filter(panel => panel.openTabs.some(tab => tab.fileId === fileId))
  )
}
