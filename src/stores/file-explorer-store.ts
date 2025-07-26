import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface FileExplorerState {
  // === 에디터 탭 관리 ===
  /** 에디터에서 현재 열린 파일 경로들 */
  openedFiles: string[]
  /** 현재 활성화된 파일 경로 */
  activeFile: string | null
  /** 파일을 에디터에서 열기 */
  openFileInEditor: (filePath: string) => void
  /** 에디터에서 파일 닫기 */
  closeFile: (filePath: string) => void
  /** 활성 파일 변경 */
  setActiveFile: (filePath: string) => void

  // === 폴더 트리 상태 관리 ===
  /** 확장된 폴더들의 ID 목록 (브라우저 새로고침 시에도 유지) */
  expandedItems: string[]
  /** 폴더 확장 상태 업데이트 */
  setExpandedItems: (expandedItems: string[]) => void
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
        expandedItems: [],
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

          // TODO: 실제 에디터에서 파일 열기 로직 추가
          console.log("Opening file in editor:", filePath)
          console.log("Opened files in editor:", get().openedFiles)
        },

        setActiveFile: (filePath: string) => {
          const { openedFiles } = get()
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          }
        },

        setExpandedItems: (expandedItems: string[]) => {
          set({ expandedItems })
        },
      }),
      {
        name: "file-explorer-store",
        partialize: state => ({
          activeFile: state.activeFile,
          expandedItems: state.expandedItems,
          openedFiles: state.openedFiles,
        }),
      }
    ),
    { name: "file-explorer-store" }
  )
)
