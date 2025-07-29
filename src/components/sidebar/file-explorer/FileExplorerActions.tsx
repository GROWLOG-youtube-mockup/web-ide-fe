import type { ItemInstance, TreeInstance } from "@headless-tree/core"
import type { LucideIcon } from "lucide-react"
import {
  CopyMinusIcon,
  CopyPlusIcon,
  FilePlusIcon,
  FolderPlusIcon,
  RefreshCwIcon,
} from "lucide-react"
import type { MouseEvent } from "react"
import { Button } from "@/components/ui/Button"
import { fileSystemService } from "@/lib/file-system-service"
import type { FileData } from "@/types/file-explorer"

interface ActionButtonProps {
  icon: LucideIcon
  title: string
  onClick: () => void
}

/**
 * 파일 탐색기 액션 버튼 컴포넌트
 *
 * @param icon - 표시할 아이콘 컴포넌트
 * @param title - 툴팁으로 표시될 제목
 * @param onClick - 클릭 이벤트 핸들러
 */
const ActionButton = ({ icon: Icon, title, onClick }: ActionButtonProps) => (
  <Button
    className="h-6 w-6 cursor-pointer p-0 hover:bg-zinc-200"
    onClick={(e: MouseEvent) => {
      e.stopPropagation() // 부모 요소의 클릭 이벤트 방지 (CollapsibleTrigger)
      onClick()
    }}
    size="default"
    title={title}
    variant="ghost"
  >
    <Icon className="size-5" strokeWidth={1.5} />
  </Button>
)

interface FileExplorerActionsProps {
  tree: TreeInstance<FileData>
  collapseAll: () => void
  expandAll: () => void
  startRenaming: (itemId: string) => void
}

/**
 * 파일 탐색기 액션 버튼들
 *
 * @param tree - 상위 컴포넌트에서 전달받은 tree 인스턴스
 * @param collapseAll - 모든 폴더 축소 함수
 * @param expandAll - 모든 폴더 확장 함수
 * @param startRenaming - 이름 변경 시작 함수
 *
 * @remarks
 * - 파일 추가, 폴더 추가, 새로고침, 전체 확장/축소 기능 제공
 * - SidebarPanel의 actions prop으로 사용됨
 * - 상위 컴포넌트에서 useFileTree로 생성된 인스턴스를 props로 받음
 */
export const FileExplorerActions = ({ tree, collapseAll, expandAll }: FileExplorerActionsProps) => {
  /**
   * 현재 포커스되거나 선택된 항목을 기반으로 대상 폴더 경로를 가져옵니다.
   * 우선순위: 포커스된 항목 > 선택된 항목 > 루트
   */
  const getTargetFolderPath = (): string => {
    const getFolderPathForItem = (item: ItemInstance<FileData>): string => {
      const itemData = item.getItemData()
      if (itemData.type === "folder") {
        return itemData.path
      }
      // 포커스되거나 선택된 항목이 파일이면 부모 폴더 경로 반환
      const pathParts = itemData.path.split("/")
      pathParts.pop() // 파일명 제거
      return pathParts.join("/") || "/"
    }

    // 1. 포커스된 항목 확인
    const focusedItem = tree.getFocusedItem()
    if (focusedItem) {
      return getFolderPathForItem(focusedItem)
    }

    // 2. 선택된 항목 확인
    const selectedItems = tree.getSelectedItems()
    if (selectedItems.length > 0) {
      const selectedItem = selectedItems[0]
      return getFolderPathForItem(selectedItem)
    }

    // 3. 기본값: 루트
    return "/"
  }

  const handleAddFile = () => {
    const targetPath = getTargetFolderPath()
    const defaultFileName = "new-file.txt"
    fileSystemService.createFile(targetPath, defaultFileName)
  }

  const handleAddFolder = () => {
    const targetPath = getTargetFolderPath()
    const defaultFolderName = "new-folder"
    fileSystemService.createFolder(targetPath, defaultFolderName)
  }

  const handleRefresh = () => {
    fileSystemService.refreshTree()
  }

  return (
    <>
      <ActionButton icon={FilePlusIcon} onClick={handleAddFile} title="Add File" />
      <ActionButton icon={FolderPlusIcon} onClick={handleAddFolder} title="Add Folder" />
      <ActionButton icon={RefreshCwIcon} onClick={handleRefresh} title="Refresh" />
      <ActionButton icon={CopyPlusIcon} onClick={expandAll} title="Expand All" />
      <ActionButton icon={CopyMinusIcon} onClick={collapseAll} title="Collapse All" />
    </>
  )
}
