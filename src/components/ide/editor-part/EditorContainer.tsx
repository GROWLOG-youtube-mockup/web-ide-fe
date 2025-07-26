// EditorContainer.tsx
import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { Editor } from "@monaco-editor/react"
import { useState } from "react"
// import { Cursors } from "@/components/ide/editor-part/Cusors";
import { useCollaborativeEditor } from "@/hooks/editor/useCollaborativeEditor"
import { LiveblocksProvider, RoomProvider, useRoom } from "@/liveblocks.config"
import { useFileTabStore } from "@/stores/editor-file-store"

const CollaborativeEditor = ({ filePath }: { filePath: string }) => {
  const room = useRoom()
  const { handleOnMount, isLoading } =
    //이후 커서 표시를 위해 yProvider 사용할 예정
    useCollaborativeEditor(filePath)
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

  console.log(`🎯 에디터 컴포넌트 렌더링: ${filePath} [${new Date().toISOString()}]`)

  return (
    <div className="relative h-full">
      {/*todo : <Cursors yProvider={yProvider} />*/}
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
          lineNumbers: "on",
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
  const [filePath, setFilePath] = useState("")
  const { openFile, activeTabId, openTabs } = useFileTabStore()

  const handleOpenFile = () => {
    if (filePath.trim()) {
      openFile(filePath.trim())
      setFilePath("") // 추가: 입력 후 초기화
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b bg-white p-4">
        <input
          className="flex-1 rounded border px-3 py-2"
          onChange={e => setFilePath(e.target.value)}
          placeholder="파일 경로 입력 (예: /src/App.tsx)"
          type="text"
          value={filePath}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={!filePath.trim()}
          onClick={handleOpenFile} // 추가
          type="button"
        >
          파일 열기
        </button>
      </header>

      <main className="flex-1">
        {openTabs.length > 0 ? (
          <LiveblocksProvider>
            {openTabs.map(tab => (
              <RoomProvider id={`room-${tab.filePath}`} key={tab.filePath}>
                <ClientSideSuspense fallback={<div />}>
                  <div className={`h-full ${tab.filePath === activeTabId ? "block" : "hidden"}`}>
                    <CollaborativeEditor filePath={tab.filePath} />
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
