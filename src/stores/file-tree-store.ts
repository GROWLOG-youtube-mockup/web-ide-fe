import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface FileTreeState {
  /** 확장된 폴더들의 ID 목록 (브라우저 새로고침 시에도 유지) */
  expandedItems: string[]

  /**
   * 폴더 확장 상태 업데이트
   *
   * @param expandedItems - 확장된 폴더 ID 목록
   * @remarks
   * headless-tree에서 자동으로 호출되며, 브라우저 localStorage에 저장됩니다.
   */
  setExpandedItems: (expandedItems: string[]) => void
}

export const useFileTreeStore = create<FileTreeState>()(
  devtools(
    persist(
      (set): FileTreeState => ({
        expandedItems: [],

        setExpandedItems: (expandedItems: string[]) => {
          set({ expandedItems })
        },
      }),
      {
        name: "file-tree-store",
        partialize: state => ({
          expandedItems: state.expandedItems,
        }),
      }
    ),
    { name: "file-tree-store" }
  )
)
