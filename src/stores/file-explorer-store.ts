import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface FileExplorerState {
  // Folder expanded states - 파일 탐색기에서 폴더가 열려있는지 상태
  folderExpanded: Record<string, boolean>
  setFolderExpanded: (path: string, expanded: boolean) => void
  toggleFolderExpanded: (path: string) => void

  // 파일 탐색기에서 파일이 선택되었는지 상태
  selectedItemInExplorer: string | null
  setSelectedItemInExplorer: (path: string | null) => void

  // 파일을 에디터에서 여는 함수
  openFileInEditor: (filePath: string) => void
}

export const useFileExplorerStore = create<FileExplorerState>()(
  devtools(
    persist(
      (set): FileExplorerState => ({
        folderExpanded: {},

        openFileInEditor: (filePath: string) => {
          set({ selectedItemInExplorer: filePath })

          // TODO: 에디터 스토어와 연동
          console.log("Opening file in editor:", filePath)
        },
        selectedItemInExplorer: null,

        setFolderExpanded: (path: string, expanded: boolean) =>
          set(state => ({
            folderExpanded: { ...state.folderExpanded, [path]: expanded },
          })),

        setSelectedItemInExplorer: (path: string | null) => set({ selectedItemInExplorer: path }),

        toggleFolderExpanded: (path: string) =>
          set(state => ({
            folderExpanded: {
              ...state.folderExpanded,
              [path]: !state.folderExpanded[path],
            },
          })),
      }),
      {
        name: "file-explorer-store",
        partialize: state => ({
          folderExpanded: state.folderExpanded,
          selectedItemInExplorer: state.selectedItemInExplorer,
        }),
      }
    ),
    { name: "file-explorer-store" }
  )
)
