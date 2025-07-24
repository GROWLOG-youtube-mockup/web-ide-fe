import { getYjsProviderForRoom } from "@liveblocks/yjs"
import { Editor } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { useCallback, useEffect, useState } from "react"
import { MonacoBinding } from "y-monaco"
import type { Awareness } from "y-protocols/awareness.js"
import { useRoom } from "@/liveblocks.config"
import { useUserStore } from "@/stores/user-store"
import type { ActiveFileContentProps } from "@/types/editor-type"
import { getLanguage } from "@/types/file-types"

export function CollaborativeEditor({ activeFile }: ActiveFileContentProps) {
  const room = useRoom()
  const yProvider = getYjsProviderForRoom(room)
  const { userInfo, getUserAsJsonObject, initializeUser } = useUserStore()

  const [localEditorRef, setLocalEditorRef] = useState<editor.IStandaloneCodeEditor | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  useEffect(() => {
    if (!userInfo) {
      initializeUser()
    }
  }, [userInfo, initializeUser])

  useEffect(() => {
    const jsonUserInfo = getUserAsJsonObject()
    if (jsonUserInfo) {
      yProvider.awareness.setLocalStateField("user", {
        ...jsonUserInfo,
        fileName: activeFile.fileName || "Unknown",
        roomId: room.id,
      })
    }
  }, [yProvider, getUserAsJsonObject, activeFile, room.id])

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

    return () => {
      binding.destroy()
    }
  }, [isEditorReady, localEditorRef, yProvider])

  const handleOnMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    setLocalEditorRef(editor)
    setIsEditorReady(true)
  }, [])

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Editor
        defaultLanguage={getLanguage(activeFile.fileName)}
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
