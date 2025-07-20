// CollaborativeEditor.tsx

import { getYjsProviderForRoom } from "@liveblocks/yjs"
import { Editor } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { useCallback, useEffect } from "react"
import { MonacoBinding } from "y-monaco"
import type { Awareness } from "y-protocols/awareness.js"
import { Cursors } from "@/components/Editor/Cursors"
import { useRoom } from "@/config/liveblocks.config"
import { useEditorStore } from "@/stores/editor-store"
import { useUserStore } from "@/stores/user-store"

export function CollaborativeEditor() {
  const room = useRoom()
  const yProvider = getYjsProviderForRoom(room)
  const { userInfo, getUserAsJsonObject, initializeUser } = useUserStore()
  const { editorRef, setEditorRef } = useEditorStore()

  // 🔥 컴포넌트 마운트 시 바로 사용자 초기화
  useEffect(() => {
    if (!userInfo) {
      const newUser = initializeUser()
      console.log("👤 User initialized:", newUser)
    }
  }, [userInfo, initializeUser])

  // 사용자 정보를 Yjs에 설정
  useEffect(() => {
    const jsonUserInfo = getUserAsJsonObject()
    if (jsonUserInfo) {
      yProvider.awareness.setLocalStateField("user", jsonUserInfo)
      console.log("👤 User info set to yProvider:", jsonUserInfo)
    }
  }, [yProvider, getUserAsJsonObject])

  // Monaco 바인딩
  useEffect(() => {
    if (!editorRef) return
    // 🎯 핵심: Monaco를 Liveblocks 룸에 연결
    const binding = new MonacoBinding(
      yProvider
        .getYDoc()
        .getText("monaco"), // 룸 데이터
      editorRef.getModel() as editor.ITextModel, // 에디터
      new Set([editorRef]),
      yProvider.awareness as unknown as Awareness
    )

    return () => binding.destroy()
  }, [editorRef, yProvider])

  const handleOnMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      console.log("🎯 Editor mounted and ready!")
      setEditorRef(editor) // 자동으로 isEditorReady = true로 설정됨
    },
    [setEditorRef]
  )

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <Cursors yProvider={yProvider} />

      <Editor
        defaultLanguage="typescript"
        defaultValue=""
        height="100vh"
        onMount={handleOnMount}
        options={{
          tabSize: 2,
        }}
        theme="vs-light"
        width="100%"
      />
    </div>
  )
}
