import { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom" // 추가
import { createFileSystemService } from "@/shared/api/file-system-api" // 변경

export function useFileOperations() {
  const { projectId } = useParams<{ projectId: string }>() // 추가
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // fileSystemService를 useMemo로 생성 (추가)
  const fileSystemService = useMemo(() => {
    return createFileSystemService(projectId || "")
  }, [projectId])

  const createFileItem = useCallback(
    async (parentPath: string, newName: string) => {
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
    },
    [fileSystemService]
  ) // 의존성 추가

  const createFolderItem = useCallback(
    async (parentPath: string, folderName: string) => {
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
    },
    [fileSystemService]
  ) // 의존성 추가

  const renameItem = useCallback(
    async (oldPath: string, newName: string) => {
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
    },
    [fileSystemService]
  ) // 의존성 추가

  const moveItem = useCallback(
    async (sourcePath: string, targetPath: string) => {
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
    },
    [fileSystemService]
  ) // 의존성 추가

  const deleteItem = useCallback(
    async (path: string) => {
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
    },
    [fileSystemService]
  ) // 의존성 추가

  const refreshTree = useCallback(() => {
    try {
      fileSystemService.refreshTree()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh tree"
      setError(errorMessage)
      console.error("Tree refresh failed:", err)
    }
  }, [fileSystemService]) // 의존성 추가

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
