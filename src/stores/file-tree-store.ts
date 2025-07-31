import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface TempNode {
  id: string
  parentPath: string
  isFolder: boolean
  isCreating: boolean
}

interface FileTreeStore {
  expandedItems: string[]
  focusedItem: string | null
  tempNodes: TempNode[]
  setExpandedItems: (value: string[] | ((prev: string[]) => string[])) => void
  setFocusedItem: (value: string | null | ((prev: string | null) => string | null)) => void
  addTempNode: (parentPath: string, isFolder: boolean) => string
  removeTempNode: (id: string) => void
  clearTempNodes: () => void
}

export const useFileTreeStore = create<FileTreeStore>()(
  devtools(
    persist(
      (set): FileTreeStore => ({
        expandedItems: ["/"],
        focusedItem: null,
        tempNodes: [],
        setExpandedItems: value =>
          set(state => ({
            expandedItems: typeof value === "function" ? value(state.expandedItems) : value,
          })),
        setFocusedItem: value =>
          set(state => ({
            focusedItem: typeof value === "function" ? value(state.focusedItem) : value,
          })),
        addTempNode: (parentPath: string, isFolder: boolean) => {
          const id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          set(state => ({
            tempNodes: [...state.tempNodes, { id, parentPath, isFolder, isCreating: true }],
          }))
          return id
        },
        removeTempNode: (id: string) =>
          set(state => ({
            tempNodes: state.tempNodes.filter(node => node.id !== id),
          })),
        clearTempNodes: () =>
          set(() => ({
            tempNodes: [],
          })),
      }),
      {
        name: "file-tree-store",
        partialize: state => ({
          expandedItems: state.expandedItems,
        }),
      }
    ),
    { name: "file-tree-store" }
  )
)
