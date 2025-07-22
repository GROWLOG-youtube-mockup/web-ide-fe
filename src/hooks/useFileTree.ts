// hooks/useFileTree.ts
import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

interface FileNode {
  id: number
  path: string
  type: "file" | "folder"
  children?: FileNode[]
}

export function useFileTree() {
  const { projectId } = useParams()
  const wsRef = useRef<WebSocket | null>(null)
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [loading, setLoading] = useState(true)
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting"
  )

  // WebSocket 이벤트 핸들러들
  const handleFileAdd = useCallback((payload: { path: string; type: "file" | "folder" }) => {
    setFileTree(prevTree => {
      console.log("파일 추가:", payload)
      return prevTree
    })
  }, [])

  const handleFileRemove = useCallback((payload: { path: string }) => {
    setFileTree(prevTree => {
      console.log("파일 삭제:", payload)
      return prevTree
    })
  }, [])

  const handleFileMove = useCallback((payload: { fromPath: string; toPath: string }) => {
    setFileTree(prevTree => {
      console.log("파일 이동:", payload)
      return prevTree
    })
  }, [])

  // WebSocket 연결 로직
  useEffect(() => {
    const hardcodedProjectId = projectId || "test-project-123"
    //더미 데이터
    const mockFileTree = [
      {
        children: [
          { id: 2, path: "/index.html", type: "file" as const },
          { id: 3, path: "/style.css", type: "file" as const },
          { id: 4, path: "/script.js", type: "file" as const },
          {
            children: [
              { id: 6, path: "/assets/logo.png", type: "file" as const },
              { id: 7, path: "/assets/main.scss", type: "file" as const },
            ],
            id: 5,
            path: "/assets",
            type: "folder" as const,
          },
        ],
        id: 1,
        path: "/",
        type: "folder" as const,
      },
    ]

    if (wsRef.current) {
      wsRef.current.close()
    }

    const ws = new WebSocket(`ws://localhost:8080/projects/${hardcodedProjectId}/tree`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("📡 WebSocket 연결됨")
      setWsStatus("connected")
    }

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data)
        console.log("📨 WebSocket 메시지 받음:", data)

        if (data.type === "tree:init") {
          setFileTree(data.payload)
          setLoading(false)
        } else if (data.type === "tree:add") {
          handleFileAdd(data.payload)
        } else if (data.type === "tree:remove") {
          handleFileRemove(data.payload)
        } else if (data.type === "tree:move") {
          handleFileMove(data.payload)
        }
      } catch (error) {
        console.error("WebSocket 메시지 파싱 에러:", error)
      }
    }

    ws.onerror = error => {
      console.error("📡 WebSocket 에러:", error)
      setFileTree(mockFileTree)
      setWsStatus("disconnected")
      setLoading(false)
    }

    ws.onclose = () => {
      console.log("📡 WebSocket 연결 종료")
      setWsStatus("disconnected")
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
      wsRef.current = null
    }
  }, [projectId, handleFileAdd, handleFileRemove, handleFileMove])

  return {
    fileTree,
    loading,
    wsRef,
    wsStatus,
  }
}
