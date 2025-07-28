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
import { useFileTree } from "@/hooks/useFileTree"

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

/**
 * 파일 탐색기 액션 버튼들
 *
 * @remarks
 * - 파일 추가, 폴더 추가, 새로고침, 전체 확장/축소 기능 제공
 * - SidebarPanel의 actions prop으로 사용됨
 */
export const FileExplorerActions = () => {
  const { collapseAll, expandAll } = useFileTree()

  // 액션 핸들러들
  const handleAddFile = () => {
    console.log("Add file clicked")
    // TODO: 파일 추가 로직 구현
  }

  const handleAddFolder = () => {
    console.log("Add folder clicked")
    // TODO: 폴더 추가 로직 구현
  }

  const handleRefresh = () => {
    console.log("파일 트리 새로고침")
    // TODO: 파일 트리 새로고침 로직 구현
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
