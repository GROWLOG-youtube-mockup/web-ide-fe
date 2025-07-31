// EditorContainer.tsx
import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from "react" // ✅ 추가
import { Cursors } from "@/components/ide/editor-part/Cursors"
import { useCollaborativeEditor } from "@/hooks/editor/useCollaborativeEditor"
import { LiveblocksProvider, RoomProvider, useRoom } from "@/liveblocks.config"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"

const CollaborativeEditor = ({ filePath }: { filePath: string }) => {
  const room = useRoom()

  const { handleOnMount, isLoading, yProvider } = useCollaborativeEditor(filePath)
  const expectedRoomId = `room-${filePath.replace(/^\//, "")}`
  if (room.id !== expectedRoomId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          동기화 중...
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <Cursors yProvider={yProvider} />
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            로딩 중...
          </div>
        </div>
      )}

      <Editor
        defaultLanguage="javascript"
        defaultValue=""
        height="100%"
        onMount={handleOnMount}
        options={{
          automaticLayout: true,
          fontSize: 14,
          hover: { delay: 500, enabled: true, sticky: false },
          lineNumbers: "on",
          padding: { bottom: 0, top: 30 },
          tabSize: 2,
          wordWrap: "on",
        }}
        theme="vs-light"
        width="100%"
      />
    </div>
  )
}

export const EditorContainer = () => {
  const { activeFile, openedFiles } = useEditorTabsStore()
  // 점진적 연결을 위한 상태 추가
  const [connectedFiles, setConnectedFiles] = useState<string[]>([])
  useEffect(() => {
    if (openedFiles.length === 0) {
      setConnectedFiles([])
      return
    }

    // 1. 활성 파일은 즉시 연결
    if (activeFile) {
      setConnectedFiles([activeFile])
    }

    // 2. 나머지 파일들을 순차적으로 연결 (500ms 간격)
    const timers: NodeJS.Timeout[] = []

    openedFiles.forEach((filePath, index) => {
      if (filePath === activeFile) return

      const timer = setTimeout(
        () => {
          setConnectedFiles(prev => {
            if (prev.includes(filePath)) return prev // 중복 방지
            return [...prev, filePath]
          })
        },
        (index + 1) * 500
      ) // 500ms 간격

      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [openedFiles, activeFile])

  return (
    <div className="editor-area !border-t-[var(--tab-accent)] flex h-full flex-col border-t-4 bg-[var(--tab-background)]">
      <main className="flex-1">
        {openedFiles.length > 0 ? (
          <LiveblocksProvider>
            {openedFiles.map(filePath => (
              <div
                className={`h-full ${filePath === activeFile ? "block" : "hidden"}`}
                key={filePath}
              >
                {connectedFiles.includes(filePath) && (
                  <RoomProvider id={`room-${filePath.replace(/^\//, "")}`}>
                    <ClientSideSuspense fallback={<div />}>
                      <CollaborativeEditor filePath={filePath} />
                    </ClientSideSuspense>
                  </RoomProvider>
                )}

                {/* ✅ 연결 대기 중인 파일들 표시 */}
                {!connectedFiles.includes(filePath) && filePath === activeFile && (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      연결 준비 중...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </LiveblocksProvider>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-black/60">파일 경로를 입력하고 '파일 열기'를 클릭하세요</div>
          </div>
        )}
      </main>
    </div>
  )
}
