import {
  dragAndDropFeature,
  selectionFeature,
  syncDataLoaderFeature,
  type TreeInstance,
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { useMemo } from "react"
import { mockFileTree } from "@/data/mock-file-tree"
import { expandFolderFeature } from "@/lib/expand-folder-feature"
import { openFileFeature } from "@/lib/open-file-feature"
import { convertToTreeData, createFileTreeDataLoader, getRootItemIds } from "@/lib/tree-utils"
import { useFileTreeStore } from "@/stores/file-tree-store"
import type { FileData } from "@/types/file-explorer"

export const useFileTree = () => {
  const treeData = useMemo(() => convertToTreeData(mockFileTree), [])
  const dataLoader = useMemo(() => createFileTreeDataLoader(treeData), [treeData])
  const rootIds = useMemo(() => getRootItemIds(treeData), [treeData])

  // zustand에서 저장된 확장 상태 가져오기
  const { expandedItems } = useFileTreeStore()

  const initialExpandedItems = useMemo(() => {
    return expandedItems.length > 0 ? expandedItems : [rootIds[0]]
  }, [expandedItems, rootIds])

  const tree: TreeInstance<FileData> = useTree<FileData>({
    canDrag: items => items.length > 0,
    canDrop: (_items, target) => target.item.getItemData().type === "folder",
    canReorder: false,
    dataLoader,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      dragAndDropFeature,
      expandFolderFeature,
      openFileFeature,
    ],
    getItemName: item => String(item.getItemData().name || ""),
    indent: 12,
    initialState: { expandedItems: initialExpandedItems },
    isItemFolder: item => item.getItemData().type === "folder",
    onDrop: (items, target) => {
      // TODO: 실제 드롭 로직 구현
      console.log(
        "드롭:",
        items.map(item => item.getItemData().path),
        "→",
        target.item.getItemData().path
      )
    },
    rootItemId: rootIds[0],
  })

  return {
    tree,
  }
}
