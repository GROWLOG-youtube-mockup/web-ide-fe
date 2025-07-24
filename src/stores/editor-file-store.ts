import { create } from "zustand"

interface FileTab {
  filePath: string
}

interface FileTabStore {
  openTabs: FileTab[]
  activeTabId: string | null
  openFile: (filePath: string) => void
  closeTab: (filePath: string) => void
  switchTab: (filePath: string) => void
}

export const useFileTabStore = create<FileTabStore>(set => ({
  activeTabId: null,

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
