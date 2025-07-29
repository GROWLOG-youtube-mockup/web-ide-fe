import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface FileTreeStore {
  expandedItems: string[]
  focusedItem: string | null
  setExpandedItems: (value: string[] | ((prev: string[]) => string[])) => void
  setFocusedItem: (value: string | null | ((prev: string | null) => string | null)) => void
}

export const useFileTreeStore = create<FileTreeStore>()(
  devtools(
    persist(
      (set): FileTreeStore => ({
        expandedItems: ["/"],
        focusedItem: null,
        setExpandedItems: value =>
          set(state => ({
            expandedItems: typeof value === "function" ? value(state.expandedItems) : value,
          })),
        setFocusedItem: value =>
          set(state => ({
            focusedItem: typeof value === "function" ? value(state.focusedItem) : value,
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
