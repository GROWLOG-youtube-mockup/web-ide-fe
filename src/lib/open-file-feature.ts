import type { FeatureImplementation } from "@headless-tree/core"
import { useFileExplorerStore } from "@/stores/file-explorer-store"
import type { FileData } from "@/types/file-explorer"

export const openFileInEditorFeature: FeatureImplementation<FileData> = {
  itemInstance: {
    getProps: ({ item, prev }) => {
      const itemData: FileData = item.getItemData()
      const isFile = itemData.type === "file"

      return {
        ...prev?.(), // 이전 feature들의 props 유지
        onClick: (e: MouseEvent) => {
          // 이전 feature들의 onClick 실행
          prev?.()?.onClick?.(e)

          // 파일인 경우 자동으로 열기
          if (isFile) {
            item.openFile()
          }
        },
      }
    },
    openFile: ({ item }) => {
      const itemData: FileData = item.getItemData()
      if (itemData.type === "file") {
        const { openFileInEditor } = useFileExplorerStore.getState()
        openFileInEditor(itemData.path)
      }
    },
  },
}
