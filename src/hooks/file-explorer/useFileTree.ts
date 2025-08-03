import {
  dragAndDropFeature,
  expandAllFeature,
  hotkeysCoreFeature,
  renamingFeature,
  searchFeature,
  selectionFeature,
  syncDataLoaderFeature,
  type TreeInstance,
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { Client } from "@stomp/stompjs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import SockJs from "sockjs-client"
import { createFileSystemService } from "@/services/api/file-system-api"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
import { useFileTreeStore } from "@/stores/file-tree-store"
import type { TreeNodeDto, WebSocketMessage } from "@/types/api"
import type { FileData } from "@/types/file-explorer"

const convertTreeNodeDtoToFileData = (nodes: TreeNodeDto[]): Record<string, FileData> => {
  const result: Record<string, FileData> = {}
  const processNode = (node: TreeNodeDto, isRoot = false) => {
    const path =
      isRoot && node.path === "" ? "/" : node.path.startsWith("/") ? node.path : `/${node.path}`
    const name = isRoot && node.path === "" ? "root" : path.split("/").pop() || path
    const fileData: FileData = {
      id: node.id ? String(node.id) : path,
      name,
      type: node.type as "file" | "folder",
      path,
      children: [],
    }
    if (node.children) {
      node.children.forEach(child => {
        const childPath = child.path.startsWith("/") ? child.path : `/${child.path}`
        fileData.children?.push(childPath)
        processNode(child)
      })
    }
    result[path] = fileData
  }
  nodes.forEach(node => processNode(node, true))
  return result
}

export const useFileTree = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const { expandedItems, setExpandedItems, focusedItem, setFocusedItem } = useFileTreeStore()
  const [treeData, setTreeData] = useState<Record<string, FileData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [isDataReady, setIsDataReady] = useState(false)

  useEffect(() => {
    if (!projectId) return
    const client = new Client({
      webSocketFactory: () => new SockJs("/ws"),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      onConnect: () => {
        setIsConnected(true)
        setStompClient(client)
        client.subscribe(`/topic/projects/${projectId}/tree`, message => {
          console.log("📥 받은 원본 메시지:", message.body)
          const data: WebSocketMessage = JSON.parse(message.body)
          console.log("📦 파싱된 데이터:", data)
          if (data.type === "tree:init") {
            const backendNodes = data.payload as TreeNodeDto[]
            const convertedData = convertTreeNodeDtoToFileData(backendNodes)
            setTreeData(convertedData)
            useEditorTabsStore.getState().updateTreeData(convertedData)
            setIsLoading(false)
            setIsDataReady(true)
          }
        })
        client.publish({
          destination: `/app/projects/${projectId}/tree/init`,
          body: "",
        })
      },
      onStompError: () => {
        setIsLoading(false)
        setIsConnected(false)
      },
      onDisconnect: () => {
        setIsConnected(false)
        setStompClient(null)
      },
    })
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [projectId])

  const fileSystemService = useMemo(() => {
    const stompAdapter = stompClient
      ? {
          subscribe: (destination: string, callback: (message: { body: string }) => void) => {
            return stompClient.subscribe(destination, callback)
          },
          send: (destination: string, headers: Record<string, string> = {}, body = "") => {
            stompClient.publish({ destination, body, headers })
          },
        }
      : undefined
    return createFileSystemService(projectId || "", stompAdapter)
  }, [projectId, stompClient])

  // ✅ 수정된 부분: dataLoader를 더 안정적으로 만듭니다.
  const dataLoader = useMemo(() => {
    return {
      getItem: (itemId: string) => {
        if (treeData[itemId]) {
          return treeData[itemId]
        }
        // 데이터가 일시적으로 없을 때 크래시를 방지하기 위한 폴백(fallback) 데이터
        return {
          id: itemId,
          name: "...",
          type: "file" as const,
          path: itemId,
          children: [],
        }
      },
      getChildren: (itemId: string) => treeData[itemId]?.children || [],
    }
  }, [treeData])

  const tree: TreeInstance<FileData> = useTree<FileData>({
    state: { expandedItems, focusedItem },
    setExpandedItems,
    setFocusedItem,
    rootItemId: "/",
    getItemName: item => String(item.getItemData().name || ""),
    isItemFolder: item => item.getItemData().type === "folder",
    dataLoader,
    indent: 12,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      dragAndDropFeature,
      expandAllFeature,
      hotkeysCoreFeature,
      renamingFeature,
      searchFeature,
    ],
    canDrag: items => items.length > 0,
    canDrop: (_items, target) => target.item.getItemData().type === "folder",
    canReorder: false,
    onDrop: async (items, target) => {
      const targetPath = target.item.getItemData().path
      try {
        await Promise.all(
          items.map(item => {
            const itemPath = item.getItemData().path
            return fileSystemService.move(itemPath, targetPath)
          })
        )
      } catch (error) {
        console.error("파일 이동 실패:", error)
      }
    },
    onRename: async (item, newName) => {
      const itemData = item.getItemData()
      try {
        await fileSystemService.rename(itemData.path, newName)
      } catch (error) {
        console.error("파일 이름 변경 실패:", error)
      }
    },
    canRename: item => item.getId() !== "/",
  })

  useEffect(() => {
    if (isDataReady && tree) {
      tree.rebuildTree()
    }
  }, [isDataReady, tree])

  useEffect(() => {
    if (Object.keys(treeData).length > 0 && tree) {
      setTimeout(() => {
        tree.rebuildTree()
      }, 0)
    }
  }, [treeData, tree])

  const startRenaming = useCallback(
    (itemId: string) => {
      const item = tree.getItemInstance(itemId)
      if (item.canRename()) {
        item.startRenaming()
      }
    },
    [tree]
  )

  const refreshTree = useCallback(async () => {
    if (fileSystemService) {
      await fileSystemService.refreshTree()
    }
  }, [fileSystemService])

  return {
    tree: isLoading ? null : tree,
    expandAll: tree.expandAll,
    collapseAll: tree.collapseAll,
    startRenaming,
    refreshTree,
    isLoading,
    isConnected,
    treeData,
    stompClient,
  }
}
