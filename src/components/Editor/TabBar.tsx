// components/Editor/TabBar.tsx
import { useState } from "react"

/**
 * 파일 탭 정보 인터페이스
 */
interface FileTab {
  fileId: string // 고유 식별자
  fileName: string // 표시할 파일명
  filePath: string // 전체 경로 (툴팁용)
}

/**
 * TabBar 컴포넌트 Props
 */
interface Props {
  tabs: FileTab[] // 열린 파일 탭 목록
  activeFileId: string | null // 현재 활성화된 탭 ID
  onTabClick: (fileId: string) => void // 탭 클릭 시 호출
  onTabClose: (fileId: string) => void // 탭 닫기 시 호출
}

/**
 * 에디터 파일 탭바 컴포넌트
 * - 열린 파일들을 탭 형태로 표시
 * - 탭 간 전환, 닫기 기능 제공
 * - 드래그 앤 드롭으로 탭 순서 변경 지원
 * - 키보드 접근성 지원
 */
export function TabBar({ tabs, activeFileId, onTabClick, onTabClose }: Props) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  // 열린 탭이 없으면 탭바 숨김
  if (tabs.length === 0) {
    return null
  }

  /**
   * 파일 확장자별 아이콘 반환
   * - 파일 타입에 따른 시각적 구분 제공
   * - 안전한 타입 체크 포함
   */
  const getFileIcon = (fileName: string) => {
    // 안전성 검사 - 유효하지 않은 파일명 처리
    if (!fileName || typeof fileName !== "string") {
      return "📄" // 기본 아이콘
    }

    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
        return "🟨" // JavaScript
      case "ts":
      case "tsx":
        return "🔷" // TypeScript
      case "css":
      case "scss":
      case "sass":
        return "🎨" // 스타일시트
      case "html":
      case "htm":
        return "🌐" // HTML
      case "json":
        return "📋" // JSON
      case "md":
      case "markdown":
        return "📝" // Markdown
      case "py":
        return "🐍" // Python
      case "java":
        return "☕" // Java
      case "cpp":
      case "c":
        return "⚙️" // C/C++
      case "xml":
        return "📄" // XML
      case "svg":
        return "🖼️" // SVG
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "🖼️" // 이미지
      default:
        return "📄" // 기본 파일
    }
  }

  /**
   * 키보드 접근성 핸들러
   * - Enter/Space 키로 탭 선택 및 닫기 가능
   * - 스크린 리더 사용자 지원
   */
  const handleKeyDown = (
    event: React.KeyboardEvent,
    fileId: string,
    action: "select" | "close"
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (action === "select") {
        onTabClick(fileId)
      } else {
        onTabClose(fileId)
      }
    }
  }

  /**
   * 탭 드래그 시작 핸들러
   * - 드래그할 탭 정보 설정
   * - 드래그 데이터 전송 설정
   */
  const handleTabDragStart = (event: React.DragEvent, fileId: string) => {
    setDraggedTab(fileId)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", fileId)
  }

  /**
   * 드래그 오버 핸들러
   * - 드롭 가능한 영역임을 표시
   */
  const handleTabDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  /**
   * 탭 드롭 핸들러
   * - 탭 순서 변경 처리
   * - TODO: 실제 탭 순서 변경 로직 구현 필요
   */
  const handleTabDrop = (event: React.DragEvent, targetFileId: string) => {
    event.preventDefault()
    const sourceFileId = event.dataTransfer.getData("text/plain")

    if (sourceFileId !== targetFileId) {
      // TODO: 탭 순서 변경 로직 구현
      console.log(`Move tab ${sourceFileId} to position of ${targetFileId}`)
    }

    setDraggedTab(null)
  }

  return (
    <div aria-label="열린 파일 탭" className="tab-bar" role="tablist">
      {/* 탭 목록 컨테이너 */}
      <div className="tabs-container flex gap-4">
        {tabs.map(tab => (
          <div
            aria-controls={`tabpanel-${tab.fileId}`}
            aria-selected={activeFileId === tab.fileId}
            className={`tab ${activeFileId === tab.fileId ? "active" : ""} ${
              draggedTab === tab.fileId ? "dragging" : ""
            }`}
            draggable // 드래그 가능 설정
            key={tab.fileId}
            onDragOver={handleTabDragOver}
            onDragStart={e => handleTabDragStart(e, tab.fileId)}
            onDrop={e => handleTabDrop(e, tab.fileId)}
            role="tab"
            tabIndex={activeFileId === tab.fileId ? 0 : -1} // 활성 탭만 포커스 가능
          >
            {/* 탭 선택 버튼 */}
            <button
              aria-label={`${tab.fileName} 파일 선택`}
              className="tab-button"
              onClick={() => onTabClick(tab.fileId)}
              onKeyDown={e => handleKeyDown(e, tab.fileId, "select")}
              title={tab.filePath} // 전체 경로 툴팁 표시
              type="button"
            >
              {/* 파일 타입 아이콘 */}
              <span aria-hidden="true" className="tab-icon">
                {getFileIcon(tab.fileName)}
              </span>
              {/* 파일명 */}
              <span className="tab-name">{tab.fileName}</span>
            </button>

            {/* 탭 닫기 버튼 */}
            <button
              aria-label={`${tab.fileName} 파일 닫기`}
              className="tab-close"
              onClick={e => {
                e.stopPropagation() // 탭 선택 이벤트 방지
                onTabClose(tab.fileId)
              }}
              onKeyDown={e => handleKeyDown(e, tab.fileId, "close")}
              title="탭 닫기"
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ))}
      </div>

      {/* 탭 액션 버튼들 */}
      {tabs.length > 0 && (
        <div className="tab-actions">
          {/* 모든 탭 닫기 버튼 */}
          <button
            aria-label="모든 탭 닫기"
            className="tab-action-button"
            onClick={() => {
              // 모든 탭을 순회하며 닫기
              tabs.forEach(tab => onTabClose(tab.fileId))
            }}
            title="모든 탭 닫기"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      )}
    </div>
  )
}
