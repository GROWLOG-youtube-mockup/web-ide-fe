import { selectionFeature, syncDataLoaderFeature, type TreeInstance } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { useMemo } from "react"
import { mockFileTree } from "@/data/mock-file-tree"
import { folderExpansionFeature } from "@/lib/folder-expansion"
import { openFileInEditorFeature } from "@/lib/open-file-feature"
import { convertToTreeData, createFileTreeDataLoader, getRootItemIds } from "@/lib/tree-utils"
import { useFileExplorerStore } from "@/stores/file-explorer-store"
import type { FileData } from "@/types/file-explorer"

export const useFileTree = () => {
  const treeData = useMemo(() => convertToTreeData(mockFileTree), [])
  const dataLoader = useMemo(() => createFileTreeDataLoader(treeData), [treeData])
  const rootIds = useMemo(() => getRootItemIds(treeData), [treeData])

  // Zustand에서 저장된 확장 상태 가져오기
  const { expandedItems } = useFileExplorerStore()

  const initialExpandedItems = useMemo(() => {
    return expandedItems.length > 0 ? expandedItems : [rootIds[0]]
  }, [expandedItems, rootIds])

  const tree: TreeInstance<FileData> = useTree<FileData>({
    dataLoader,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      // Custom Features
      folderExpansionFeature,
      openFileInEditorFeature,
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
