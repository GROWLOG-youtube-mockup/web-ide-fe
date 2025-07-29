import type { getYjsProviderForRoom } from "@liveblocks/yjs"
import type { editor } from "monaco-editor"
import { useEffect, useRef } from "react"
import { MonacoBinding } from "y-monaco"
import type { Awareness } from "y-protocols/awareness.js"

/**
 * Monaco Editor와 Y.js를 바인딩하여 실시간 텍스트 동기화를 구현하는 훅
 * - 여러 사용자가 동시에 편집할 때 텍스트 변경사항을 실시간으로 동기화
 * - 커서 위치, 선택 영역 등도 함께 공유
 */
export const useMonacoBinding = (
  localEditorRef: editor.IStandaloneCodeEditor | null, // Monaco Editor 인스턴스
  yProvider: ReturnType<typeof getYjsProviderForRoom> // Y.js provider
) => {
  // MonacoBinding 인스턴스를 저장할 ref
  const bindingRef = useRef<MonacoBinding | null>(null)

  useEffect(() => {
    // 에디터가 아직 준비되지 않았으면 바인딩 생성하지 않음
    if (!localEditorRef) return

    // 에디터의 텍스트 모델 가져오기
    const model = localEditorRef.getModel()
    if (!model) return

    // 기존 바인딩이 있다면 정리
    if (bindingRef.current) {
      bindingRef.current.destroy()
    }

    // Y.js 문서에서 "monaco"라는 이름의 텍스트 객체 가져오기
    // 이 객체가 실제로 동기화되는 텍스트 데이터
    const yText = yProvider.getYDoc().getText("monaco")

    // Monaco Editor와 Y.js 텍스트를 바인딩
    const binding = new MonacoBinding(
      yText, // Y.js 텍스트 객체
      model as editor.ITextModel, // Monaco Editor 모델
      new Set([localEditorRef]), // 바인딩할 에디터 인스턴스들
      yProvider.awareness as unknown as Awareness // 사용자 상태 정보 (커서, 선택 등)
    )

    bindingRef.current = binding

    // 정리 함수: 컴포넌트 언마운트 시 바인딩 해제
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy()
        bindingRef.current = null
      }
    }
  }, [localEditorRef, yProvider]) // 에디터나 provider가 변경될 때마다 재바인딩
}
