import { useMemo } from "react"
import {
  createFileWithPrompt,
  createFolderWithPrompt,
  getTargetPath,
} from "@/services/file-operations"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
import type { ContextMenuItem } from "@/types/context-menu"
import { copyToClipboard } from "@/utils/context-menu"

export const useFileExplorerContextMenu = (filePath: string, isFolder: boolean) => {
  const { openFileInEditor } = useEditorTabsStore()

  const menuItems: ContextMenuItem[] = useMemo(() => {
    // Return empty array for invalid file paths to avoid unnecessary computation
    if (!filePath || filePath.trim() === "") {
      return []
    }

    const targetPath = getTargetPath(filePath, isFolder)

    // File/folder creation actions
    const createNewFile = () => createFileWithPrompt(targetPath)
    const createNewFolder = () => createFolderWithPrompt(targetPath)
    // TODO: headless-tree의 내장 rename 기능으로 교체 예정
    const renameItem = () => console.log("Rename not implemented yet")
    // TODO: 더 나은 UI로 delete 확인 다이얼로그 구현 예정
    const deleteItem = () => console.log("Delete not implemented yet")

    const copyPath = async () => {
      const success = await copyToClipboard(filePath)
      if (!success) {
        // TODO: Show toast notification for copy failure
        console.error("Failed to copy path to clipboard")
      }
    }

    // File-specific menu items
    if (!isFolder) {
      return [
        {
          action: () => openFileInEditor(filePath),
          label: "Open",
          variant: "default",
        },
        {
          action: createNewFile,
          label: "New File",
          variant: "default",
        },
        {
          action: createNewFolder,
          label: "New Folder",
          variant: "default",
        },
        {
          action: renameItem,
          label: "Rename",
          variant: "default",
        },
        {
          action: deleteItem,
          label: "Delete",
          variant: "destructive",
        },
        {
          action: copyPath,
          label: "Copy Path",
          variant: "default",
        },
      ]
    }

    // Folder-specific menu items
    return [
      {
        action: createNewFile,
        label: "New File",
        variant: "default",
      },
      {
        action: createNewFolder,
        label: "New Folder",
        variant: "default",
      },
      {
        action: renameItem,
        label: "Rename",
        variant: "default",
      },
      {
        action: deleteItem,
        label: "Delete",
        variant: "destructive",
      },
      {
        action: copyPath,
        label: "Copy Path",
        variant: "default",
      },
    ]
  }, [filePath, isFolder, openFileInEditor])

  return { menuItems }
}
