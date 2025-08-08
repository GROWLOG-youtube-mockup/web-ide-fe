import type { TreeInstance } from "@headless-tree/core"
import type { LucideIcon } from "lucide-react"
import {
  CopyMinusIcon,
  CopyPlusIcon,
  FilePlusIcon,
  FolderPlusIcon,
  RefreshCwIcon,
} from "lucide-react"
import type { MouseEvent } from "react"
import { useFileOperations } from "@/feature/file-explorer/hooks/use-file-operations"
import { Button } from "@/shared/components/custom-button"
import type { FileData } from "@/shared/types/file-explorer"
import { getTargetPathInFileTree } from "@/shared/utils/file-operations"

interface ActionButtonProps {
  icon: LucideIcon
  title: string
  onClick: () => void
  disabled?: boolean
}

/**
 * 파일 탐색기 액션 버튼 컴포넌트
 *
 * @param icon - 표시할 아이콘 컴포넌트
 * @param title - 툴팁으로 표시될 제목
 * @param onClick - 클릭 이벤트 핸들러
 */
const ActionButton = ({ icon: Icon, title, onClick, disabled = false }: ActionButtonProps) => (
  <Button
    className="h-6 w-6 cursor-pointer p-0 hover:bg-zinc-200"
    disabled={disabled}
    onClick={(e: MouseEvent) => {
      e.stopPropagation() // 부모 요소의 클릭 이벤트 방지 (CollapsibleTrigger)
      if (!disabled) {
        onClick()
      }
    }}
    size="default"
    title={title}
    variant="ghost"
  >
    <Icon className="size-5" strokeWidth={1.5} />
  </Button>
)

interface FileExplorerActionsProps {
  // tree가 null일 수 있음을 타입에 명시
  tree: TreeInstance<FileData> | null
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
  const { createFileItem, createFolderItem, refreshTree, isLoading } = useFileOperations()

  return (
    <>
      <ActionButton
        disabled={isLoading}
        icon={FilePlusIcon}
        onClick={() => {
          // tree가 없으면 기본 경로를 '/'로 사용
          const targetPath = tree ? getTargetPathInFileTree(tree) : "/"
          const fileName = prompt("Enter file name:")
          if (fileName) {
            createFileItem(targetPath, fileName)
          }
        }}
        title="Add File"
      />
      <ActionButton
        disabled={isLoading}
        icon={FolderPlusIcon}
        onClick={() => {
          // tree가 없으면 기본 경로를 '/'로 사용
          const targetPath = tree ? getTargetPathInFileTree(tree) : "/"
          const folderName = prompt("Enter folder name:")
          if (folderName) {
            createFolderItem(targetPath, folderName)
          }
        }}
        title="Add Folder"
      />
      <ActionButton
        disabled={isLoading}
        icon={RefreshCwIcon}
        onClick={() => {
          refreshTree()
        }}
        title="Refresh"
      />
      {/* tree가 없을 때 'Expand All', 'Collapse All' 버튼 비활성화 */}
      <ActionButton disabled={!tree} icon={CopyPlusIcon} onClick={expandAll} title="Expand All" />
      <ActionButton
        disabled={!tree}
        icon={CopyMinusIcon}
        onClick={collapseAll}
        title="Collapse All"
      />
    </>
  )
}
