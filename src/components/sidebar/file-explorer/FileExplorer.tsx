import type { TreeInstance } from "@headless-tree/core"
import type React from "react"
import { useState } from "react"
import { WithContextMenu } from "@/components/common/WithContextMenu"
import { TreeNode } from "@/components/sidebar/file-explorer/TreeNode"
import { useFileExplorerContextMenu } from "@/hooks/file-explorer/useFileExplorerContextMenu"
import { createFileFromTempNode, createFolderFromTempNode } from "@/services/file-operations"
import { useFileTreeStore } from "@/stores/file-tree-store"
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
  const { tempNodes, removeTempNode } = useFileTreeStore()
  const { menuItems } = useFileExplorerContextMenu(
    contextMenuTarget?.filePath || "",
    contextMenuTarget?.isFolder || false
  )

  const handleContextMenu = (e: React.MouseEvent) => {
    const nodeElement = (e.target as Element).closest("[data-filepath]")
    if (nodeElement) {
      const filePath = nodeElement.getAttribute("data-filepath")
      const isFolder = nodeElement.getAttribute("data-isfolder") === "true"
      if (filePath) {
        setContextMenuTarget({ filePath, isFolder })
      }
    }
  }

  // 임시 노드 핸들러들
  const createTempNodeHandlers = (tempNode: (typeof tempNodes)[0]) => ({
    onConfirm: async (name: string) => {
      if (tempNode.isFolder) {
        await createFolderFromTempNode(tempNode.parentPath, name)
      } else {
        await createFileFromTempNode(tempNode.parentPath, name)
      }
      removeTempNode(tempNode.id)
      // 파일 트리 새로고침 - 추후 더 정교한 방법으로 개선 예정
      window.location.reload()
    },
    onCancel: () => {
      removeTempNode(tempNode.id)
    },
  })

  // 트리 아이템들과 임시 노드들을 함께 렌더링하기 위한 함수
  const renderItems = () => {
    const items = []
    const treeItems = tree.getItems()

    // 각 트리 아이템을 렌더링하고, 해당 경로의 임시 노드들도 함께 렌더링
    for (const item of treeItems) {
      const itemData = item.getItemData()
      const itemPath = itemData.path
      const itemLevel = item.getItemMeta().level

      // 현재 아이템 렌더링
      items.push(<TreeNode item={item} key={item.getId()} />)

      // 이 아이템의 자식으로 생성될 임시 노드들을 찾아서 렌더링
      const childTempNodes = tempNodes.filter(tempNode => tempNode.parentPath === itemPath)
      for (const tempNode of childTempNodes) {
        const handlers = createTempNodeHandlers(tempNode)
        items.push(
          <TreeNode
            key={tempNode.id}
            tempNodeData={{
              id: tempNode.id,
              parentPath: tempNode.parentPath,
              isFolder: tempNode.isFolder,
              level: itemLevel + 1,
              ...handlers,
            }}
          />
        )
      }
    }

    // 루트 레벨의 임시 노드들도 렌더링
    const rootTempNodes = tempNodes.filter(
      tempNode => tempNode.parentPath === "/" || tempNode.parentPath === ""
    )
    for (const tempNode of rootTempNodes) {
      const handlers = createTempNodeHandlers(tempNode)
      items.push(
        <TreeNode
          key={tempNode.id}
          tempNodeData={{
            id: tempNode.id,
            parentPath: tempNode.parentPath,
            isFolder: tempNode.isFolder,
            level: 0,
            ...handlers,
          }}
        />
      )
    }

    return items
  }

  return (
    <WithContextMenu menuItems={menuItems}>
      <nav
        aria-label="File Explorer"
        className="w-full"
        onContextMenu={handleContextMenu}
        {...tree.getContainerProps()}
      >
        <ul className="m-0 list-none">{renderItems()}</ul>
      </nav>
    </WithContextMenu>
  )
}
