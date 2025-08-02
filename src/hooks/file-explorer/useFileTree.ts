import {
  dragAndDropFeature,
  expandAllFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
  type TreeInstance, // TreeInstance 타입을 직접 참조할 수 있습니다.
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { Client } from "@stomp/stompjs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import SockJs from "sockjs-client"
import { createFileSystemService } from "@/services/api/file-system-api"
import { useFileTreeStore } from "@/stores/file-tree-store"
import type { TreeNodeDto, WebSocketMessage } from "@/types/api"
import type { FileData } from "@/types/file-explorer"

/**
 * TreeNodeDto를 기존 변환 로직과 호환되는 형태로 변환한다.
 * @param nodes - 서버에서 받은 원본 트리 노드 배열
 * @returns treeData 형태로 변환된 객체
 */
const convertTreeNodeDtoToFileData = (nodes: TreeNodeDto[]): Record<string, FileData> => {
  const result: Record<string, FileData> = {}

  const processNode = (node: TreeNodeDto, isRoot = false) => {
    const path =
      isRoot && node.path === "" ? "/" : node.path.startsWith("/") ? node.path : `/${node.path}`

    const name = isRoot && node.path === "" ? "root" : path.split("/").pop() || path

    const fileData: FileData = {
      id: path,
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

/**
 * 파일 탐색기용 Headless Tree 인스턴스를 생성하고 상태를 관리하는 커스텀 훅이다.
 */
export const useFileTree = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const { expandedItems, setExpandedItems, focusedItem, setFocusedItem } = useFileTreeStore()

  const [treeData, setTreeData] = useState<Record<string, FileData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [isDataReady, setIsDataReady] = useState(false) // 🚀 데이터 준비 완료 상태 추가

  // WebSocket 연결 및 트리 데이터 구독
  useEffect(() => {
    if (!projectId) return

    const client = new Client({
      webSocketFactory: () => new SockJs("/ws"),

      //프록시로!      webSocketFactory: () => new SockJs("http://15.165.2.193:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,

      onConnect: () => {
        setIsConnected(true)
        setStompClient(client)

        // 📥 트리 응답 구독
        client.subscribe(`/topic/projects/${projectId}/tree`, message => {
          const data: WebSocketMessage = JSON.parse(message.body)
          console.log("🔔 수신된 메시지:", data.type)

          if (data.type === "tree:init") {
            const backendNodes = data.payload as TreeNodeDto[]
            const convertedData = convertTreeNodeDtoToFileData(backendNodes)

            setTreeData(convertedData)
            setIsLoading(false)
            setIsDataReady(true) // 🚀 데이터가 성공적으로 로드되었음을 표시
          } else if (data.type === "tree:add") {
            // 전체 트리 새로고침
            client.publish({
              destination: `/app/projects/${projectId}/tree/init`,
              body: "",
            })
          } else if (data.type === "tree:move") {
            // 전체 트리 새로고침
            client.publish({
              destination: `/app/projects/${projectId}/tree/init`,
              body: "",
            })
          } else if (data.type === "tree:remove") {
            // 전체 트리 새로고침
            client.publish({
              destination: `/app/projects/${projectId}/tree/init`,
              body: "",
            })
          } else {
            client.publish({
              destination: `/app/projects/${projectId}/tree/init`,
              body: "",
            })
          }
        })

        // 📤 초기 트리 요청
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

  // fileSystemService 생성 (STOMP 클라이언트 전달)
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

  // dataLoader - WebSocket 데이터 또는 Mock 데이터 사용
  const dataLoader = useMemo(() => {
    if (Object.keys(treeData).length > 0) {
      return {
        getItem: (itemId: string) => treeData[itemId],
        getChildren: (itemId: string) => treeData[itemId]?.children || [],
      }
    }

    // 데이터가 아직 없을 때를 위한 기본 로더
    return {
      getItem: (itemId: string) => ({
        id: itemId,
        name: "Loading...",
        type: "folder" as const,
        path: itemId,
        children: [],
      }),
      getChildren: () => [],
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

  // 🚀 데이터가 준비되면 트리를 명시적으로 재구성한다.
  useEffect(() => {
    if (isDataReady && tree) {
      tree.rebuildTree()
    }
  }, [isDataReady, tree]) // isDataReady 또는 tree 인스턴스가 변경될 때 실행

  // //추가! treeData가 변경될 때마다 트리 강제 재구성
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
  }
}
