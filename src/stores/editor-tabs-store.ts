import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface EditorTabsState {
  openedFiles: string[]
  activeFile: string | null

  /** 활성 파일 변경 */
  setActiveFile: (filePath: string) => void

  /** 파일을 에디터에서 열기 */
  openFileInEditor: (filePath: string) => void

  /** 에디터에서 파일 닫기 */
  closeTab: (filePath: string) => void

  /** 모든 탭 닫기 */
  closeAllTabs: () => void

  /** 다른 모든 탭 닫기 (지정된 파일만 유지) */
  closeOtherTabs: (keepFilePath: string) => void

  /** 오른쪽 탭들 닫기 */
  closeTabsToTheRight: (fromFilePath: string) => void
}

export const useEditorTabsStore = create<EditorTabsState>()(
  devtools(
    persist(
      (set, get): EditorTabsState => ({
        openedFiles: [],
        activeFile: null,

        openFileInEditor: (filePath: string) => {
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

        closeTab: (filePath: string) => {
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

        setActiveFile: (filePath: string) => {
          const { openedFiles } = get()
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          }
        },

        closeAllTabs: () => {
          set({
            openedFiles: [],
            activeFile: null,
          })
        },

        closeOtherTabs: (keepFilePath: string) => {
          set({
            openedFiles: [keepFilePath],
            activeFile: keepFilePath,
          })
        },

        closeTabsToTheRight: (fromFilePath: string) => {
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
