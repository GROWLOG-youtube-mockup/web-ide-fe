import type { TreeDataLoader } from "@headless-tree/core"
import type { FileTreeNode } from "@/data/mock-file-tree"
import type { FileData } from "@/types/file-explorer"

/**
 * 기존 FileTreeNode를 HeadlessTree 플랫 구조로 변환
 */
export function convertToTreeData(nodes: FileTreeNode[]): Record<string, FileData> {
  const flatData: Record<string, FileData> = {}

  const traverse = (nodes: FileTreeNode[], parentId?: string) => {
    nodes.forEach(node => {
      const id = node.path

      flatData[id] = {
        children: node.children?.map(child => child.path) || [],
        id,
        name: String(node.name || ""),
        parentId,
        path: node.path,
        type: node.type,
      }

      if (node.children?.length) {
        traverse(node.children, id)
      }
    })
  }

  traverse(nodes)
  return flatData
}

/**
 * HeadlessTree용 DataLoader 생성
 */
export function createFileTreeDataLoader(data: Record<string, FileData>): TreeDataLoader<FileData> {
  return {
    getChildren: (itemId: string) => {
      const item = data[itemId]
      if (!item) {
        throw new Error(`Item with id "${itemId}" not found`)
      }
      return item.children || []
    },
    getItem: (itemId: string) => {
      const item = data[itemId]
      if (!item) {
        throw new Error(`Item with id "${itemId}" not found`)
      }
      return item
    },
  }
}

/**
 * 루트 노드들의 ID 추출
 */
export function getRootItemIds(data: Record<string, FileData>): string[] {
  return Object.values(data)
    .filter(item => !item.parentId)
    .map(item => item.id)
}
