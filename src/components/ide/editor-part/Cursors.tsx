import { useCallback, useEffect } from "react"
import type { UserInfo } from "@/stores/user-store"
import "@/styles/Cursors.css"
import { useUserStore } from "@/stores/user-store"

interface YjsProvider {
  awareness: {
    getStates: () => Map<number, unknown>
    on: (event: string, callback: () => void) => void
    off: (event: string, callback: () => void) => void
  }
}

interface Props {
  yProvider: YjsProvider
}

const CURSOR_STYLES_ID = "collaborative-cursor-styles"
const isValidColor = (color: string): boolean => /^#[0-9a-fA-F]{6}$/.test(color)

export const Cursors = ({ yProvider }: Props) => {
  // 라벨 on/off 버튼과 초기 상태 가져오기
  const { labelsVisible } = useUserStore()
  useEffect(() => {
    document.body.classList.toggle("labels-hidden", !labelsVisible)
  }, [labelsVisible])

  // 협업 커서 스타일 생성 및 업데이트
  const renderCursorStyles = useCallback(() => {
    // 기존 스타일 제거 (중복 방지)
    document.getElementById(CURSOR_STYLES_ID)?.remove()

    if (!yProvider?.awareness) return

    // 현재 접속 중인 모든 사용자의 커서 스타일 생성
    const cursorStyles = [...yProvider.awareness.getStates()]
      .map(([clientId, clientState]) => {
        const user = (clientState as { user?: UserInfo })?.user
        if (!user?.name || !user?.color || !isValidColor(user.color)) return ""

        // 사용자 이름 안전 처리 (특수문자 이스케이프)
        const userName = user.name.slice(0, 20).replace(/['"\\]/g, "\\$&")
        const email = user.email.replace(/['"\\]/g, "\\$&") // 🔥 이메일도 이스케이프

        // 사용자별 커서 스타일 정의
        return `
        .yRemoteSelection-${clientId}, 
        .yRemoteSelectionHead-${clientId} {
          --user-color: ${user.color};
        }
        
        .yRemoteSelectionHead-${clientId}::after {
          content: "${userName}";
        }
        .yRemoteSelectionHead-${clientId}:hover::after {
          content: "${userName} (${email})";
        }`
      })
      .filter(Boolean)
      .join("")

    // 스타일이 있으면 DOM에 추가
    if (cursorStyles) {
      const styleElement = document.createElement("style")
      styleElement.id = CURSOR_STYLES_ID
      styleElement.textContent = cursorStyles
      document.head.appendChild(styleElement)
    }
  }, [yProvider])

  useEffect(() => {
    if (!yProvider?.awareness) return

    // awareness 변경 이벤트 등록 (사용자 입/퇴장, 커서 이동 등)
    yProvider.awareness.on("change", renderCursorStyles)
    // 초기 커서 스타일 렌더링
    renderCursorStyles()

    return () => {
      // 이벤트 리스너 제거 및 스타일 정리
      yProvider.awareness.off("change", renderCursorStyles)
      document.getElementById(CURSOR_STYLES_ID)?.remove()
    }
  }, [yProvider, renderCursorStyles])

  return null
}
