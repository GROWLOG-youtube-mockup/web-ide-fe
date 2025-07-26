import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"
import type React from "react"
import { ICON_STYLES, TREE_STYLES } from "@/constants/file-explorer"
import { cn } from "@/lib/utils"
import type { TreeNodeProps } from "@/types/file-explorer"

export const TreeNode = ({ item }: TreeNodeProps): React.ReactElement => {
  const itemData = item.getItemData()
  const itemProps = item.getProps()

  // headless-tree가 제공하는 상태들
  const isFolder = itemData.type === "folder"
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const hasChildren = Boolean(itemData.children?.length)
  const level = item.getItemMeta().level

  // 모든 이벤트 처리는 feature에서 자동으로 처리됨

  return (
    <li
      {...itemProps}
      className={cn(
        itemProps.className,
        "cursor-pointer pl-3",
        TREE_STYLES.NODE_HEIGHT,
        TREE_STYLES.HOVER_BG,
        isSelected && TREE_STYLES.SELECTED_BG
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
        {isFolder ? (
          <ChevronRight
            className={cn(
              TREE_STYLES.ICON_SIZE,
              ICON_STYLES.CHEVRON,
              isExpanded && ICON_STYLES.CHEVRON_EXPANDED
            )}
          />
        ) : (
          <span className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.BASE)} />
        )}

        {/* 파일/폴더 아이콘 */}
        {isFolder ? (
          hasChildren && isExpanded ? (
            <FolderOpen className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FOLDER)} />
          ) : (
            <Folder className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FOLDER)} />
          )
        ) : (
          <File className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FILE)} />
        )}

        {/* 파일/폴더 이름 */}
        <span className="flex-1 truncate text-left">{itemData.name}</span>
      </div>
    </li>
  )
}
