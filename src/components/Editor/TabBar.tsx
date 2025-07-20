// components/Editor/TabBar.tsx
import { useState } from "react"

interface FileTab {
  fileId: string
  fileName: string
  filePath: string
}

interface Props {
  tabs: FileTab[]
  activeFileId: string | null
  onTabClick: (fileId: string) => void
  onTabClose: (fileId: string) => void
}

export function TabBar({ tabs, activeFileId, onTabClick, onTabClose }: Props) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  if (tabs.length === 0) {
    return null
  }

  const getFileIcon = (fileName: string) => {
    // 🔧 안전 처리 추가
    if (!fileName || typeof fileName !== "string") {
      return "📄" // 기본 아이콘
    }

    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
        return "🟨"
      case "ts":
      case "tsx":
        return "🔷"
      case "css":
      case "scss":
      case "sass":
        return "🎨"
      case "html":
      case "htm":
        return "🌐"
      case "json":
        return "📋"
      case "md":
      case "markdown":
        return "📝"
      case "py":
        return "🐍"
      case "java":
        return "☕"
      case "cpp":
      case "c":
        return "⚙️"
      case "xml":
        return "📄"
      case "svg":
        return "🖼️"
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "🖼️"
      default:
        return "📄"
    }
  }

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

  const handleTabDragStart = (event: React.DragEvent, fileId: string) => {
    setDraggedTab(fileId)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", fileId)
  }

  const handleTabDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

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
      <div className="tabs-container flex gap-4">
        {/* 🔥 index 파라미터 제거 */}
        {tabs.map(tab => (
          <div
            aria-controls={`tabpanel-${tab.fileId}`}
            aria-selected={activeFileId === tab.fileId}
            className={`tab ${activeFileId === tab.fileId ? "active" : ""} ${
              draggedTab === tab.fileId ? "dragging" : ""
            }`}
            draggable
            key={tab.fileId}
            onDragOver={handleTabDragOver}
            onDragStart={e => handleTabDragStart(e, tab.fileId)}
            onDrop={e => handleTabDrop(e, tab.fileId)}
            role="tab"
            tabIndex={activeFileId === tab.fileId ? 0 : -1}
          >
            <button
              aria-label={`${tab.fileName} 파일 선택`}
              className="tab-button"
              onClick={() => onTabClick(tab.fileId)}
              onKeyDown={e => handleKeyDown(e, tab.fileId, "select")}
              title={tab.filePath}
              type="button"
            >
              <span aria-hidden="true" className="tab-icon">
                {getFileIcon(tab.fileName)}
              </span>
              <span className="tab-name">{tab.fileName}</span>
            </button>

            <button
              aria-label={`${tab.fileName} 파일 닫기`}
              className="tab-close"
              onClick={e => {
                e.stopPropagation()
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

      {tabs.length > 0 && (
        <div className="tab-actions">
          <button
            aria-label="모든 탭 닫기"
            className="tab-action-button"
            onClick={() => {
              // TODO: 모든 탭 닫기
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
