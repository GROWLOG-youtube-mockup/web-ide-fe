import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface EditorTabsState {
  openedFiles: string[]
  activeFile: string | null

  /** 파일을 에디터에서 열기 */
  handleOpenFileInEditor: (filePath: string) => void

  /** 활성 파일 변경 */
  handleSetActiveFile: (filePath: string) => void

  /** 에디터에서 파일 닫기 */
  handleCloseTab: (filePath: string) => void

  /** 모든 탭 닫기 */
  handleCloseAllTabs: () => void

  /** 다른 모든 탭 닫기 (지정된 파일만 유지) */
  handleCloseOtherTabs: (keepFilePath: string) => void

  /** 오른쪽 탭들 닫기 */
  handleCloseTabsToTheRight: (fromFilePath: string) => void
}

export const useEditorTabsStore = create<EditorTabsState>()(
  devtools(
    persist(
      (set, get): EditorTabsState => ({
        openedFiles: [],
        activeFile: null,

        handleOpenFileInEditor: (filePath: string) => {
          const { openedFiles } = get()
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          } else {
            set({
              activeFile: filePath,
              openedFiles: [...openedFiles, filePath],
            })
          }
          console.log("Opening file in editor:", filePath)
        },

        handleCloseTab: (filePath: string) => {
          const { openedFiles, activeFile } = get()
          const newOpenedFiles = openedFiles.filter(file => file !== filePath)

          if (activeFile !== filePath) {
            set({ openedFiles: newOpenedFiles })
            return
          }

          const newActiveFile =
            newOpenedFiles.length > 0 ? newOpenedFiles[newOpenedFiles.length - 1] : null

          set({
            activeFile: newActiveFile,
            openedFiles: newOpenedFiles,
          })
        },

        handleSetActiveFile: (filePath: string) => {
          const { openedFiles } = get()
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          }
        },

        handleCloseAllTabs: () => {
          set({
            openedFiles: [],
            activeFile: null,
          })
        },

        handleCloseOtherTabs: (keepFilePath: string) => {
          set({
            openedFiles: [keepFilePath],
            activeFile: keepFilePath,
          })
        },

        handleCloseTabsToTheRight: (fromFilePath: string) => {
          const { openedFiles, activeFile } = get()
          const currentIndex = openedFiles.findIndex(file => file === fromFilePath)

          if (currentIndex === -1) return

          const filesToKeep = openedFiles.slice(0, currentIndex + 1)

          set({
            openedFiles: filesToKeep,
            activeFile: activeFile && filesToKeep.includes(activeFile) ? activeFile : fromFilePath,
          })
        },
      }),
      {
        name: "editor-tabs-store",
        partialize: state => ({
          activeFile: state.activeFile,
          openedFiles: state.openedFiles,
        }),
      }
    ),
    { name: "editor-tabs-store" }
  )
)
