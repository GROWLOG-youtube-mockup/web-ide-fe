import type { FeatureImplementation } from "@headless-tree/core"
import { useFileExplorerStore } from "@/stores/file-explorer-store"
import type { FileData } from "@/types/file-explorer"

export const folderExpansionFeature: FeatureImplementation<FileData> = {
  getInitialState: initialState => {
    const { expandedItems } = useFileExplorerStore.getState()
    return {
      ...initialState,
      expandedItems: expandedItems,
    }
  },

  itemInstance: {
    collapse: ({ item, prev }) => {
      prev?.()

      setTimeout(() => {
        const tree = item.getTree()
        const expandedItems = tree.getState().expandedItems || []
        useFileExplorerStore.getState().setExpandedItems(expandedItems)
      }, 0)
    },
    expand: ({ item, prev }) => {
      prev?.()

      setTimeout(() => {
        const tree = item.getTree()
        const expandedItems = tree.getState().expandedItems || []
        useFileExplorerStore.getState().setExpandedItems(expandedItems)
      }, 0)
    },
  },
}
