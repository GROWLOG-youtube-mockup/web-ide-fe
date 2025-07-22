// components/Editor/FileTree.tsx
import { useCallback, useEffect, useState } from "react"
import {
  type DraggingPosition,
  StaticTreeDataProvider,
  Tree,
  type TreeItem,
  type TreeItemIndex,
  UncontrolledTreeEnvironment,
} from "react-complex-tree"
import "react-complex-tree/lib/style-modern.css"
import { useFileStore } from "@/stores/file-store"

interface FileNode {
  id: number
  path: string
  type: "file" | "folder"
  children?: FileNode[]
}

interface Props {
  fileTree: FileNode[]
  loading: boolean
  wsRef: React.MutableRefObject<WebSocket | null>
  // onFileClick 제거 - 스토어로 대체
}

export function FileTree({ fileTree, loading, wsRef }: Props) {
  const [treeItems, setTreeItems] = useState<Record<TreeItemIndex, TreeItem>>({})

  // Zustand 스토어에서 openFile 가져오기
  const openFile = useFileStore(state => state.openFile)

  const getFileIcon = useCallback((fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "html":
      case "htm":
        return "🌐"
      case "js":
      case "jsx":
        return "🟨"
      case "ts":
      case "tsx":
        return "🔷"
      case "css":
      case "scss":
        return "🎨"
      case "json":
        return "📋"
      case "md":
        return "📝"
      case "py":
        return "🐍"
      case "java":
        return "☕"
      case "txt":
        return "📄"
      default:
        return "📄"
    }
  }, [])

  const convertToTreeItems = useCallback(
    (nodes: FileNode[], parentId: TreeItemIndex = "root"): Record<TreeItemIndex, TreeItem> => {
      const items: Record<TreeItemIndex, TreeItem> = {}

      if (parentId === "root") {
        items.root = {
          canMove: false,
          canRename: false,
          children: nodes.map(node => node.id.toString()),
          data: "📁 프로젝트",
          index: "root",
          isFolder: true,
        }
      }

      nodes.forEach(node => {
        const nodeId = node.id.toString()
        const fileName = node.path.split("/").pop() || node.path
        const isFolder = node.type === "folder"

        items[nodeId] = {
          canMove: true,
          canRename: true,
          children: node.children?.map(child => child.id.toString()) || [],
          data: `${isFolder ? "📁" : getFileIcon(fileName)} ${fileName}`,
          index: nodeId,
          isFolder,
        }

        if (node.children && node.children.length > 0) {
          const childItems = convertToTreeItems(node.children, nodeId)
          Object.assign(items, childItems)
        }
      })

      return items
    },
    [getFileIcon]
  )

  useEffect(() => {
    if (fileTree.length > 0) {
      const items = convertToTreeItems(fileTree)
      setTreeItems(items)
    }
  }, [fileTree, convertToTreeItems])

  const handleFocusItem = useCallback(
    (item: TreeItem) => {
      if (!item.isFolder) {
        const findFileNode = (nodes: FileNode[], targetId: string): FileNode | null => {
          for (const node of nodes) {
            if (node.id.toString() === targetId) {
              return node
            }
            if (node.children) {
              const found = findFileNode(node.children, targetId)
              if (found) return found
            }
          }
          return null
        }

        const fileNode = findFileNode(fileTree, item.index.toString())
        if (fileNode) {
          const pathWithoutSlash = fileNode.path.startsWith("/")
            ? fileNode.path.substring(1)
            : fileNode.path
          const fileId = pathWithoutSlash.replace(/\./g, "-")
          const fileName = pathWithoutSlash

          // onFileClick 대신 스토어의 openFile 사용
          openFile(fileId, fileName, fileNode.path)
        }
      }
    },
    [fileTree, openFile] // onFileClick 제거, openFile 추가
  )

  const handleDrop = useCallback(
    (items: TreeItem[], target: DraggingPosition) => {
      console.log("🔄 드래그앤드롭:", { items, target })

      const getTargetItemId = (position: DraggingPosition): TreeItemIndex | null => {
        if ("targetItem" in position) {
          return position.targetItem
        }
        if ("parentItem" in position) {
          return position.parentItem
        }
        return null
      }

      const targetItemId = getTargetItemId(target)

      if (targetItemId) {
        items.forEach(item => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                payload: {
                  itemId: item.index,
                  targetId: targetItemId,
                  targetType: target.targetType,
                },
                type: "tree:move",
              })
            )
          }
        })
      }
    },
    [wsRef]
  )

  if (loading) {
    return <div className="filetree flex-1 px-1 py-2">파일 트리 로딩 중...</div>
  }

  return (
    <div className="filetree flex-1 px-1 py-2">
      {Object.keys(treeItems).length > 0 ? (
        <UncontrolledTreeEnvironment
          canDragAndDrop
          canDropOnFolder
          canReorderItems
          dataProvider={new StaticTreeDataProvider(treeItems)}
          getItemTitle={item => item.data}
          onDrop={handleDrop}
          onFocusItem={handleFocusItem}
          viewState={{
            "file-tree": {
              expandedItems: ["root", "1"],
            },
          }}
        >
          <Tree rootItem="root" treeId="file-tree" treeLabel="프로젝트 파일" />
        </UncontrolledTreeEnvironment>
      ) : (
        <div>파일이 없습니다.</div>
      )}
    </div>
  )
}
