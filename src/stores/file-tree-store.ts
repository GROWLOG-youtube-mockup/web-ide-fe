import type { TreeState } from "@headless-tree/core"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { FileData } from "@/types/file-explorer"

/**
 * 파일 트리의 전체 상태를 관리하는 Zustand 스토어 타입
 * Headless Tree의 TreeState를 완전히 관리
 */
interface FileTreeStore {
  /** Headless Tree의 전체 상태 (persist 기능으로 브라우저 새로고침 시에도 유지) */
  treeState: Partial<TreeState<FileData>>

  /**
   * 트리 상태를 업데이트하는 함수 (Headless Tree 호환)
   *
   * @param updaterOrValue - 새로운 상태 또는 상태 업데이터 함수
   * @remarks
   * - Headless Tree에서 자동으로 호출됨
   * - React useState와 동일한 시그니처
   * - zustand persist 미들웨어를 통해 localStorage에 자동 저장
   */
  setTreeState: (
    updaterOrValue:
      | Partial<TreeState<FileData>>
      | ((prev: Partial<TreeState<FileData>>) => Partial<TreeState<FileData>>)
  ) => void
}

const updateTreeState = (
  state: FileTreeStore,
  updaterOrValue:
    | Partial<TreeState<FileData>>
    | ((prev: Partial<TreeState<FileData>>) => Partial<TreeState<FileData>>)
) => ({
  treeState:
    typeof updaterOrValue === "function" ? updaterOrValue(state.treeState) : updaterOrValue,
})

export const useFileTreeStore = create<FileTreeStore>()(
  devtools(
    persist(
      (set, _get): FileTreeStore => ({
        treeState: { expandedItems: ["/"] }, // 기본적으로 루트 폴더 확장

        setTreeState: updaterOrValue => set(state => updateTreeState(state, updaterOrValue)),
      }),
      {
        name: "file-tree-store",
        partialize: state => ({
          treeState: {
            ...state.treeState,
            selectedItems: undefined, // selected 상태는 persist에서 제외
          },
        }),
      }
    ),
    { name: "file-tree-store" }
  )
)
