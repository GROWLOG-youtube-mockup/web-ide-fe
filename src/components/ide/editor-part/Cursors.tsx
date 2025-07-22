// components/Editor/Cursors.tsx
import { useEffect, useState } from "react"

/**
 * Yjs Provider의 awareness 시스템 인터페이스
 * - 실시간 협업 중인 사용자들의 상태 정보 관리
 */
interface Yprovider {
  awareness: {
    getStates: () => Map<number, unknown>
    on: (event: string, callback: () => void) => void
    off: (event: string, callback: () => void) => void
  }
}

/**
 * Cursors 컴포넌트 Props
 */
interface Props {
  yProvider: Yprovider
}

/**
 * 협업 중인 사용자 정보 타입
 * - [클라이언트ID, 사용자정보] 튜플 배열
 */
type AwarenessList = [number, { user?: { name: string; color: string } }][]

/**
 * 실시간 협업 커서 및 선택 영역 표시 컴포넌트
 * - 다른 사용자들의 커서 위치와 선택 영역을 시각적으로 표시
 * - 사용자별 고유 색상과 이름 라벨 제공
 * - Monaco Editor와 연동하여 실시간 협업 시각화
 */
export function Cursors({ yProvider }: Props) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([])

  /**
   * Yjs Awareness 이벤트 리스너 설정
   * - 협업 중인 사용자 목록 실시간 업데이트
   * - 사용자 접속/종료 시 자동 반영
   */
  useEffect(() => {
    if (!yProvider) return

    /**
     * 현재 접속 중인 사용자 목록 업데이트
     * - awareness 상태 변경 시 호출
     */
    function setUsers() {
      const states = [...yProvider.awareness.getStates()]
      setAwarenessUsers(states as AwarenessList)
      console.log("🔍 Awareness users:", states) // 디버깅용
    }

    // awareness 변경 이벤트 리스너 등록
    yProvider.awareness.on("change", setUsers)
    // 초기 사용자 목록 설정
    setUsers()

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      yProvider.awareness.off("change", setUsers)
    }
  }, [yProvider])

  /**
   * 동적 CSS 스타일 생성 및 적용
   * - 협업 중인 각 사용자별 커서/선택 영역 스타일 생성
   * - Monaco Editor의 yRemoteSelection 클래스와 연동
   * - 사용자 변경 시 스타일 자동 업데이트
   */
  useEffect(() => {
    console.log("🎨 Generating CSS for users:", awarenessUsers) // 디버깅용

    // 기존 커서 스타일 제거 (중복 방지)
    const existing = document.getElementById("cursor-styles")
    if (existing) existing.remove()

    // 협업 중인 사용자가 없으면 스타일 생성하지 않음
    if (awarenessUsers.length === 0) {
      console.log("❌ No awareness users found")
      return
    }

    // 동적 CSS 스타일 엘리먼트 생성
    const style = document.createElement("style")
    style.id = "cursor-styles"

    /**
     * 사용자별 커서 및 선택 영역 CSS 규칙 생성
     * - 선택 영역: 반투명 배경색으로 표시
     * - 커서: 사용자 색상의 세로선으로 표시
     * - 라벨: 커서 위에 사용자 이름 툴팁 표시
     */
    const cssRules = awarenessUsers
      .filter(([_, client]) => client?.user) // 사용자 정보가 있는 클라이언트만 필터링
      .map(([clientId, client]) => {
        console.log(`✅ Creating style for client ${clientId}:`, client.user) // 디버깅용

        return `
          /* 선택 영역 스타일 - 반투명 배경 */
          .yRemoteSelection-${clientId} {
            background-color: ${client.user?.color}40 !important;
          }
          /* 커서 스타일 - 세로선 */
          .yRemoteSelectionHead-${clientId} {
            background-color: ${client.user?.color} !important;
            position: relative !important;
            width: 2px !important;
          }
          /* 사용자 이름 라벨 - 커서 위 툴팁 */
          .yRemoteSelectionHead-${clientId}::after {
            content: "${client.user?.name}";
            position: absolute !important;
            top: -24px !important;
            left: 0 !important;
            background-color: ${client.user?.color} !important;
            color: white !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            white-space: nowrap !important;
            border-radius: 4px !important;
            z-index: 10000 !important;
            pointer-events: none !important;
          }
        `
      })

    // 생성된 CSS 규칙들을 스타일 엘리먼트에 적용
    style.textContent = cssRules.join("\n")

    console.log("🎨 Generated CSS:", style.textContent) // 디버깅용

    // CSS가 생성되었으면 document head에 추가
    if (style.textContent.trim()) {
      document.head.appendChild(style)
      console.log("✅ CSS added to head")
    }

    // 컴포넌트 언마운트 또는 사용자 변경 시 기존 스타일 정리
    return () => {
      const el = document.getElementById("cursor-styles")
      if (el) {
        el.remove()
        console.log("🗑️ CSS cleaned up")
      }
    }
  }, [awarenessUsers])

  // 이 컴포넌트는 UI를 렌더링하지 않고 CSS만 동적으로 생성/관리
  return null
}
