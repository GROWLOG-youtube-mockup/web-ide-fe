//CollaborativeEditor.tsx(5:56최신버전 잠시 방치)

import { getYjsProviderForRoom } from "@liveblocks/yjs"
import { Editor } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { useCallback, useEffect, useState } from "react"
import { MonacoBinding } from "y-monaco"
import type { Awareness } from "y-protocols/awareness.js"
import { Cursors } from "@/components/Editor/Cursors"
import { useRoom } from "@/config/liveblocks.config"

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>()
  const room = useRoom()
  const yProvider = getYjsProviderForRoom(room)

  // 🔥핵심: 사용자 정보 설정
  useEffect(() => {
    const userInfo = {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      id: Math.random().toString(36).substr(2, 9),
      name: `User-${Math.random().toString(36).substr(2, 5)}`,
    }

    yProvider.awareness.setLocalStateField("user", userInfo)
    console.log("👤 User info set:", userInfo)
  }, [yProvider])

  useEffect(() => {
    let binding: MonacoBinding

    if (editorRef) {
      const yDoc = yProvider.getYDoc()
      const yText = yDoc.getText("monaco")

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as unknown as Awareness //타입 에러 clientid 때문에 이중 단언으로 일단 해결
      )
    }

    return () => {
      binding?.destroy()
    }
  }, [editorRef, yProvider])

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e)
  }, [])

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* 커서 스타일 컴포넌트 추가 */}
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
