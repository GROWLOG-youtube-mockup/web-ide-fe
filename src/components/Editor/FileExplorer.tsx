// components/Editor/FileExplorer.tsx
import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

/**
 * 파일 트리 노드 인터페이스
 * - 재귀적 구조로 폴더/파일 계층 표현
 */
interface FileNode {
  id: number
  path: string
  type: "file" | "folder"
  children?: FileNode[] // 폴더인 경우 하위 파일들
}

/**
 * 파일 탐색기 컴포넌트 Props
 */
interface Props {
  onFileClick: (fileId: string, fileName: string, filePath: string) => void
}

/**
 * 실시간 파일 탐색기 컴포넌트
 * - WebSocket을 통한 실시간 파일 시스템 동기화
 * - 트리 구조로 파일/폴더 표시
 * - 파일 추가/삭제/이동 실시간 반영
 */
export function FileExplorer({ onFileClick }: Props) {
  const { projectId } = useParams()
  const wsRef = useRef<WebSocket | null>(null) // WebSocket 연결 참조
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))
  const [loading, setLoading] = useState(true)
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting"
  )

  /**
   * 파일 추가 이벤트 핸들러
   * - WebSocket으로 받은 파일 추가 메시지 처리
   * - 실시간으로 파일 트리에 새 파일/폴더 추가
   */
  const handleFileAdd = useCallback((payload: { path: string; type: "file" | "folder" }) => {
    setFileTree(prevTree => {
      // TODO: 실제 구현 시 트리 구조에 새 파일 추가 로직
      console.log("파일 추가:", payload)
      return prevTree
    })
  }, [])

  /**
   * 파일 삭제 이벤트 핸들러
   * - WebSocket으로 받은 파일 삭제 메시지 처리
   * - 실시간으로 파일 트리에서 파일/폴더 제거
   */
  const handleFileRemove = useCallback((payload: { path: string }) => {
    setFileTree(prevTree => {
      // TODO: 실제 구현 시 트리에서 파일 제거 로직
      console.log("파일 삭제:", payload)
      return prevTree
    })
  }, [])

  /**
   * 파일 이동 이벤트 핸들러
   * - WebSocket으로 받은 파일 이동 메시지 처리
   * - 실시간으로 파일 위치 변경 반영
   */
  const handleFileMove = useCallback((payload: { fromPath: string; toPath: string }) => {
    setFileTree(prevTree => {
      // TODO: 실제 구현 시 파일 이동 처리 로직
      console.log("파일 이동:", payload)
      return prevTree
    })
  }, [])

  /**
   * WebSocket 연결 및 파일 시스템 실시간 동기화
   * - 프로젝트별 WebSocket 룸 연결
   * - 파일 트리 초기 데이터 수신
   * - 실시간 파일 변경 이벤트 수신
   */
  useEffect(() => {
    // 프로젝트 ID 설정 (개발용 하드코딩)
    const hardcodedProjectId = projectId || "test-project-123"

    // 기존 WebSocket 연결 정리
    if (wsRef.current) {
      wsRef.current.close()
    }

    // 프로젝트별 WebSocket 연결 생성
    const ws = new WebSocket(`ws://localhost:8080/projects/${hardcodedProjectId}/tree`)

    wsRef.current = ws

    /**
     * WebSocket 연결 성공 핸들러
     */
    ws.onopen = () => {
      console.log("📡 WebSocket 연결됨")
      setWsStatus("connected")
    }

    /**
     * WebSocket 메시지 수신 핸들러
     * - 파일 트리 초기화, 파일 추가/삭제/이동 이벤트 처리
     */
    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data)
        console.log("📨 WebSocket 메시지 받음:", data)

        if (data.type === "tree:init") {
          // 파일 트리 초기 데이터 설정
          console.log("🌳 파일 트리 초기화:", data.payload)
          setFileTree(data.payload)
          setLoading(false)
        } else if (data.type === "tree:add") {
          // 실시간 파일 추가
          console.log("➕ 파일 추가:", data.payload)
          handleFileAdd(data.payload)
        } else if (data.type === "tree:remove") {
          // 실시간 파일 삭제
          console.log("🗑️ 파일 삭제:", data.payload)
          handleFileRemove(data.payload)
        } else if (data.type === "tree:move") {
          // 실시간 파일 이동
          console.log("📁 파일 이동:", data.payload)
          handleFileMove(data.payload)
        }
      } catch (error) {
        console.error("WebSocket 메시지 파싱 에러:", error)
      }
    }

    /**
     * WebSocket 에러 핸들러
     */
    ws.onerror = error => {
      console.error("📡 WebSocket 에러:", error)
      setWsStatus("disconnected")
      setLoading(false)
    }

    /**
     * WebSocket 연결 종료 핸들러
     */
    ws.onclose = () => {
      console.log("📡 WebSocket 연결 종료")
      setWsStatus("disconnected")
    }

    // 컴포넌트 언마운트 시 WebSocket 연결 해제 (메모리 누수 방지)
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
      wsRef.current = null
    }
  }, [projectId, handleFileAdd, handleFileRemove, handleFileMove])

  /**
   * 폴더 펼침/접기 토글
   * - 클릭한 폴더의 expanded 상태 변경
   */
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

  /**
   * 파일 클릭 핸들러
   * - 파일 선택 시 상위 컴포넌트에 파일 정보 전달
   * - 에디터에서 해당 파일 열기 위한 데이터 가공
   */
  const handleFileClick = (node: FileNode) => {
    if (node.type === "file") {
      // 파일 경로에서 슬래시 제거
      const pathWithoutSlash = node.path.startsWith("/") ? node.path.substring(1) : node.path

      // 파일 ID 생성 (점을 하이픈으로 변경)
      const fileId = pathWithoutSlash.replace(/\./g, "-")
      const fileName = pathWithoutSlash

      console.log("📄 파일 클릭:", {
        fileId,
        fileName,
        filePath: node.path,
      })

      // 상위 컴포넌트에 파일 정보 전달 (탭 생성용)
      onFileClick(fileId, fileName, node.path)
    }
  }

  /**
   * 파일 확장자별 아이콘 반환
   * - 파일 타입에 따른 시각적 구분
   */
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

  /**
   * 키보드 접근성 핸들러
   * - Enter/Space 키로 파일/폴더 선택 가능
   */
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

  /**
   * 트리 노드 렌더링 함수 (재귀)
   * - 파일/폴더를 계층적으로 표시
   * - 들여쓰기로 depth 표현
   * - 접근성 지원 (aria-label, aria-expanded)
   */
  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const paddingLeft = depth * 16 // 들여쓰기 계산
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
          {/* 폴더 아이콘 */}
          {node.type === "folder" && (
            <span aria-hidden="true" className="folder-icon">
              {isExpanded ? "📂" : "📁"}
            </span>
          )}
          {/* 파일 아이콘 */}
          {node.type === "file" && (
            <span aria-hidden="true" className="file-icon">
              {getFileIcon(fileName)}
            </span>
          )}
          <span className="node-name">{fileName}</span>
        </button>

        {/* 폴더 하위 요소들 재귀 렌더링 */}
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
      {/* 탐색기 헤더 - 연결 상태 표시 */}
      <header className="explorer-header">
        <h3>탐색기</h3>
        <output aria-live="polite" className="ws-status">
          {wsStatus === "connecting" && "🔄 연결중..."}
          {wsStatus === "connected" && "🟢 연결됨"}
          {wsStatus === "disconnected" && "🔴 연결끊김"}
        </output>
      </header>

      {/* 파일 트리 영역 */}
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
