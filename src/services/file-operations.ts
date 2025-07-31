/**
 * 파일 작업을 위한 공통 유틸리티 함수들
 */

import { fileSystemService } from "@/services/file-system"
import { useFileTreeStore } from "@/stores/file-tree-store"

/**
 * 파일 탐색기에서 새 파일 생성을 위한 임시 노드를 추가합니다
 */
export const createFileWithPrompt = async (targetPath: string): Promise<void> => {
  const { addTempNode } = useFileTreeStore.getState()
  addTempNode(targetPath, false)
}

/**
 * 파일 탐색기에서 새 폴더 생성을 위한 임시 노드를 추가합니다
 */
export const createFolderWithPrompt = async (targetPath: string): Promise<void> => {
  const { addTempNode } = useFileTreeStore.getState()
  addTempNode(targetPath, true)
}

/**
 * 임시 노드에서 실제 파일을 생성합니다
 */
export const createFileFromTempNode = async (
  parentPath: string,
  fileName: string
): Promise<void> => {
  await fileSystemService.createFile(parentPath, fileName)
}

/**
 * 임시 노드에서 실제 폴더를 생성합니다
 */
export const createFolderFromTempNode = async (
  parentPath: string,
  folderName: string
): Promise<void> => {
  await fileSystemService.createFolder(parentPath, folderName)
}

/**
 * 파일 경로에서 부모 디렉토리 경로를 반환합니다
 */
const getParentPath = (filePath: string): string => {
  const pathParts = filePath.split("/")
  pathParts.pop() // Remove file name
  return pathParts.join("/") || "/"
}

/**
 * 파일의 경우 부모 디렉토리, 폴더의 경우 자기 자신의 경로를 반환합니다
 */
export const getTargetPath = (filePath: string, isFolder: boolean): string => {
  return isFolder ? filePath : getParentPath(filePath)
}
