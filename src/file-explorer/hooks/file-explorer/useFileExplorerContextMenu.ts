import { useMemo } from "react"
import type { ContextMenuItem } from "@/backup/types/context-menu"
import { copyToClipboard } from "@/backup/utils/context-menu"
import { getParentPath } from "@/backup/utils/file-operations"
import { useFileOperations } from "@/file-explorer/hooks/file-explorer/useFileOperations"

export const useFileExplorerContextMenu = (filePath: string, isFolder: boolean) => {
  const { createFileItem, createFolderItem, renameItem, deleteItem } = useFileOperations()

  const menuItems: ContextMenuItem[] = useMemo(() => {
    if (!filePath || filePath.trim() === "") {
      return []
    }

    return [
      {
        action: () => {
          const parentPath = isFolder ? filePath : getParentPath(filePath)
          const fileName = prompt("Enter file name:")
          if (fileName) {
            createFileItem(parentPath, fileName)
          }
        },
        label: "New File",
        variant: "default",
      },
      {
        action: () => {
          const parentPath = isFolder ? filePath : getParentPath(filePath)
          const folderName = prompt("Enter folder name:")
          if (folderName) {
            createFolderItem(parentPath, folderName)
          }
        },
        label: "New Folder",
        variant: "default",
      },
      {
        action: () => {
          const newName = prompt("Enter new name:", filePath.split("/").pop())
          if (newName) {
            renameItem(filePath, newName)
          }
        },
        label: "Rename",
        variant: "default",
      },
      {
        action: () => {
          if (confirm(`Are you sure you want to delete "${filePath.split("/").pop()}"?`)) {
            deleteItem(filePath)
          }
        },
        label: "Delete",
        variant: "destructive",
      },
      {
        action: async () => {
          const success = await copyToClipboard(filePath)
          if (!success) {
            console.error("Failed to copy path to clipboard")
          }
        },
        label: "Copy Path",
        variant: "default",
      },
    ]
  }, [filePath, isFolder, createFileItem, createFolderItem, renameItem, deleteItem])

  return { menuItems }
}
