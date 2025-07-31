import type React from "react"
import { useLayoutEffect, useRef, useState } from "react"
import { TREE_STYLES } from "@/constants/file-explorer"
import { useTreeNodeHandlers } from "@/hooks/file-explorer/useTreeNodeHandlers"
import { useTreeNodeState } from "@/hooks/file-explorer/useTreeNodeState"
import { cn } from "@/lib/utils"
import type { TreeNodeProps } from "@/types/file-explorer"
import { renderExpandIcon, renderFileIcon } from "@/utils/tree-node-icons"

export const TreeNode = ({ item, tempNodeData }: TreeNodeProps): React.ReactElement => {
  // 임시 노드인지 확인
  const isTempNode = !!tempNodeData

  // 임시 노드용 상태
  const [tempName, setTempName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 일반 노드 처리
  const itemProps = item?.getProps() || {}
  const nodeState = useTreeNodeState(item)
  const nodeHandlers = useTreeNodeHandlers({
    item,
    itemProps,
    isRenaming: nodeState?.isRenaming ?? false,
    isExpanded: nodeState?.isExpanded ?? false,
    itemData: nodeState?.itemData,
  })

  // 임시 노드일 때 focus 처리
  useLayoutEffect(() => {
    if (isTempNode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTempNode])

  // 임시 노드 핸들러
  const handleTempConfirm = async () => {
    if (!tempName.trim() || isLoading || !tempNodeData) return

    setIsLoading(true)
    try {
      await tempNodeData.onConfirm(tempName.trim())
    } catch (error) {
      console.error("Failed to create file/folder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTempCancel = () => {
    if (tempNodeData) {
      tempNodeData.onCancel()
    }
  }

  const handleTempKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleTempConfirm()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleTempCancel()
    }
  }

  // 상태 값들 설정 (임시 노드 vs 일반 노드)
  const itemData = isTempNode
    ? {
        name: tempName || `New ${tempNodeData?.isFolder ? "Folder" : "File"}`,
        path: `${tempNodeData?.parentPath}/${tempName || "untitled"}`,
        type: tempNodeData?.isFolder ? ("folder" as const) : ("file" as const),
        id: tempNodeData?.id,
      }
    : nodeState?.itemData || { name: "", path: "", type: "file" as const, id: "" }

  const isFolder = isTempNode ? tempNodeData?.isFolder : nodeState?.isFolder || false
  const hasChildren = isTempNode ? false : nodeState?.hasChildren || false
  const isExpanded = isTempNode ? false : nodeState?.isExpanded || false
  const isSelected = isTempNode ? true : nodeState?.isSelected || false
  const isFocused = isTempNode ? true : nodeState?.isFocused || false
  const isRenaming = isTempNode ? true : nodeState?.isRenaming || false
  const level = isTempNode ? tempNodeData?.level : nodeState?.level || 0
  const isInDropZone = isTempNode ? false : nodeState?.isInDropZone || false

  const handleClick = isTempNode ? undefined : nodeHandlers?.handleClick
  const handleKeyDown = isTempNode ? handleTempKeyDown : nodeHandlers?.handleKeyDown

  const className = cn(
    itemProps.className,
    "cursor-pointer pl-3 focus:outline-none",
    TREE_STYLES.NODE_HEIGHT,
    TREE_STYLES.HOVER_BG,
    isSelected && TREE_STYLES.SELECTED_BG,
    isFocused && !isRenaming && TREE_STYLES.FOCUS_BG,
    isInDropZone && TREE_STYLES.DRAG_TARGET_BG
  )

  const style = {
    ...itemProps.style,
    paddingLeft: `${level * TREE_STYLES.INDENT_SIZE}px`,
  }

  const inputClassName = cn(
    "h-full flex-1 bg-transparent px-0.5 text-sm focus:outline-none",
    TREE_STYLES.FOCUS_BG
  )

  return (
    <li
      {...itemProps}
      className={className}
      data-filepath={itemData.path}
      data-isfolder={isFolder.toString()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
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
          isTempNode ? (
            <input
              className={inputClassName}
              disabled={isLoading}
              onBlur={handleTempCancel}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={handleTempKeyDown}
              placeholder={isFolder ? "Folder name" : "File name"}
              ref={inputRef}
              type="text"
              value={tempName}
            />
          ) : (
            <input {...item?.getRenameInputProps()} className={inputClassName} />
          )
        ) : (
          <span className="flex-1 truncate text-left">{itemData.name}</span>
        )}
      </div>
    </li>
  )
}
