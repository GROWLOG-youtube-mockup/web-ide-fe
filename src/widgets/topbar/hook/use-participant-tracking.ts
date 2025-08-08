import type { Client } from "@stomp/stompjs"
import { useCallback, useEffect } from "react"
import { useUserStore } from "@/entities/user/model/user-store.ts"
import { useParticipantsStore } from "@/feature/participants/model/participants-store.ts"
import apiClient from "@/shared/api/api-client.ts"

interface MemberResponse {
  userId: number
  name: string
  profileImageUrl?: string
}

/**
 * 실시간 참여자 추적을 위한 훅
 * @param projectId - 프로젝트 ID
 * @param stompClient - WebSocket STOMP 클라이언트
 */
export function useParticipantTracking(projectId: string, stompClient?: Client | null) {
  const { userInfo } = useUserStore()
  const { setParticipants, updateParticipantStatus, hasAnnouncedTo, markAnnouncedTo } =
    useParticipantsStore()

  // 프로젝트 멤버 목록 가져오기
  const fetchProjectMembers = useCallback(async () => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/members`)

      if (response.data?.data) {
        const members = response.data.data.map((member: MemberResponse) => ({
          userId: member.userId,
          name: member.name,
          profileImageUrl: member.profileImageUrl,
          isOnline: false,
        }))
        setParticipants(projectId, members)
      }
    } catch (error) {
      console.error("Failed to fetch hooks members:", error)
    }
  }, [projectId, setParticipants])

  // WebSocket 연결 및 메시지 처리
  useEffect(() => {
    if (!stompClient || !projectId || !userInfo) return

    // 채팅 메시지 구독
    const subscription = stompClient.subscribe(`/topic/projects/${projectId}/chat`, message => {
      try {
        const data = JSON.parse(message.body)

        if (data.messageType === "ENTER") {
          // 참여자 상태 업데이트
          updateParticipantStatus(projectId, data.userId, true)

          // 새로 들어온 사용자에게 기존 참여자들의 존재를 알리기 위한 재알림
          // (본인이 아닌 경우에만, 그리고 중복 방지)
          if (data.userId !== userInfo.userId && !hasAnnouncedTo(projectId, data.userId)) {
            markAnnouncedTo(projectId, data.userId)
            setTimeout(
              () => {
                stompClient.publish({
                  destination: `/app/projects/${projectId}/chat/enter`,
                  body: "",
                })
              },
              1000 + Math.random() * 1000
            ) // 1-2초 사이 랜덤 지연
          }
        } else if (data.messageType === "LEAVE") {
          // 참여자 상태 업데이트
          updateParticipantStatus(projectId, data.userId, false)
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error)
      }
    })

    // 입장 메시지 전송
    stompClient.publish({
      destination: `/app/projects/${projectId}/chat/enter`,
      body: "",
    })

    // 정리
    return () => {
      stompClient.publish({
        destination: `/app/projects/${projectId}/chat/leave`,
        body: "",
      })
      subscription?.unsubscribe()
    }
  }, [stompClient, projectId, userInfo, updateParticipantStatus, hasAnnouncedTo, markAnnouncedTo])

  // 프로젝트 멤버 목록 초기 로드
  useEffect(() => {
    fetchProjectMembers()
  }, [fetchProjectMembers])
}
