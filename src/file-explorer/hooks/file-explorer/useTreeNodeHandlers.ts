import type { ItemInstance } from "@headless-tree/core"
import { useCallback } from "react"
import { useEditorTabsStore } from "@/backup/stores/editor-tabs-store"
import type { FileData } from "@/backup/types/file-explorer"

interface UseTreeNodeHandlersProps {
  item: ItemInstance<FileData> | null
  itemProps: {
    onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLLIElement>) => void
    className?: string
    style?: React.CSSProperties
  }
  isRenaming: boolean
  isExpanded: boolean
  itemData?: FileData
}

export const useTreeNodeHandlers = ({
  item,
  itemProps,
  isRenaming,
  isExpanded,
  itemData,
}: UseTreeNodeHandlersProps) => {
  const { openFileInEditor } = useEditorTabsStore()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      if (isRenaming || !itemData) return

      itemProps.onClick?.(e)

      if (itemData.type === "file" && !e.ctrlKey && !e.metaKey) {
        openFileInEditor(itemData.path)
      }
    },
    [isRenaming, itemProps, itemData, openFileInEditor]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>) => {
      itemProps.onKeyDown?.(e)

      if (isRenaming || !itemData || !item) return

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
    },
    [itemProps, isRenaming, itemData, isExpanded, item, openFileInEditor]
  )

  return {
    handleClick,
    handleKeyDown,
  }
}
