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
    // Drag and Drop 설정
    canDrag: items => items.length > 0,
    canDrop: (_, target) => {
      const targetData = target.item.getItemData()
      return targetData.type === "folder"
    },
    canReorder: true,
    dataLoader,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      dragAndDropFeature,
      // Custom Features
      expandFolderFeature,
      openFileFeature,
    ],
    getItemName: item => String(item.getItemData().name || ""),
    indent: 12,
    initialState: {
      expandedItems: initialExpandedItems,
    },
    isItemFolder: item => item.getItemData().type === "folder",
    onDrop: (items, target) => {
      const draggedPaths = items.map(item => item.getItemData().path)
      const targetPath = target.item.getItemData().path
      const targetType = target.item.getItemData().type

      console.log("=== 파일 드래그 앤 드롭 이벤트 ===")
      console.log("드래그된 아이템들:", draggedPaths)

      if ("childIndex" in target) {
        console.log("삽입 위치:", target.insertionIndex)
      } else {
        console.log("폴더 내부로 이동")
        console.log("드롭 타겟:", targetPath, `(${targetType})`)
      }
      console.log("================================")
    },
    rootItemId: rootIds[0],
  })

  return {
    tree,
  }
}
