import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { FileTreeNode } from "@/data/mock-file-tree"
import { cn } from "@/lib/utils"
import { useFileExplorerStore } from "@/stores/file-explorer-store"

interface FileExplorerRootProps {
  children: ReactNode
}

interface FileExplorerTreeProps {
  nodes: FileTreeNode[]
}

interface FileExplorerNodeProps {
  node: FileTreeNode
}

const FileExplorerRoot = ({ children }: FileExplorerRootProps) => {
  return <div>{children}</div>
}

const FileExplorerTree = ({ nodes }: FileExplorerTreeProps) => {
  return (
    <div className="space-y-0">
      {nodes.map(node => (
        <FileExplorer.Node key={node.path} node={node} />
      ))}
    </div>
  )
}

/**
 * 개별 파일/폴더 노드 컴포넌트
 *
 * 파일 탐색기 트리에서 하나의 노드를 렌더링하며 다음 기능을 지원합니다:
 * - 파일 선택
 * - 폴더 확장/축소
 * - 중첩된 자식 요소 렌더링
 * - 호버 상태 및 애니메이션
 */
const FileExplorerNode = ({ node }: FileExplorerNodeProps) => {
  const { name, path, type, defaultExpanded, children } = node
  const { folderExpanded, setFolderExpanded, selectedItemInExplorer, openFileInEditor } =
    useFileExplorerStore()

  // 계산된 속성들
  const isFolder: boolean = type === "folder"
  const hasChildren: boolean = Boolean(children?.length)
  const isExpanded = folderExpanded[path] ?? defaultExpanded
  const isSelected = selectedItemInExplorer === path

  // 이벤트 핸들러
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (isFolder) {
      setFolderExpanded(path, !isExpanded)
      return
    }
    openFileInEditor(path)
  }

  // 렌더링 함수들
  const renderIcon = () => {
    if (!isFolder) {
      return <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
    }

    return hasChildren && isExpanded ? (
      <FolderOpen className="h-4 w-4 flex-shrink-0 text-zinc-800" />
    ) : (
      <Folder className="h-4 w-4 flex-shrink-0 text-zinc-800" />
    )
  }

  // 접을 수 있는 폴더 렌더링
  if (isFolder) {
    return (
      <Collapsible onOpenChange={expanded => setFolderExpanded(path, expanded)} open={isExpanded}>
        <CollapsibleTrigger asChild className="ml-4">
          <Button
            className={cn(
              "h-6 w-full cursor-pointer justify-start gap-1.5 font-normal text-sm",
              "hover:bg-zinc-200"
            )}
            size="sm"
            variant="ghost"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
                isExpanded && "rotate-90"
              )}
            />
            {renderIcon()}
            <span className="flex-1 truncate text-left">{name}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4">
          {children?.map(child => (
            <FileExplorer.Node key={child.path} node={child} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // 파일 렌더링
  return (
    <div className="ml-4 flex items-center">
      <div className="h-4 w-4 flex-shrink-0" />
      <Button
        className={cn(
          "h-6 w-full cursor-pointer justify-start gap-1.5 font-normal text-sm",
          "hover:bg-zinc-200",
          isSelected && "bg-zinc-200"
        )}
        onClick={handleClick}
        size="sm"
        variant="ghost"
      >
        {renderIcon()}
        <span className="flex-1 truncate text-left">{name}</span>
      </Button>
    </div>
  )
}

export const FileExplorer = {
  Node: FileExplorerNode,
  Root: FileExplorerRoot,
  Tree: FileExplorerTree,
}
