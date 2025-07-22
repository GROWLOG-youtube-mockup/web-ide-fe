// CollaborativeEditor.tsx

import { getYjsProviderForRoom } from "@liveblocks/yjs"
import { Editor } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { useCallback, useEffect, useState } from "react"
import { MonacoBinding } from "y-monaco"
import type { Awareness } from "y-protocols/awareness.js"
import { Cursors } from "@/components/ide/editor-part/Cursors"
import { useRoom } from "@/liveblocks.config"
import { useEditorStore } from "@/stores/editor-store"
import { useUserStore } from "@/stores/user-store"

/**
 * 실시간 협업 코드 에디터 컴포넌트
 * - Liveblocks를 통한 실시간 동기화
 * - Monaco Editor 기반 코드 편집
 * - 멀티 커서 및 사용자 인식 기능
 */
export function CollaborativeEditor() {
  const room = useRoom()
  const yProvider = getYjsProviderForRoom(room)
  const { userInfo, getUserAsJsonObject, initializeUser } = useUserStore()
  const { editorRef, setEditorRef } = useEditorStore()
  const [isEditorReady, setIsEditorReady] = useState(false)

  // 내가 실제로 사용하는 yProvider 데이터들
  // const yProvider = getYjsProviderForRoom(room);
  // 📝 공유 텍스트 데이터 (에디터 내용)
  // yProvider.getYDoc().getText("monaco") // "function hello() {\n  console.log('world');\n}"
  // 👥 사용자 커서/선택 정보 (다른 사용자들 위치 표시용)
  // yProvider.awareness // 실시간 커서 위치, 사용자 색상, 선택 영역
  // 🏠 룸 연결 정보
  // yProvider.room // 현재 연결된 룸 객체
  // 🆔 내 클라이언트 ID
  //yProvider.awareness.clientID // 12345 (내 고유 ID)
  // 👥 다른 사용자들 클라이언트 ID
  //yProvider.awareness.getStates()
  //실제로는 그냥 창 별로 클라이언트 ID가 존재

  /**
   * 사용자 초기화
   * - 컴포넌트 마운트 시 사용자 정보가 없으면 새로 생성
   * - 협업을 위한 사용자 식별 정보 설정
   */
  useEffect(() => {
    if (!userInfo) {
      const newUser = initializeUser()
      console.log("👤 User initialized:", newUser)
    }
  }, [userInfo, initializeUser])

  /**
   * 협업 인식 시스템 설정
   * - Yjs awareness에 현재 사용자 정보 등록
   * - 다른 사용자들에게 내 존재를 알림 (커서, 선택 영역 등)
   */
  useEffect(() => {
    const jsonUserInfo = getUserAsJsonObject()
    if (jsonUserInfo) {
      yProvider.awareness.setLocalStateField("user", jsonUserInfo)
      console.log("👤 User info set to yProvider:", jsonUserInfo)
    }
  }, [yProvider, getUserAsJsonObject])

  /**
   * Monaco Editor와 Yjs 실시간 동기화 바인딩
   * - 에디터의 텍스트 변경사항을 실시간으로 동기화
   * - 다른 사용자의 편집 내용을 실시간으로 반영
   * - 커서 위치 및 선택 영역 공유
   */
  useEffect(() => {
    if (!isEditorReady || !editorRef) return

    const model = editorRef.getModel()
    if (!model) {
      console.warn("Monaco model is not ready")
      return
    }

    // 핵심: Monaco Editor를 Liveblocks 룸에 연결하여 실시간 협업 활성화
    // 이런 로직 : 유저1 에디터 ←→ MonacoBinding ←→ yProvider ←→ MonacoBinding ←→ 유저2 에디터
    const binding = new MonacoBinding(
      yProvider
        .getYDoc()
        .getText("monaco"), // 공유 문서 데이터
      model as editor.ITextModel, // Monaco 에디터 모델
      new Set([editorRef]), // 에디터 인스턴스 집합
      yProvider.awareness as unknown as Awareness // 사용자 인식 시스템
    )

    // 컴포넌트 언마운트 시 바인딩 해제로 메모리 누수 방지
    return () => binding.destroy()
  }, [isEditorReady, editorRef, yProvider])

  /**
   * Monaco Editor 마운트 핸들러
   * - 에디터 준비 완료 시 참조 저장 및 상태 업데이트
   * - useCallback으로 불필요한 재렌더링 방지 (성능 최적화)
   */
  const handleOnMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      console.log("🎯 Editor mounted and ready!")
      setEditorRef(editor) // 전역 상태에 에디터 참조 저장
      setIsEditorReady(true) // 바인딩 준비 완료 신호
    },
    [setEditorRef]
  )

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* 협업 중인 다른 사용자들의 커서 표시 */}
      <Cursors yProvider={yProvider} />

      {/* Monaco 코드 에디터 */}
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
