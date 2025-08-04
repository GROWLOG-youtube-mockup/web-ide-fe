/**
 * 파일 작업을 위한 공통 유틸리티 함수들
 */

import type { ItemInstance, TreeInstance } from "@headless-tree/core"
import type { FileData } from "@/backup/types/file-explorer"

/**
 * 파일 경로에서 부모 디렉토리 경로를 반환합니다
 */
export const getParentPath = (filePath: string): string => {
  const pathParts = filePath.split("/")
  pathParts.pop() // Remove file name
  return pathParts.join("/") || "/"
}

/**
 * 파일의 경우 부모 디렉토리, 폴더의 경우 자기 자신의 경로를 반환합니다
 */
export const getTargetPathInTab = (filePath: string, isFolder: boolean): string => {
  return isFolder ? filePath : getParentPath(filePath)
}

/**
 * 트리 인스턴스에서 현재 포커스되거나 선택된 항목을 기반으로 대상 폴더 경로를 가져옵니다.
 * 우선순위: 포커스된 항목 > 선택된 항목 > 루트
 */
export const getTargetPathInFileTree = (tree: TreeInstance<FileData>): string => {
  const getFolderPathForItem = (item: ItemInstance<FileData>): string => {
    const itemData = item.getItemData()
    if (itemData.type === "folder") {
      return itemData.path
    }
    // 포커스되거나 선택된 항목이 파일이면 부모 폴더 경로 반환
    return getParentPath(itemData.path)
  }

  // 1. 포커스된 항목 확인
  const focusedItem = tree.getFocusedItem()
  if (focusedItem) {
    return getFolderPathForItem(focusedItem)
  }

  // 2. 선택된 항목 확인
  const selectedItems = tree.getSelectedItems()
  if (selectedItems.length > 0) {
    const selectedItem = selectedItems[0]
    return getFolderPathForItem(selectedItem)
  }

  // 3. 기본값: 루트
  return "/"
}
