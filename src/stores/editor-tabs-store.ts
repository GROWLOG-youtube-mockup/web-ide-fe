import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface EditorTabsState {
  openedFiles: string[]
  activeFile: string | null

  /**
   * 파일을 에디터에서 열기
   *
   * @param filePath - 열 파일의 경로
   * @remarks
   * 이미 열린 파일이면 활성화만 하고, 새 파일이면 목록에 추가 후 활성화합니다.
   */
  openFileInEditor: (filePath: string) => void

  /**
   * 에디터에서 파일 닫기
   *
   * @param filePath - 닫을 파일의 경로
   * @remarks
   * 활성 파일을 닫으면 마지막으로 열었던 파일로 자동 전환됩니다.
   */
  closeFile: (filePath: string) => void

  /**
   * 활성 파일 변경
   *
   * @param filePath - 활성화할 파일의 경로
   * @remarks
   * 이미 열린 파일만 활성화 가능합니다.
   */
  setActiveFile: (filePath: string) => void
}

export const useEditorTabsStore = create<EditorTabsState>()(
  devtools(
    persist(
      (set, get): EditorTabsState => ({
        // 초기 상태
        activeFile: null,

        // 파일 닫기
        closeFile: (filePath: string) => {
          const { openedFiles, activeFile } = get()
          const newOpenedFiles = openedFiles.filter(file => file !== filePath)

          // 닫힌 파일이 활성 파일이 아니면 상태 유지
          if (activeFile !== filePath) {
            set({ openedFiles: newOpenedFiles })
            return
          }

          // 닫힌 파일이 활성 파일이면 다른 파일로 전환
          const newActiveFile =
            newOpenedFiles.length > 0 ? newOpenedFiles[newOpenedFiles.length - 1] : null

          set({
            activeFile: newActiveFile,
            openedFiles: newOpenedFiles,
          })
        },
        openedFiles: [],

        // 파일 열기
        openFileInEditor: (filePath: string) => {
          const { openedFiles } = get()

          if (openedFiles.includes(filePath)) {
            // 이미 열린 파일이면 활성화만
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

        // 활성 파일 변경
        setActiveFile: (filePath: string) => {
          const { openedFiles } = get()
          if (openedFiles.includes(filePath)) {
            set({ activeFile: filePath })
          }
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
