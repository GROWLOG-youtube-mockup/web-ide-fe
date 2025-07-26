import type { FeatureImplementation } from "@headless-tree/core"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
import type { FileData } from "@/types/file-explorer"

/**
 * 파일 클릭 시 에디터 탭에서 열기 기능을 제공하는 headless-tree feature
 *
 * @remarks
 * - 파일 노드 클릭 시 자동으로 에디터 탭에서 파일 열기
 * - 폴더는 영향받지 않으며 기존 확장/축소 동작 유지
 * - 이전 feature들의 onClick 이벤트와 함께 동작
 */
export const openFileFeature: FeatureImplementation<FileData> = {
  itemInstance: {
    getProps: ({ item, prev }) => {
      const itemData: FileData = item.getItemData()

      return {
        ...prev?.(),

        onClick: (e: MouseEvent) => {
          prev?.()?.onClick?.(e)

          // 다중 선택을 방해하지 않도록 Ctrl/Cmd 키가 눌린 경우 파일 열기 스킵
          if (itemData.type === "file" && !e.ctrlKey && !e.metaKey) {
            item.openFile()
          }
        },
      }
    },
    openFile: ({ item }) => {
      const itemData: FileData = item.getItemData()
      if (itemData.type === "file") {
        const { openFileInEditor } = useEditorTabsStore.getState()
        openFileInEditor(itemData.path)
      }
    },
  },
}
