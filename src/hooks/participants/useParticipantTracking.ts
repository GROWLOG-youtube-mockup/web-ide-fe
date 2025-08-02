import type { Client } from "@stomp/stompjs"
import { useCallback, useEffect } from "react"
import apiClient from "@/services/api"
import { useParticipantsStore } from "@/stores/participants-store"
import { useUserStore } from "@/stores/user-store"

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
  const { setParticipants, updateParticipantStatus } = useParticipantsStore()

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
      console.error("Failed to fetch project members:", error)
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
          updateParticipantStatus(projectId, data.userId, true)

          // 다른 사용자가 입장하면 내 존재를 알림 (랜덤 딜레이로 동시 전송 방지)
          if (data.userId !== userInfo.userId) {
            setTimeout(
              () => {
                stompClient.publish({
                  destination: `/app/projects/${projectId}/chat/enter`,
                  body: "",
                })
              },
              1000 + Math.random() * 1000
            )
          }
        } else if (data.messageType === "LEAVE") {
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
  }, [stompClient, projectId, userInfo, updateParticipantStatus])

  // 프로젝트 멤버 목록 초기 로드
  useEffect(() => {
    fetchProjectMembers()
  }, [fetchProjectMembers])
}
