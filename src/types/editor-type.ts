// types/editor-type.ts

export interface FileTab {
  fileId: string
  fileName: string
  filePath: string
}

export interface SplitData {
  openTabs: FileTab[] // 이 분할창에서 열린 파일들
  activeTabId: string | null // 현재 활성화된 탭 ID
}

export type SplitsState = {
  [splitId: number]: SplitData
}

/**
 * 레이아웃 분할 기능
 */
export type SplitMode = "single" | "horizontal" | "vertical"

/**
 * 에디터 레이아웃 설정
 */
export interface LayoutConfig {
  /** 각 분할창의 크기 비율 배열 (예: [50, 50], [30, 70]) */
  sizes: number[]
}

export interface ActiveFileContentProps {
  splitId: number
  activeFile: FileTab
  isVisible?: boolean
}

export interface SplitPanelProps {
  splitId: number
  splitData: SplitData
  index: number
  mode: SplitMode
  layoutSizes: number[]
}

export interface LoadingSpinnerProps {
  message: string
}

export interface FileLoadingSpinnerProps {
  fileName: string
}

//탭 관련
export interface TabBarProps {
  splitId: number
}

export interface TabItemProps {
  tab: FileTab
  isActive: boolean
  maxWidth: number
  splitId: number
  onTabClick: (fileId: string) => void
  onTabClose: (fileId: string) => void
}

export interface TabActionsProps {
  tabs: FileTab[]
  splitId: number
  activeTabId: string | null
}

export interface TabContextMenuProps {
  show: boolean
  onClose: () => void
  onCloseTab: () => void
  onCloseOtherTabs: () => void
  onCloseAllTabs: () => void
  onDuplicateInOtherSplit: () => void
  splitMode: SplitMode
}
