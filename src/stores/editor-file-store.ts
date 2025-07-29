import { create } from "zustand"

interface FileTab {
  filePath: string
}

interface FileTabStore {
  openTabs: FileTab[]
  activeTabId: string | null
  openFile: (filePath: string) => void
  closeTab: (filePath: string) => void
  closeAllTabs: () => void
  switchTab: (filePath: string) => void
  closeOtherTabs: (keepFilePath: string) => void
  closeTabsToTheRight: (fromFilePath: string) => void
}

export const useFileTabStore = create<FileTabStore>(set => ({
  activeTabId: null,

  closeAllTabs: () =>
    set(state => ({
      ...state,
      activeTabId: null,
      openTabs: [],
    })),

  closeOtherTabs: (keepFilePath: string) =>
    set(state => ({
      ...state,
      activeTabId: keepFilePath, // 남은 탭이 활성 탭
      openTabs: state.openTabs.filter(tab => tab.filePath === keepFilePath),
    })),

  closeTab: filePath =>
    set(state => {
      const tabsAfterClosing = state.openTabs.filter(tab => tab.filePath !== filePath)

      return {
        ...state,
        activeTabId:
          state.activeTabId === filePath
            ? tabsAfterClosing[tabsAfterClosing.length - 1]?.filePath || null
            : state.activeTabId,
        openTabs: tabsAfterClosing,
      }
    }),

  closeTabsToTheRight: (fromFilePath: string) =>
    set(state => {
      const currentIndex = state.openTabs.findIndex(tab => tab.filePath === fromFilePath)
      const tabsToKeep = state.openTabs.slice(0, currentIndex + 1) // 현재 탭 포함해서 왼쪽만

      return {
        ...state,
        // 활성 탭이 닫힌 탭 중에 있다면 현재 탭으로 변경
        activeTabId: tabsToKeep.some(tab => tab.filePath === state.activeTabId)
          ? state.activeTabId
          : fromFilePath,
        openTabs: tabsToKeep,
      }
    }),

  openFile: filePath =>
    set(state => {
      const isOpen = state.openTabs.some(tab => tab.filePath === filePath)

      return {
        ...state,
        activeTabId: filePath,
        openTabs: isOpen ? state.openTabs : [...state.openTabs, { filePath }],
      }
    }),
  openTabs: [],

  switchTab: filePath => set(state => ({ ...state, activeTabId: filePath })),
}))
