import type React from "react"
import { TreeNode } from "@/components/sidebar/file-explorer/TreeNode"
import { useFileTree } from "@/hooks/useFileTree"

/**
 * Headless Tree 기반의 파일 탐색기 컴포넌트
 *
 * @returns 파일 트리를 렌더링하는 네비게이션 엘리먼트
 *
 * @remarks
 * - Zustand store를 통해 트리 상태를 직접 관리
 * - Headless Tree의 getContainerProps()와 item.getProps()를 활용한 접근성 지원
 * - 각 트리 노드는 TreeNode 컴포넌트로 렌더링
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
