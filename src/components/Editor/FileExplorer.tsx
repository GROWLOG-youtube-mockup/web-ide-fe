// components/Editor/FileExplorer.tsx
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface FileNode {
  id: number
  path: string
  type: "file" | "folder"
  children?: FileNode[]
}

interface Props {
  onFileClick: (fileId: string) => void
}

export function FileExplorer({ onFileClick }: Props) {
  const { projectId } = useParams()
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))
  const [loading, setLoading] = useState(true)
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting"
  )

  // 파일 추가 처리 - useCallback으로 감싸기
  const handleFileAdd = useCallback((payload: { path: string; type: "file" | "folder" }) => {
    setFileTree(prevTree => {
      // 실제 구현 시 트리 구조에 새 파일 추가
      console.log("파일 추가:", payload)
      return prevTree
    })
  }, [])

  // 파일 삭제 처리 - useCallback으로 감싸기
  const handleFileRemove = useCallback((payload: { path: string }) => {
    setFileTree(prevTree => {
      // 실제 구현 시 트리에서 파일 제거
      console.log("파일 삭제:", payload)
      return prevTree
    })
  }, [])

  // 파일 이동 처리 - useCallback으로 감싸기
  const handleFileMove = useCallback((payload: { fromPath: string; toPath: string }) => {
    setFileTree(prevTree => {
      // 실제 구현 시 파일 이동 처리
      console.log("파일 이동:", payload)
      return prevTree
    })
  }, [])

  useEffect(() => {
    // 하드코딩된 projectId (임시)
    const hardcodedProjectId = projectId || "test-project-123"

    // WebSocket 연결
    const ws = new WebSocket(`ws://localhost:8080/projects/${hardcodedProjectId}/tree`)

    ws.onopen = () => {
      console.log("📡 WebSocket 연결됨")
      setWsStatus("connected")
    }

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data)
        console.log("📨 WebSocket 메시지 받음:", data)

        if (data.type === "tree:init") {
          console.log("🌳 파일 트리 초기화:", data.payload)
          setFileTree(data.payload)
          setLoading(false)
        } else if (data.type === "tree:add") {
          console.log("➕ 파일 추가:", data.payload)
          handleFileAdd(data.payload)
        } else if (data.type === "tree:remove") {
          console.log("🗑️ 파일 삭제:", data.payload)
          handleFileRemove(data.payload)
        } else if (data.type === "tree:move") {
          console.log("📁 파일 이동:", data.payload)
          handleFileMove(data.payload)
        }
      } catch (error) {
        console.error("WebSocket 메시지 파싱 에러:", error)
      }
    }

    ws.onerror = error => {
      console.error("📡 WebSocket 에러:", error)
      setWsStatus("disconnected")
      setLoading(false)
    }

    ws.onclose = () => {
      console.log("📡 WebSocket 연결 종료")
      setWsStatus("disconnected")
    }

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [projectId, handleFileAdd, handleFileRemove, handleFileMove]) // dependency 배열에 함수들 추가

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  const handleFileClick = (node: FileNode) => {
    if (node.type === "file") {
      // 🔧 슬래시 제거 추가
      const pathWithoutSlash = node.path.startsWith("/") ? node.path.substring(1) : node.path
      const fileId = pathWithoutSlash.replace(/\./g, "-")
      console.log("📄 파일 클릭:", {
        fileId,
        nodeId: node.id,
        path: node.path,
      })
      onFileClick(fileId)
    }
  }

  // 파일 아이콘 가져오기
  const getFileIcon = (fileName: string) => {
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
  }

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent, node: FileNode) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (node.type === "folder") {
        toggleFolder(node.path)
      } else {
        handleFileClick(node)
      }
    }
  }

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const paddingLeft = depth * 16
    const fileName = node.path.split("/").pop() || node.path

    return (
      <div className="tree-node" key={`${node.id}-${node.path}`}>
        <button
          aria-expanded={node.type === "folder" ? isExpanded : undefined}
          aria-label={
            node.type === "folder"
              ? `${isExpanded ? "폴더 닫기" : "폴더 열기"}: ${fileName}`
              : `파일 열기: ${fileName}`
          }
          className={`file-node ${node.type}`}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.path)
            } else {
              handleFileClick(node)
            }
          }}
          onKeyDown={e => handleKeyDown(e, node)}
          style={{ paddingLeft }}
          type="button"
        >
          {node.type === "folder" && (
            <span aria-hidden="true" className="folder-icon">
              {isExpanded ? "📂" : "📁"}
            </span>
          )}
          {node.type === "file" && (
            <span aria-hidden="true" className="file-icon">
              {getFileIcon(fileName)}
            </span>
          )}
          <span className="node-name">{fileName}</span>
        </button>

        {node.type === "folder" && isExpanded && node.children && (
          <div className="folder-children">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="file-explorer w-80">
      <header className="explorer-header">
        <h3>탐색기</h3>
        <output aria-live="polite" className="ws-status">
          {wsStatus === "connecting" && "🔄 연결중..."}
          {wsStatus === "connected" && "🟢 연결됨"}
          {wsStatus === "disconnected" && "🔴 연결끊김"}
        </output>
      </header>

      {loading ? (
        <output aria-live="polite" className="loading">
          파일 트리 로딩 중...
        </output>
      ) : (
        <nav aria-label="파일 트리" className="file-tree">
          {fileTree.length > 0 ? (
            <div className="tree-container">{fileTree.map(node => renderNode(node))}</div>
          ) : (
            <div className="empty-tree">파일이 없습니다.</div>
          )}
        </nav>
      )}
    </div>
  )
}
