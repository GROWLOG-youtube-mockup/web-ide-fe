import { useCallback, useState } from "react"
import { fileSystemService } from "@/services/file-system"

export function useFileOperations() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFileItem = useCallback(async (parentPath: string, newName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await fileSystemService.createFile(parentPath, newName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create item"
      setError(errorMessage)
      console.error("File creation failed:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createFolderItem = useCallback(async (parentPath: string, folderName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await fileSystemService.createFolder(parentPath, folderName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create item"
      setError(errorMessage)
      console.error("Folder creation failed:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const renameItem = useCallback(async (oldPath: string, newName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await fileSystemService.rename(oldPath, newName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to rename item"
      setError(errorMessage)
      console.error("Rename failed:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const moveItem = useCallback(async (sourcePath: string, targetPath: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await fileSystemService.move(sourcePath, targetPath)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to move item"
      setError(errorMessage)
      console.error("Move failed:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteItem = useCallback(async (path: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await fileSystemService.delete(path)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete item"
      setError(errorMessage)
      console.error("Delete failed:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshTree = useCallback(() => {
    try {
      fileSystemService.refreshTree()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh tree"
      setError(errorMessage)
      console.error("Tree refresh failed:", err)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    createFileItem,
    createFolderItem,
    renameItem,
    moveItem,
    deleteItem,
    refreshTree,
    clearError,
  }
}
