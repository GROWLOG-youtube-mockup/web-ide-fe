import type { FeatureImplementation } from "@headless-tree/core"
import { useFileTreeStore } from "@/stores/file-tree-store"
import type { FileData } from "@/types/file-explorer"

/**
 * 폴더 확장 상태를 zustand store와 동기화하는 headless-tree feature
 *
 * @remarks
 * - 폴더 확장/축소 시 자동으로 zustand store에 상태 저장
 * - 브라우저 새로고침 시에도 폴더 열림 상태 유지
 * - queueMicrotask를 사용하여 안전한 비동기 상태 동기화
 */
export const expandFolderFeature: FeatureImplementation<FileData> = {
  getInitialState: initialState => {
    const { expandedItems } = useFileTreeStore.getState()
    return {
      ...initialState,
      expandedItems: expandedItems,
    }
  },

  itemInstance: {
    collapse: ({ item, prev }) => {
      prev?.()

      // 상태 변경 후 zustand에 동기화
      queueMicrotask(() => {
        const tree = item.getTree()
        const expandedItems = Array.from(tree.getState().expandedItems || [])
        useFileTreeStore.getState().setExpandedItems(expandedItems)
      })
    },
    expand: ({ item, prev }) => {
      prev?.()

      // 상태 변경 후 zustand에 동기화
      queueMicrotask(() => {
        const tree = item.getTree()
        const expandedItems = Array.from(tree.getState().expandedItems || [])
        useFileTreeStore.getState().setExpandedItems(expandedItems)
      })
    },
  },
}
