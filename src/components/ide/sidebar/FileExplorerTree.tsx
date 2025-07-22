import type { FileTreeNode } from "@/data/mockFileTree"
import { FileExplorerNode } from "./FileExplorerNode"

interface FileExplorerTreeProps {
  /** 렌더링할 파일 트리 노드 배열 */
  readonly nodes: FileTreeNode[]
  /** 파일 클릭 시 호출되는 콜백 함수 */
  readonly onFileClick?: (path: string) => void
}

/** 빈 파일 메시지 컴포넌트 */
const EmptyFileMessage = () => (
  <div className="px-2 py-4 text-center text-muted-foreground text-sm">파일이 없습니다.</div>
)

/** 루트 폴더를 제외한 노드들을 반환 */
const getVisibleNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
  return nodes[0].children ?? []
}

/**
 * 파일 탐색기 트리 컴포넌트
 *
 * 파일과 폴더의 계층적 트리 뷰를 렌더링하며 접을 수 있는 네비게이션을 제공합니다.
 * 파일 선택 및 폴더 확장/축소 기능을 지원합니다.
 */
export const FileExplorerTree = ({ nodes, onFileClick }: FileExplorerTreeProps) => {
  if (!nodes?.length) {
    return <EmptyFileMessage />
  }

  return (
    <div className="flex h-full flex-col gap-1">
      {getVisibleNodes(nodes).map(node => (
        <FileExplorerNode key={node.path} node={node} onFileClick={onFileClick} />
      ))}
    </div>
  )
}
