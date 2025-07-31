import type { TreeInstance } from "@headless-tree/core"
import type React from "react"
import { useState } from "react"
import { WithContextMenu } from "@/components/common/WithContextMenu"
import { TreeNode } from "@/components/sidebar/file-explorer/TreeNode"
import { useFileExplorerContextMenu } from "@/hooks/file-explorer/useFileExplorerContextMenu"
import type { FileData } from "@/types/file-explorer"

interface FileExplorerProps {
  tree: TreeInstance<FileData>
}

/**
 * Headless Tree 기반의 파일 탐색기 컴포넌트
 *
 * @param tree - 상위 컴포넌트에서 전달받은 tree 인스턴스
 * @returns 파일 트리를 렌더링하는 네비게이션 엘리먼트
 *
 * @remarks
 * - 상위 컴포넌트에서 useFileTree로 생성된 tree 인스턴스를 props로 받음
 * - Headless Tree의 getContainerProps()와 item.getProps()를 활용한 접근성 지원
 * - 각 트리 노드는 TreeNode 컴포넌트로 렌더링
 */
export const FileExplorer = ({ tree }: FileExplorerProps): React.ReactElement => {
  const [contextMenuTarget, setContextMenuTarget] = useState<{
    filePath: string
    isFolder: boolean
  } | null>(null)

  const { menuItems } = useFileExplorerContextMenu(
    contextMenuTarget?.filePath || "",
    contextMenuTarget?.isFolder || false
  )

  const handleContextMenu = (e: React.MouseEvent) => {
    const nodeElement = (e.target as Element).closest("[data-filepath]")
    if (nodeElement) {
      const filePath = nodeElement.getAttribute("data-filepath")
      const isFolder = nodeElement.getAttribute("data-is-folder") === "true"
      if (filePath) {
        setContextMenuTarget({ filePath, isFolder })
      }
    }
  }

  return (
    <WithContextMenu menuItems={menuItems}>
      <nav
        aria-label="File Explorer"
        className="w-full"
        onContextMenu={handleContextMenu}
        {...tree.getContainerProps()}
      >
        <ul className="m-0 list-none">
          {tree.getItems().map(item => (
            <TreeNode item={item} key={item.getId()} />
          ))}
        </ul>
      </nav>
    </WithContextMenu>
  )
}
