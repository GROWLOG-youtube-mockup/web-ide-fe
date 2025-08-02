import type { ItemInstance } from "@headless-tree/core"
import { useMemo } from "react"
import type { FileData } from "@/types/file-explorer"

export const useTreeNodeState = (item: ItemInstance<FileData> | null) => {
  const itemData = item?.getItemData()
  const isFolder = itemData?.type === "folder"
  const hasChildren = Boolean(itemData?.children?.length)

  const isExpanded = item?.isExpanded() ?? false
  const isSelected = item?.isSelected() ?? false
  const isFocused = item?.isFocused() ?? false
  const isRenaming = item?.isRenaming() ?? false
  const level = item?.getItemMeta().level ?? 0
  const isDragTarget = item?.isDragTarget() ?? false

  const isMatchingSearch = item?.isMatchingSearch() ?? false //검색용 매칭

  const dragTarget = item?.getTree().getDragTarget()
  const isInDropZone = useMemo(() => {
    if (!item) return false
    if (isSelected) return false
    if (isDragTarget) return true
    return dragTarget && item.isDescendentOf(dragTarget.item.getId())
  }, [isSelected, isDragTarget, dragTarget, item])

  return {
    itemData,
    isFolder,
    hasChildren,
    isExpanded,
    isSelected,
    isFocused,
    isRenaming,
    level,
    isDragTarget,
    isInDropZone,
    isMatchingSearch,
  }
}
