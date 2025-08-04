import type { ItemInstance } from "@headless-tree/core"
import type React from "react"
import { useMemo } from "react"
import type { FileData } from "@/backup/types/file-explorer"
import { renderExpandIcon, renderFileIcon } from "@/backup/utils/tree-node-icons"
import { useTreeNodeHandlers } from "@/file-explorer/hooks/file-explorer/useTreeNodeHandlers"
import { useTreeNodeState } from "@/file-explorer/hooks/file-explorer/useTreeNodeState"
import { TREE_STYLES } from "@/shared/constants/file-explorer"
import { cn } from "@/shared/utils"

interface TreeNodeProps {
  item: ItemInstance<FileData>
}

export const TreeNode = ({ item }: TreeNodeProps): React.ReactElement => {
  // 노드 상태 및 핸들러
  const itemProps = item.getProps()
  const nodeState = useTreeNodeState(item)

  const nodeHandlers = useTreeNodeHandlers({
    item,
    itemProps,
    isRenaming: nodeState?.isRenaming ?? false,
    isExpanded: nodeState?.isExpanded ?? false,
    itemData: nodeState?.itemData,
  })

  // 안전한 기본값 제공
  const safeNodeState = useMemo(
    () => ({
      itemData: nodeState?.itemData || {
        name: "",
        path: "",
        type: "file" as const,
        id: "",
      },
      isFolder: nodeState?.isFolder ?? false,
      hasChildren: nodeState?.hasChildren ?? false,
      isExpanded: nodeState?.isExpanded ?? false,
      isSelected: nodeState?.isSelected ?? false,
      isFocused: nodeState?.isFocused ?? false,
      isRenaming: nodeState?.isRenaming ?? false,
      level: nodeState?.level ?? 0,
      isInDropZone: nodeState?.isInDropZone ?? false,
      isMatchingSearch: nodeState?.isMatchingSearch ?? false, //서치용
    }),
    [nodeState]
  )

  // 스타일 계산
  const className = useMemo(
    () =>
      cn(
        itemProps.className,
        "cursor-pointer pl-3 focus:outline-none",
        TREE_STYLES.NODE_HEIGHT,
        TREE_STYLES.HOVER_BG,
        safeNodeState.isSelected && TREE_STYLES.SELECTED_BG,
        safeNodeState.isFocused && !safeNodeState.isRenaming && TREE_STYLES.FOCUS_BG,
        safeNodeState.isInDropZone && TREE_STYLES.DRAG_TARGET_BG,
        safeNodeState.isMatchingSearch && TREE_STYLES.DRAG_TARGET_BG
      ),
    [itemProps.className, safeNodeState]
  )

  const style = useMemo(
    () => ({
      ...itemProps.style,
      paddingLeft: `${safeNodeState.level * TREE_STYLES.INDENT_SIZE}px`,
    }),
    [itemProps.style, safeNodeState.level]
  )

  const inputClassName = useMemo(
    () =>
      cn("h-full flex-1 bg-transparent px-0.5 text-sm focus:outline-none", TREE_STYLES.FOCUS_BG),
    []
  )

  return (
    <li
      {...itemProps}
      className={className}
      data-filepath={safeNodeState.itemData.path}
      data-is-folder={safeNodeState.isFolder.toString()}
      onClick={nodeHandlers?.handleClick}
      onKeyDown={nodeHandlers?.handleKeyDown}
      style={style}
      tabIndex={-1}
    >
      <span className="sr-only">
        {safeNodeState.isFolder ? "Folder" : "File"}: {safeNodeState.itemData.name}
        {safeNodeState.isFolder && (safeNodeState.isExpanded ? " (expanded)" : " (collapsed)")}
      </span>

      <div className="flex h-full items-center gap-1.5 pl-3 font-normal text-sm">
        {/* 확장/축소 아이콘 */}
        {renderExpandIcon(safeNodeState.isFolder, safeNodeState.isExpanded)}

        {/* 파일/폴더 아이콘 */}
        {renderFileIcon(
          safeNodeState.isFolder,
          safeNodeState.hasChildren,
          safeNodeState.isExpanded
        )}

        {/* 파일/폴더 이름 */}
        {safeNodeState.isRenaming ? (
          <input {...item.getRenameInputProps()} className={inputClassName} />
        ) : (
          <span className="flex-1 truncate text-left">{safeNodeState.itemData.name}</span>
        )}
      </div>
    </li>
  )
}
