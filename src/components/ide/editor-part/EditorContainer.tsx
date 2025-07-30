// EditorContainer.tsx
import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { Editor } from "@monaco-editor/react"
import { Cursors } from "@/components/ide/editor-part/Cursors"
import { useCollaborativeEditor } from "@/hooks/editor/useCollaborativeEditor"
import { LiveblocksProvider, RoomProvider, useRoom } from "@/liveblocks.config"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"

const CollaborativeEditor = ({ filePath }: { filePath: string }) => {
  const room = useRoom()

  const { handleOnMount, isLoading, yProvider } = useCollaborativeEditor(filePath)
  const expectedRoomId = `room-${filePath}`

  if (room.id !== expectedRoomId) {
    console.warn(`⚠️ Room 동기화 대기중: ${room.id} vs ${expectedRoomId}`)
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
  // ✅ 변경: 새로운 통합 store와 메서드 이름 사용
  const { activeFile, openedFiles } = useEditorTabsStore()

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1">
        {/* ✅ 변경: openTabs → openedFiles */}
        {openedFiles.length > 0 ? (
          <LiveblocksProvider>
            {openedFiles.map(filePath => (
              <RoomProvider id={`room-${filePath}`} key={filePath}>
                <ClientSideSuspense fallback={<div />}>
                  {/* ✅ 변경: activeTabId → activeFile */}
                  <div className={`h-full ${filePath === activeFile ? "block" : "hidden"}`}>
                    <CollaborativeEditor filePath={filePath} />
                  </div>
                </ClientSideSuspense>
              </RoomProvider>
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
