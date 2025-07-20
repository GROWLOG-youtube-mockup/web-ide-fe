// components/Editor/Cursors.tsx
import { useEffect, useState } from "react"

interface Yprovider {
  awareness: {
    getStates: () => Map<number, unknown>
    on: (event: string, callback: () => void) => void
    off: (event: string, callback: () => void) => void
  }
}

interface Props {
  yProvider: Yprovider
}

type AwarenessList = [number, { user?: { name: string; color: string } }][]

export function Cursors({ yProvider }: Props) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([])

  useEffect(() => {
    if (!yProvider) return

    function setUsers() {
      const states = [...yProvider.awareness.getStates()]
      setAwarenessUsers(states as AwarenessList)
      console.log("🔍 Awareness users:", states) // 디버깅
    }

    yProvider.awareness.on("change", setUsers)
    setUsers()

    return () => {
      yProvider.awareness.off("change", setUsers)
    }
  }, [yProvider])

  useEffect(() => {
    console.log("🎨 Generating CSS for users:", awarenessUsers) // 디버깅

    // 기존 스타일 제거
    const existing = document.getElementById("cursor-styles")
    if (existing) existing.remove()

    // 사용자가 없으면 스타일 생성 안 함
    if (awarenessUsers.length === 0) {
      console.log("❌ No awareness users found")
      return
    }

    // CSS 생성
    const style = document.createElement("style")
    style.id = "cursor-styles"

    const cssRules = awarenessUsers
      .filter(([_, client]) => client?.user)
      .map(([clientId, client]) => {
        console.log(`✅ Creating style for client ${clientId}:`, client.user) // 디버깅

        return `
          .yRemoteSelection-${clientId} {
            background-color: ${client.user?.color}40 !important;
          }
          .yRemoteSelectionHead-${clientId} {
            background-color: ${client.user?.color} !important;
            position: relative !important;
            width: 2px !important;
          }
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

    style.textContent = cssRules.join("\n")

    console.log("🎨 Generated CSS:", style.textContent) // 디버깅

    if (style.textContent.trim()) {
      document.head.appendChild(style)
      console.log("✅ CSS added to head")
    }

    return () => {
      const el = document.getElementById("cursor-styles")
      if (el) {
        el.remove()
        console.log("🗑️ CSS cleaned up")
      }
    }
  }, [awarenessUsers])

  return null
}
