import { selectionFeature, syncDataLoaderFeature, type TreeInstance } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { useMemo } from "react"
import { mockFileTree } from "@/data/mock-file-tree"
import { openFileInEditorFeature } from "@/lib/open-file-feature"
import { convertToTreeData, createFileTreeDataLoader, getRootItemIds } from "@/lib/tree-utils"
import type { FileData } from "@/types/file-explorer"

export const useFileTree = () => {
  const treeData = useMemo(() => convertToTreeData(mockFileTree), [])
  const dataLoader = useMemo(() => createFileTreeDataLoader(treeData), [treeData])
  const rootIds = useMemo(() => getRootItemIds(treeData), [treeData])

  const tree: TreeInstance<FileData> = useTree<FileData>({
    dataLoader,
    features: [syncDataLoaderFeature, selectionFeature, openFileInEditorFeature],
    getItemName: item => String(item.getItemData().name || ""),
    initialState: {
      expandedItems: [rootIds[0]], // 루트만 기본 확장
    },
    isItemFolder: item => item.getItemData().type === "folder",
    rootItemId: rootIds[0],
  })

  return {
    tree,
  }
}
