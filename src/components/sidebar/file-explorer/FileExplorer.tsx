import type React from "react"
import { TreeNode } from "@/components/sidebar/file-explorer/TreeNode"
import { useFileTree } from "@/hooks/useFileTree"

/**
 * Tree 기반의 파일 탐색기 컴포넌트
 */
export const FileExplorer = (): React.ReactElement => {
  const { tree } = useFileTree()

  return (
    <nav aria-label="File Explorer" className="w-full" {...tree.getContainerProps()}>
      <ul className="m-0 list-none">
        {tree.getItems().map(item => (
          <TreeNode item={item} key={item.getId()} />
        ))}
      </ul>
    </nav>
  )
}
