import type { getYjsProviderForRoom } from "@liveblocks/yjs"
import { useEffect, useMemo } from "react"
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
  const { getUserAsJsonObject } = useUserStore() // 사용자 정보를 가져오는 함수

  // 사용자 정보를 JSON 객체로 변환하여 메모이제이션
  const userJson = useMemo(() => getUserAsJsonObject(), [getUserAsJsonObject])

  useEffect(() => {
    if (userJson) {
      // 다른 사용자들과 공유할 awareness 데이터 구성
      const awarenessData = {
        ...userJson, // 사용자 기본 정보 (이름, 아이디 등)
        filePath, // 현재 편집 중인 파일 전체 경로
        roomId: room.id, // 현재 협업 방 ID
        timestamp: Date.now(), // 현재 시간 (마지막 활동 시간)
      }

      // Y.js awareness에 로컬 사용자 상태 설정
      // 다른 사용자들이 이 정보를 실시간으로 볼 수 있음
      yProvider.awareness.setLocalStateField("user", awarenessData)
    }
  }, [yProvider, userJson, filePath, room.id])
}
