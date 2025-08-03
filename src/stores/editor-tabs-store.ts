import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { FileData } from "@/types/file-explorer"

interface EditorTabsState {
  openedFiles: string[]
  activeFile: string | null
  treeData: Record<string, FileData> | null
  setActiveFile: (filePath: string) => void
  openFileInEditor: (filePath: string) => void
  closeTab: (filePath: string) => void
  closeAllTabs: () => void
  closeOtherTabs: (keepFilePath: string) => void
  closeTabsToTheRight: (fromFilePath: string) => void
  updateTreeData: (treeData: Record<string, FileData>) => void
}

export const useEditorTabsStore = create<EditorTabsState>()(
  devtools(
    persist(
      (set, get): EditorTabsState => ({
        openedFiles: [],
        activeFile: null,
        treeData: null,

        openFileInEditor: (filePath: string) => {
          const { openedFiles, treeData } = get()
          console.log("[openFileInEditor] filePath:", filePath)
          console.log("[openFileInEditor] treeData:", treeData)
          if (!treeData || !treeData[filePath]) {
            console.warn(`❌ 파일이 트리에 존재하지 않습니다: ${filePath}`)
            return
          }

          if (treeData[filePath].type !== "file") {
            console.warn(
              `❌ 해당 경로는 파일이 아닙니다: ${filePath}, type: ${treeData[filePath].type}`
            )
            return
          }
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          } else {
            set({
              activeFile: filePath,
              openedFiles: [...openedFiles, filePath],
            })
          }
          console.log("✅ Opening file in editor:", filePath)
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

        // ✅ 수정된 부분
        updateTreeData: (newTreeData: Record<string, FileData>) => {
          set(state => {
            // 1. 새 트리 데이터에 더 이상 존재하지 않는 파일들을 열린 탭 목록에서 제거합니다.
            const newOpenedFiles = state.openedFiles.filter(filePath => newTreeData[filePath])

            // 2. 현재 활성 탭이 제거되었는지 확인하고, 그렇다면 새로운 활성 탭을 지정합니다.
            let newActiveFile = state.activeFile
            if (state.activeFile && !newOpenedFiles.includes(state.activeFile)) {
              newActiveFile =
                newOpenedFiles.length > 0 ? newOpenedFiles[newOpenedFiles.length - 1] : null
            }

            return {
              treeData: newTreeData,
              openedFiles: newOpenedFiles,
              activeFile: newActiveFile,
            }
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
