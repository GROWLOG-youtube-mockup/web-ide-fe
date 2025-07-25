//EditorContainer.tsx
import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { getYjsProviderForRoom } from "@liveblocks/yjs"
import { Editor } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { useCallback, useEffect, useState } from "react"
import { MonacoBinding } from "y-monaco"
import type { Awareness } from "y-protocols/awareness.js"
import { LiveblocksProvider, RoomProvider, useRoom } from "@/liveblocks.config"
import { useFileTabStore } from "@/stores/editor-file-store"
import { useUserStore } from "@/stores/user-store"

function CollaborativeEditor({ filePath }: { filePath: string }) {
  const room = useRoom()
  const yProvider = getYjsProviderForRoom(room)

  const { userInfo, getUserAsJsonObject, initializeUser } = useUserStore()

  const [localEditorRef, setLocalEditorRef] = useState<editor.IStandaloneCodeEditor | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  const fileName = filePath.split("/").pop() || filePath
  useEffect(() => {
    if (!userInfo) initializeUser()
  }, [userInfo, initializeUser])

  useEffect(() => {
    const userJson = getUserAsJsonObject()
    if (userJson) {
      yProvider.awareness.setLocalStateField("user", {
        ...userJson,
        fileName,
        filePath,
        roomId: room.id,
      })
    }
  }, [yProvider, getUserAsJsonObject, fileName, filePath, room.id])

  useEffect(() => {
    if (!isEditorReady || !localEditorRef) return

    const model = localEditorRef.getModel()
    if (!model) return

    const yText = yProvider.getYDoc().getText("monaco")
    const binding = new MonacoBinding(
      yText,
      model as editor.ITextModel,
      new Set([localEditorRef]),
      yProvider.awareness as unknown as Awareness
    )

    return () => binding.destroy()
  }, [isEditorReady, localEditorRef, yProvider])

  const handleOnMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
    setLocalEditorRef(editorInstance)
    setIsEditorReady(true)
  }, [])

  return (
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
  )
}

export const EditorContainer = () => {
  const [filePath, setFilePath] = useState("")
  const { openFile, activeTabId, openTabs } = useFileTabStore()
  const handleOpenFile = () => {
    if (filePath.trim()) {
      openFile(filePath.trim())
    }
  }

  const activeTab = openTabs.find(tab => tab.filePath === activeTabId)

  return (
    <div className="flex h-screen flex-col">
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
          onClick={handleOpenFile}
          type="button"
        >
          파일 열기
        </button>
      </header>

      <main className="flex-1">
        {activeTab ? (
          <LiveblocksProvider>
            <RoomProvider id={`room-${activeTab.filePath.replace(/[^a-zA-Z0-9]/g, "-")}`}>
              <ClientSideSuspense fallback={<div />}>
                <CollaborativeEditor filePath={activeTab.filePath} />
              </ClientSideSuspense>
            </RoomProvider>
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
