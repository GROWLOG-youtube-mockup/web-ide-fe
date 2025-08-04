import type { editor } from "monaco-editor"
import { useCallback, useEffect } from "react"
import { useLineClickStore } from "@/backup/stores/line-click-store"

export const useLineSharing = (
  filePath: string,
  editorRef: editor.IStandaloneCodeEditor | null,
  isBindingReady: boolean
) => {
  const { setLineClick, isLineSharingMode, disableLineSharingMode, pendingJump, clearPendingJump } =
    useLineClickStore()

  const shareLineClick = useCallback(
    (lineNumber: number) => {
      const fileName = filePath.split("/").pop() || "unknown"
      const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath
      const codeLinkMessage = `[${fileName}:${lineNumber}](ide://${cleanPath}:${lineNumber})`

      setLineClick({ codeLinkMessage })
      disableLineSharingMode()
    },
    [filePath, setLineClick, disableLineSharingMode]
  )

  // 컨텍스트 메뉴 액션 추가
  useEffect(() => {
    if (!editorRef || !isBindingReady) return

    const disposable = editorRef.addAction({
      id: "growlog-share-line",
      label: "Share Code Lines in Chat 💬",
      contextMenuGroupId: "z_growlog",
      contextMenuOrder: 1,

      run: editor => {
        const position = editor.getPosition() // 우클릭한 위치

        if (position) {
          shareLineClick(position.lineNumber)
          console.log(`${filePath}:${position.lineNumber} 공유 완료`)
        }
      },
    })

    return () => disposable.dispose()
  }, [editorRef, isBindingReady, shareLineClick, filePath])

  const executeJump = useCallback(
    (lineNumber: number, column: number = 1) => {
      if (editorRef && isBindingReady) {
        console.log(`🎯 점프 실행: ${lineNumber}:${column} (파일: ${filePath})`)

        const model = editorRef.getModel()
        const maxLine = model ? model.getLineCount() : 1
        const safeLineNumber = Math.min(Math.max(lineNumber, 1), maxLine)
        const safeColumn = Math.max(column, 1)

        editorRef.setPosition({
          lineNumber: safeLineNumber,
          column: safeColumn,
        })
        editorRef.revealLineInCenter(safeLineNumber)
        editorRef.focus()

        console.log(`✅ 점프 완료: ${safeLineNumber}:${safeColumn}`)
      }
    },
    [filePath, editorRef, isBindingReady]
  )

  // 라인 클릭 이벤트 리스너 등록
  useEffect(() => {
    if (!editorRef || !isBindingReady) return

    const disposable = editorRef.onMouseDown(e => {
      const position = e.target.position
      if (position && isLineSharingMode) {
        shareLineClick(position.lineNumber)
      }
    })

    return () => disposable.dispose()
  }, [editorRef, isBindingReady, shareLineClick, isLineSharingMode])

  // 대기 중인 점프 요청 처리
  useEffect(() => {
    if (pendingJump && pendingJump.filePath === filePath && isBindingReady && editorRef) {
      let attempts = 0
      const maxAttempts = 10 // ✅ 10번만 (5초)

      const checkAndJump = () => {
        attempts++

        const model = editorRef.getModel()
        if (model && model.getLineCount() >= pendingJump.lineNumber) {
          const targetLineContent = model.getLineContent(pendingJump.lineNumber)

          console.log(`🎯 타겟 라인 ${pendingJump.lineNumber} 체크 완료:`, targetLineContent)
          executeJump(pendingJump.lineNumber, 1)
          clearPendingJump()
        } else if (attempts < maxAttempts) {
          console.log(
            `⏳ 라인 ${pendingJump.lineNumber} 아직 없음. 현재 라인 수: ${
              model?.getLineCount() || 0
            } (${attempts}/${maxAttempts})`
          )
          setTimeout(checkAndJump, 500) // ✅ 500ms로 변경
        } else {
          console.log(`❌ 점프 시간 초과 (5초). 포기`)
          clearPendingJump()
        }
      }

      checkAndJump()
    }
  }, [pendingJump, filePath, isBindingReady, editorRef, executeJump, clearPendingJump])

  return { shareLineClick, executeJump }
}
