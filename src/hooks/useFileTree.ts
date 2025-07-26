import { selectionFeature, syncDataLoaderFeature, type TreeInstance } from "@headless-tree/core"
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
    dataLoader,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      // Custom Features
      expandFolderFeature,
      openFileFeature,
    ],
    getItemName: item => String(item.getItemData().name || ""),
    initialState: {
      expandedItems: initialExpandedItems,
    },
    isItemFolder: item => item.getItemData().type === "folder",
    rootItemId: rootIds[0],
  })

  return {
    tree,
  }
}
