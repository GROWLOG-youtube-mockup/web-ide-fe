import type { ItemInstance } from "@headless-tree/core"

// headless-tree 타입 확장
declare module "@headless-tree/core" {
  // biome-ignore lint/correctness/noUnusedVariables: headless-tree의 기존 제네릭 타입과 일치해야 함
  interface ItemInstance<T> {
    openFile: () => void
  }
}

export interface FileData {
  id: string
  name: string
  path: string
  type: "file" | "folder"
  parentId?: string
  children?: string[]
}

export interface TempNodeData {
  id: string
  parentPath: string
  isFolder: boolean
  level: number
  onConfirm: (name: string) => Promise<void>
  onCancel: () => void
}

export interface TreeNodeProps {
  item?: ItemInstance<FileData>
  tempNodeData?: TempNodeData
}

export interface TreeItemState {
  isFolder: boolean
  isExpanded: boolean
  isSelected: boolean
  isFocused: boolean
  hasChildren: boolean
  level: number
}
