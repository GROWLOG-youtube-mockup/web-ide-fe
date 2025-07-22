// components/Editor/TabItem.tsx
import { useState } from "react"
import { ICON_SIZES, LucideIcons } from "@/assets/icons"

interface FileTab {
  fileId: string
  fileName: string
  filePath: string
  isDirty?: boolean
  lastModified?: Date
}

interface Props {
  tab: FileTab
  isActive: boolean
  isFocused: boolean
  maxWidth: number
  onTabClick: (fileId: string) => void
  onTabClose: (fileId: string) => void
}

export function TabItem({ tab, isActive, isFocused, maxWidth, onTabClick, onTabClose }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  /**
   * 파일 확장자별 아이콘 반환
   */
  const getFileIcon = (fileName: string) => {
    if (!fileName || typeof fileName !== "string") {
      return <LucideIcons.fileText className={`${ICON_SIZES.sm} text-zinc-500`} />
    }

    const ext = fileName.split(".").pop()?.toLowerCase()
    const iconProps = `${ICON_SIZES.sm}`

    switch (ext) {
      case "js":
      case "jsx":
        return <LucideIcons.fileText className={`${iconProps} text-yellow-600`} />
      case "ts":
      case "tsx":
        return <LucideIcons.fileText className={`${iconProps} text-blue-600`} />
      case "css":
      case "scss":
        return <LucideIcons.fileText className={`${iconProps} text-purple-600`} />
      case "html":
      case "htm":
        return <LucideIcons.fileText className={`${iconProps} text-orange-600`} />
      case "json":
        return <LucideIcons.fileText className={`${iconProps} text-green-600`} />
      case "md":
        return <LucideIcons.fileText className={`${iconProps} text-gray-600`} />
      default:
        return <LucideIcons.fileText className={`${iconProps} text-zinc-500`} />
    }
  }

  /**
   * 키보드 접근성 핸들러
   */
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      action()
    }
  }

  /**
   * 우클릭 메뉴 핸들러
   */
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowMenu(true)
  }

  /**
   * 중간 클릭으로 탭 닫기
   */
  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 1) {
      // 중간 클릭
      event.preventDefault()
      onTabClose(tab.fileId)
    }
  }

  const baseClassName = `
    relative flex items-center justify-between border-zinc-400 border-r-[3px] px-2 cursor-pointer
    transition-all duration-150 hover:bg-zinc-100
    ${isActive ? "bg-zinc-200" : "bg-neutral-50"}
    ${isFocused && isActive ? "ring-1 ring-blue-500" : ""}
    ${isDragging ? "opacity-50 scale-95" : ""}
  `

  return (
    <div
      aria-selected={isActive}
      className={baseClassName}
      draggable
      onContextMenu={handleContextMenu}
      onDragEnd={() => setIsDragging(false)}
      onDragStart={() => setIsDragging(true)}
      onMouseDown={handleMouseDown}
      role="tab"
      style={{ minWidth: "100px", width: `${maxWidth}px` }}
      tabIndex={isActive ? 0 : -1}
    >
      {/* 메인 탭 버튼 */}
      <button
        className="flex min-w-0 flex-1 items-center gap-[5px]"
        onClick={() => onTabClick(tab.fileId)}
        onKeyDown={e => handleKeyDown(e, () => onTabClick(tab.fileId))}
        title={`${tab.filePath}${tab.isDirty ? " (수정됨)" : ""}`}
        type="button"
      >
        {/* 파일 아이콘 */}
        {getFileIcon(tab.fileName)}

        {/* 파일명 */}
        <span className="truncate font-medium text-black/80 text-sm">{tab.fileName}</span>

        {/* 수정 표시 */}
        {tab.isDirty && <span className="ml-1 text-orange-500 text-xs">●</span>}
      </button>

      {/* 액션 버튼들 */}
      <div className="ml-2 flex items-center gap-1">
        {/* 닫기 버튼 */}
        <button
          className="rounded p-1 hover:bg-red-100"
          onClick={e => {
            e.stopPropagation()
            onTabClose(tab.fileId)
          }}
          onKeyDown={e => handleKeyDown(e, () => onTabClose(tab.fileId))}
          title="닫기"
          type="button"
        >
          <LucideIcons.x className={`${ICON_SIZES.xs} text-zinc-600 hover:text-red-600`} />
        </button>
      </div>

      {/* 컨텍스트 메뉴 */}
      {showMenu && (
        <div className="absolute top-full left-0 z-50 min-w-[150px] rounded border bg-white py-1 shadow-lg">
          <button
            className="w-full px-3 py-1 text-left text-sm hover:bg-zinc-100"
            onClick={() => {
              setShowMenu(false)
            }}
            type="button"
          >
            다른 패널에서 열기
          </button>
          <hr className="my-1" />
          <button
            className="w-full px-3 py-1 text-left text-red-600 text-sm hover:bg-zinc-100"
            onClick={() => {
              onTabClose(tab.fileId)
              setShowMenu(false)
            }}
            type="button"
          >
            닫기
          </button>
        </div>
      )}

      {/* 메뉴 외부 클릭 감지 */}
      {showMenu && (
        <div
          aria-label="메뉴 닫기"
          className="fixed inset-0 z-40" // 역할 명시
          onClick={() => setShowMenu(false)} // 키보드 포커스 가능하게 만듦
          onKeyDown={e => {
            // 키보드 이벤트 추가
            if (e.key === "Escape" || e.key === "Enter") {
              setShowMenu(false)
            }
          }}
          role="button"
          tabIndex={0} // 스크린 리더 지원
        />
      )}
    </div>
  )
}
