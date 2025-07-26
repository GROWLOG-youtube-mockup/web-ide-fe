import { getYjsProviderForRoom } from "@liveblocks/yjs"
import type { editor } from "monaco-editor"
import { useCallback, useMemo, useState } from "react"
import { useRoom } from "@/liveblocks.config"
import { useAwareness } from "./useAwareness"
import { useMonacoBinding } from "./useMonacoBinding"
import { useUserInitialization } from "./useUserInitialization"

/**
 * 협업 에디터 기능을 통합 관리하는 메인 훅
 * - Liveblocks + Y.js + Monaco Editor를 조합한 실시간 협업 에디터
 * - 사용자 초기화, awareness 공유, 텍스트 동기화를 한번에 처리
 */
export const useCollaborativeEditor = (filePath: string) => {
  const room = useRoom() // Liveblocks 방 인스턴스
  const [isLoading, setIsLoading] = useState(true) // 에디터 로딩 상태

  // Monaco Editor 인스턴스를 저장할 상태
  const [localEditorRef, setLocalEditorRef] = useState<editor.IStandaloneCodeEditor | null>(null)

  // Y.js provider 인스턴스 생성 및 메모이제이션
  // 실시간 협업을 위한 핵심 객체
  const yProvider = useMemo(() => {
    return getYjsProviderForRoom(room)
  }, [room])

  // 사용자 초기화 (사용자 정보 설정, 인증 등)
  useUserInitialization()

  // 사용자 상태 정보(awareness) 관리
  // 다른 사용자들에게 현재 사용자의 활동 상태 알림
  useAwareness(yProvider, filePath)

  // Monaco Editor와 Y.js 바인딩 설정
  // 텍스트 변경사항을 실시간으로 동기화
  useMonacoBinding(localEditorRef, yProvider)

  // Monaco Editor가 마운트될 때 호출되는 콜백 함수
  const handleOnMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    setLocalEditorRef(editor) // 에디터 인스턴스 저장
    setIsLoading(false) // 로딩 상태 해제
  }, [])

  return {
    handleOnMount, // Monaco Editor 마운트 핸들러
    isLoading, // 로딩 상태
    yProvider, // Y.js provider (필요시 외부에서 사용)
  }
}
