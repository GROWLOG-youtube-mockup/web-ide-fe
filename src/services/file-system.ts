import type { TreeInitPayload } from "@/data/mock-file-tree"
import { mockApiResponse } from "@/data/mock-file-tree"

/**
 * 파일 시스템 작업을 위한 서비스 인터페이스
 */
export interface FileSystemService {
  /**
   * 파일/폴더 이름을 변경합니다
   */
  rename(oldPath: string, newName: string): Promise<void>

  /**
   * 파일/폴더를 이동합니다
   */
  move(sourcePath: string, targetPath: string): Promise<void>

  /**
   * 새 파일를 생성합니다
   */
  createFile(parentPath: string, fileName: string): Promise<void>

  /**
   * 새 폴더를 생성합니다
   */
  createFolder(parentPath: string, folderName: string): Promise<void>

  /**
   * 파일/폴더를 삭제합니다
   */
  delete(filePath: string): Promise<void>

  /**
   * 
  /**
   * 파일 트리 데이터를 가져옵니다
   */
  getFileTree(): TreeInitPayload

  /**
   * 파일 트리를 새로고침합니다
   */
  refreshTree(): Promise<void>
}

/**
 * Mock 구현체
 */
export class MockFileSystemService implements FileSystemService {
  async rename(oldPath: string, newName: string): Promise<void> {
    console.log(`[Mock] 파일 이름 변경: ${oldPath} → ${newName}`)
  }

  async move(sourcePath: string, targetPath: string): Promise<void> {
    console.log(`[Mock] 파일 이동: ${sourcePath} → ${targetPath}`)
  }

  async createFile(parentPath: string, fileName: string): Promise<void> {
    const fullPath = `${parentPath}/${fileName}`
    console.log(`[Mock] 파일 생성: ${fullPath}`)
  }
  async createFolder(parentPath: string, folderName: string): Promise<void> {
    const fullPath = `${parentPath}/${folderName}`
    console.log(`[Mock] 폴더 생성: ${fullPath}`)
  }

  async delete(filePath: string): Promise<void> {
    console.log(`[Mock] 파일 삭제: ${filePath}`)
  }

  getFileTree(): TreeInitPayload {
    return mockApiResponse
  }

  async refreshTree(): Promise<void> {
    console.log(`[Mock] 파일 트리 새로고침`)
  }
}

/**
 * 실제 API 구현체
 */
export class ApiFileSystemService implements FileSystemService {
  async rename(_oldPath: string, _newName: string): Promise<void> {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }

  async move(_sourcePath: string, _targetPath: string): Promise<void> {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }

  async createFile(_parentPath: string, _fileName: string): Promise<void> {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }

  async createFolder(_parentPath: string, _folderName: string): Promise<void> {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }

  async delete(_filePath: string): Promise<void> {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }

  getFileTree(): TreeInitPayload {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }

  async refreshTree(): Promise<void> {
    // TODO: 실제 API 호출
    throw new Error("API 구현 필요")
  }
}

export const fileSystemService: FileSystemService = new MockFileSystemService()
