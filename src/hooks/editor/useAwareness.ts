import type { getYjsProviderForRoom } from "@liveblocks/yjs"
import { useEffect } from "react"
import { useRoom } from "@/liveblocks.config"
import { useUserStore } from "@/stores/user-store"

/**
 * 실시간 협업에서 사용자 상태 정보(awareness)를 관리하는 훅
 * - 현재 사용자가 어떤 파일을 편집 중인지 다른 사용자들에게 알림
 * - 사용자 정보, 파일 경로, 타임스탬프 등을 실시간으로 공유
 */
export const useAwareness = (
  yProvider: ReturnType<typeof getYjsProviderForRoom>, // Y.js provider 인스턴스
  filePath: string // 현재 편집 중인 파일 경로
) => {
  const room = useRoom() // Liveblocks 방 정보
  const { userInfo } = useUserStore() // 사용자 정보 스토어

  useEffect(() => {
    if (!userInfo) {
      console.log("👤 사용자 정보가 아직 없음, awareness 설정 대기 중...")
      return
    }

    // 다른 사용자들과 공유할 awareness 데이터 구성
    const awarenessData = {
      ...userInfo, // 사용자 기본 정보 (이름, 아이디 등)
      filePath, // 현재 편집 중인 파일 전체 경로
      roomId: room.id, // 현재 협업 방 ID
      timestamp: Date.now(), // 현재 시간 (마지막 활동 시간)
    }

    console.log("👤 Awareness 설정:", awarenessData)

    // Y.js awareness에 로컬 사용자 상태 설정
    // 다른 사용자들이 이 정보를 실시간으로 볼 수 있음
    yProvider.awareness.setLocalStateField("user", awarenessData)
  }, [yProvider, userInfo, filePath, room.id])
}
