// stores/split-editor/types.ts
import type { MosaicNode } from "react-mosaic-component"

export interface FileTab {
  fileId: string
  fileName: string
  filePath: string
  isDirty?: boolean
  isPinned?: boolean
  lastModified?: Date
}

export interface SplitPanel {
  panelId: string
  openTabs: FileTab[]
  activeFileId: string | null
  isFocused: boolean
  createdAt: Date
  lastFocusedAt?: Date
}

export type SplitType = "single" | "vertical" | "horizontal" | "quad"
export type PanelPosition = "main" | "right" | "bottom" | "bottom-right"

export interface SplitLayout {
  type: SplitType
  mosaicNode: MosaicNode<string> | null
  panelPositions: Record<string, PanelPosition>
}

export interface SplitEditorStore {
  // State
  panels: Record<string, SplitPanel>
  focusedPanelId: string | null
  layout: SplitLayout

  // Panel Actions
  createPanel: (panelId: string, position?: PanelPosition) => void
  removePanel: (panelId: string) => void
  focusPanel: (panelId: string) => void
  duplicatePanel: (sourcePanelId: string, targetPanelId: string) => void

  // Layout Actions
  setSplitType: (type: SplitType) => void
  updateMosaicNode: (node: MosaicNode<string> | null) => void
  splitPanelVertical: (panelId: string) => void
  splitPanelHorizontal: (panelId: string) => void
  createQuadLayout: () => void

  // Tab Actions

  openFileInPanel: (panelId: string, fileId: string, fileName: string, filePath: string) => void

  openFileInFocusedPanel: (fileId: string, fileName: string, filePath: string) => void
  closeTabInPanel: (panelId: string, fileId: string) => void
  setActiveTabInPanel: (panelId: string, fileId: string) => void
  moveTabBetweenPanels: (fileId: string, fromPanelId: string, toPanelId: string) => void
  updateFileInAllPanels: (fileId: string, updates: Partial<FileTab>) => void
  closeFileInAllPanels: (fileId: string) => void
  duplicateTabToPanel: (fileId: string, sourcePanelId: string, targetPanelId: string) => void

  closeAllTabsInPanel: (panelId: string) => void
  closeOtherTabsInPanel: (panelId: string, keepFileId: string) => void

  // Utils
  getFocusedPanel: () => SplitPanel | null
  getPanelByFileId: (fileId: string) => SplitPanel | null
  getAllOpenFiles: () => FileTab[]
  getPanelStats: () => {
    totalPanels: number
    totalTabs: number
    totalFiles: number
  }
  canSplitMore: () => boolean
  clearEmptyPanels: () => void
  resetToSinglePanel: () => void
}
