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

  const isFolder = itemData.type === "folder"
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const hasChildren = Boolean(itemData.children?.length)
  const level = item.getItemMeta().level
  const isDragTarget = item.isDragTarget()

  const dragTarget = item.getTree().getDragTarget()
  const isInDropZone = (() => {
    if (isSelected) return false
    if (isDragTarget) return true
    return dragTarget && item.isDescendentOf(dragTarget.item.getId())
  })()

  return (
    <li
      {...itemProps}
      className={cn(
        itemProps.className,
        "cursor-pointer pl-3",
        TREE_STYLES.NODE_HEIGHT,
        TREE_STYLES.HOVER_BG,
        isSelected && TREE_STYLES.SELECTED_BG,
        isInDropZone && TREE_STYLES.DRAG_TARGET_BG
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
