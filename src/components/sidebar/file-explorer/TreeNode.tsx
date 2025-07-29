import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"
import type React from "react"
import { ICON_STYLES, TREE_STYLES } from "@/constants/file-explorer"
import { cn } from "@/lib/utils"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
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
  const { openFileInEditor } = useEditorTabsStore()

  const itemData = item.getItemData()
  const itemProps = item.getProps()

  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const isFocused = item.isFocused()
  const isRenaming = item.isRenaming()
  const level = item.getItemMeta().level
  const isDragTarget = item.isDragTarget()

  const isFolder = itemData.type === "folder"
  const hasChildren = Boolean(itemData.children?.length)

  const dragTarget = item.getTree().getDragTarget()
  const isInDropZone = (() => {
    if (isSelected) return false
    if (isDragTarget) return true
    return dragTarget && item.isDescendentOf(dragTarget.item.getId())
  })()

  const handleClick = (e: React.MouseEvent) => {
    // renaming 모드일 때는 클릭 이벤트 처리하지 않음
    if (isRenaming) {
      return
    }

    itemProps.onClick?.(e as React.MouseEvent<HTMLLIElement>)

    // 다중 선택을 방해하지 않도록 Ctrl/Cmd 키가 눌린 경우 파일 열기 스킵
    if (itemData.type === "file" && !e.ctrlKey && !e.metaKey) {
      openFileInEditor(itemData.path)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // renaming 모드일 때는 기본 키보드 이벤트만 처리 (headless-tree가 처리)
    itemProps.onKeyDown?.(e as React.KeyboardEvent<HTMLLIElement>)

    if (isRenaming) {
      return
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()

      if (itemData.type === "file") {
        openFileInEditor(itemData.path)
        return
      }

      if (isExpanded) {
        item.collapse()
        return
      }

      item.expand()
    }
  }

  return (
    <li
      {...itemProps}
      className={cn(
        itemProps.className,
        "cursor-pointer pl-3 focus:outline-none",
        TREE_STYLES.NODE_HEIGHT,
        TREE_STYLES.HOVER_BG,
        isSelected && TREE_STYLES.SELECTED_BG,
        isFocused && !isRenaming && TREE_STYLES.FOCUS_BG,
        isInDropZone && TREE_STYLES.DRAG_TARGET_BG
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        ...itemProps.style,
        paddingLeft: `${level * TREE_STYLES.INDENT_SIZE}px`,
      }}
      tabIndex={-1}
    >
      <span className="sr-only">
        {isFolder ? "Folder" : "File"}: {itemData.name}
        {isFolder && (isExpanded ? " (expanded)" : " (collapsed)")}
      </span>

      <div className="flex h-full items-center gap-1.5 pl-3 font-normal text-sm">
        {/* 확장/축소 아이콘 */}
        {renderExpandIcon(isFolder, isExpanded)}

        {/* 파일/폴더 아이콘 */}
        {renderFileIcon(isFolder, hasChildren, isExpanded)}

        {/* 파일/폴더 이름 */}
        {isRenaming ? (
          <input
            {...item.getRenameInputProps()}
            className={cn(
              "h-full flex-1 bg-transparent px-0.5 text-sm focus:outline-none",
              TREE_STYLES.FOCUS_BG
            )}
          />
        ) : (
          <span className="flex-1 truncate text-left">{itemData.name}</span>
        )}
      </div>
    </li>
  )
}
