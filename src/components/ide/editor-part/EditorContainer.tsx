import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Cursors } from "@/components/ide/editor-part/Cursors"
import { useCollaborativeEditor } from "@/hooks/editor/useCollaborativeEditor"
import { useFileTree } from "@/hooks/file-explorer/useFileTree"
import { useProjectPermission } from "@/hooks/permissions/useProjectMembers"
import { LiveblocksProvider, RoomProvider, useRoom } from "@/liveblocks.config"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"

const CollaborativeEditor = ({
  filePath,
  fileId,
  isReadOnly = false,
}: {
  filePath: string
  fileId: string
  isReadOnly?: boolean
}) => {
  const room = useRoom()
  const { projectId } = useParams<{ projectId: string }>()

  const { handleOnMount, isLoading, yProvider } = useCollaborativeEditor(filePath)

  const expectedRoomId = `room-${projectId}-${fileId}`

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
      {isReadOnly && (
        <div className="absolute top-2 right-2 z-20 rounded bg-orange-100 px-2 py-1 text-orange-700 text-xs">
          읽기 전용
        </div>
      )}
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
          readOnly: isReadOnly,
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
  // ✅ 1. useFileTree에서 isLoading 상태를 함께 가져옵니다.
  const { treeData, isLoading: isTreeLoading } = useFileTree()
  const { projectId } = useParams<{ projectId: string }>()

  const { data: permission, isLoading: permissionLoading } = useProjectPermission(projectId || "")
  const isReadOnly = permission?.role === "READ"

  const [connectedFiles, setConnectedFiles] = useState<string[]>([])

  useEffect(() => {
    if (openedFiles.length === 0) {
      setConnectedFiles([])
      return
    }

    if (activeFile) {
      setConnectedFiles([activeFile])
    }

    const timers: NodeJS.Timeout[] = []

    openedFiles.forEach((filePath, index) => {
      if (filePath === activeFile) return

      const timer = setTimeout(
        () => {
          setConnectedFiles(prev => {
            if (prev.includes(filePath)) return prev
            return [...prev, filePath]
          })
        },
        (index + 1) * 500
      )

      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [openedFiles, activeFile])

  // 권한 또는 파일 트리 로딩 중일 때 로딩 화면을 표시합니다.
  if (permissionLoading || (isTreeLoading && openedFiles.length > 0)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          {permissionLoading ? "권한 확인 중..." : "파일 목록 로딩 중..."}
        </div>
      </div>
    )
  }

  return (
    <div className="editor-area !border-t-[var(--tab-accent)] flex h-full flex-col border-t-4 bg-[var(--tab-background)]">
      <main className="flex-1">
        {openedFiles.length > 0 ? (
          <LiveblocksProvider>
            {openedFiles.map(filePath => {
              // ✅ 2. 이 로직은 이제 isTreeLoading이 false일 때만 실행되어 안전합니다.
              const fileData = treeData[filePath]
              const fileId = fileData?.id

              if (!fileId) {
                // 이 경고는 이제 데이터 불일치 시에만 드물게 나타날 것입니다.
                console.warn(`파일 ID를 찾을 수 없음: ${filePath}`)
                return null
              }

              return (
                <div
                  className={`h-full ${filePath === activeFile ? "block" : "hidden"}`}
                  key={filePath}
                >
                  {connectedFiles.includes(filePath) && (
                    <RoomProvider id={`room-${projectId}-${fileId}`}>
                      <ClientSideSuspense fallback={<div />}>
                        <CollaborativeEditor
                          fileId={fileId}
                          filePath={filePath}
                          isReadOnly={isReadOnly}
                        />
                      </ClientSideSuspense>
                    </RoomProvider>
                  )}
                  {!connectedFiles.includes(filePath) && filePath === activeFile && (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        연결 준비 중...
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </LiveblocksProvider>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-black/60">파일을 선택하거나 생성하여 시작하세요.</div>
          </div>
        )}
      </main>
    </div>
  )
}
