import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"
import type React from "react"
import { ICON_STYLES, TREE_STYLES } from "@/constants/file-explorer"
import { cn } from "@/lib/utils"
import type { TreeNodeProps } from "@/types/file-explorer"

const renderExpandIcon = (isFolder: boolean, isExpanded: boolean) => {
  if (!isFolder) {
    return <span className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.BASE)} />
  }

  return (
    <ChevronRight
      className={cn(
        TREE_STYLES.ICON_SIZE,
        ICON_STYLES.CHEVRON,
        isExpanded && ICON_STYLES.CHEVRON_EXPANDED
      )}
    />
  )
}

const renderFileIcon = (isFolder: boolean, hasChildren: boolean, isExpanded: boolean) => {
  if (!isFolder) {
    return <File className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FILE)} />
  }

  if (hasChildren && isExpanded) {
    return <FolderOpen className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FOLDER)} />
  }

  return <Folder className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FOLDER)} />
}

export const TreeNode = ({ item }: TreeNodeProps): React.ReactElement => {
  const itemData = item.getItemData()
  const itemProps = item.getProps()

  // headless-tree가 제공하는 상태들
  const isFolder = itemData.type === "folder"
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const hasChildren = Boolean(itemData.children && itemData.children.length > 0)
  const level = item.getItemMeta().level
  const isDragTarget = item.isDragTarget()

  // 부모 체인에서 드래그 타겟 폴더 찾기
  const findDragTargetFolder = (currentItem: typeof item): boolean => {
    let parent = currentItem.getParent()
    while (parent) {
      if (parent.isDragTarget() && parent.getItemData().type === "folder") {
        return true
      }
      parent = parent.getParent()
    }
    return false
  }

  // 드롭 영역 여부: 현재가 드래그 타겟 폴더이거나 부모 중에 드래그 타겟 폴더가 있는 경우
  const isInDropZone = (isDragTarget && isFolder) || findDragTargetFolder(item)

  return (
    <li
      {...itemProps}
      className={cn(
        itemProps.className,
        "cursor-pointer pl-3",
        TREE_STYLES.NODE_HEIGHT,
        TREE_STYLES.HOVER_BG,
        isSelected && TREE_STYLES.SELECTED_BG,
        isInDropZone && TREE_STYLES.DRAG_TARGET
      )}
      style={{
        ...itemProps.style,
        paddingLeft: `${level * TREE_STYLES.INDENT_SIZE}px`,
      }}
    >
      <span className="sr-only">
        {isFolder ? "Folder" : "File"}: {itemData.name}
        {isFolder && (isExpanded ? " (expanded)" : " (collapsed)")}
      </span>

      <div className="flex items-center gap-1.5 pl-3 font-normal text-sm">
        {/* 확장/축소 아이콘 */}
        {renderExpandIcon(isFolder, isExpanded)}

        {/* 파일/폴더 아이콘 */}
        {renderFileIcon(isFolder, hasChildren, isExpanded)}

        {/* 파일/폴더 이름 */}
        <span className="flex-1 truncate text-left">{itemData.name}</span>
      </div>
    </li>
  )
}
