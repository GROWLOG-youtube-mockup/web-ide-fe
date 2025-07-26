import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface FileExplorerState {
  // 에디터에서 열린 파일들 관리 (나머지는 headless-tree가 처리)
  openedFiles: string[]
  activeFile: string | null
  openFileInEditor: (filePath: string) => void
  closeFile: (filePath: string) => void
  setActiveFile: (filePath: string) => void
}

export const useFileExplorerStore = create<FileExplorerState>()(
  devtools(
    persist(
      (set, get): FileExplorerState => ({
        activeFile: null,

        closeFile: (filePath: string) => {
          const { openedFiles, activeFile } = get()
          const newOpenedFiles = openedFiles.filter(file => file !== filePath)

          // 닫힌 파일이 활성 파일이면 다른 파일로 전환
          const newActiveFile =
            activeFile === filePath
              ? newOpenedFiles.length > 0
                ? newOpenedFiles[newOpenedFiles.length - 1]
                : null
              : activeFile

          set({
            activeFile: newActiveFile,
            openedFiles: newOpenedFiles,
          })
        },
        openedFiles: [],

        // 파일 에디터 관리
        openFileInEditor: (filePath: string) => {
          const { openedFiles } = get()

          // 이미 열린 파일이면 활성화만
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          } else {
            // 새 파일 추가하고 활성화
            set({
              activeFile: filePath,
              openedFiles: [...openedFiles, filePath],
            })
          }
          console.log("Opening file in editor:", filePath)
          console.log("Opened files in editor:", get().openedFiles)
        },

        setActiveFile: (filePath: string) => {
          const { openedFiles } = get()
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          }
        },
      }),
      {
        name: "file-explorer-store",
        partialize: state => ({
          activeFile: state.activeFile,
          openedFiles: state.openedFiles,
        }),
      }
    ),
    { name: "file-explorer-store" }
  )
)
