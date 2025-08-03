import { create } from "zustand"

interface Participant {
  userId: number
  name: string
  profileImageUrl?: string
  isOnline: boolean
}

interface ParticipantsState {
  participants: Record<string, Participant[]>
  announcedTo: Record<string, Set<number>> // 프로젝트별로 이미 알림한 사용자 ID 저장

  setParticipants: (projectId: string, participants: Participant[]) => void
  updateParticipantStatus: (projectId: string, userId: number, isOnline: boolean) => void
  getOnlineParticipants: (projectId: string) => Participant[]
  getParticipants: (projectId: string) => Participant[]
  hasAnnouncedTo: (projectId: string, userId: number) => boolean
  markAnnouncedTo: (projectId: string, userId: number) => void
}

export const useParticipantsStore = create<ParticipantsState>((set, get) => ({
  participants: {},
  announcedTo: {},
  hasAnnouncedTo: (projectId: string, userId: number) => {
    const announced = get().announcedTo[projectId]
    return announced ? announced.has(userId) : false
  },

  markAnnouncedTo: (projectId: string, userId: number) => {
    set(state => ({
      ...state,
      announcedTo: {
        ...state.announcedTo,
        [projectId]: new Set([...(state.announcedTo[projectId] || []), userId]),
      },
    }))
  },

  setParticipants: (projectId: string, participants: Participant[]) => {
    set(state => ({
      participants: {
        ...state.participants,
        [projectId]: participants,
      },
    }))
  },

  updateParticipantStatus: (projectId: string, userId: number, isOnline: boolean) => {
    set(state => {
      const projectParticipants = state.participants[projectId] || []
      const updatedParticipants = projectParticipants.map(p =>
        p.userId === userId ? { ...p, isOnline } : p
      )

      // 사용자가 오프라인이 될 때 재알림 상태 초기화 (다음 입장 시 다시 알림받을 수 있도록)
      const updatedAnnouncedTo = { ...state.announcedTo }
      if (!isOnline && updatedAnnouncedTo[projectId]) {
        const newAnnouncedSet = new Set(updatedAnnouncedTo[projectId])
        newAnnouncedSet.delete(userId)
        updatedAnnouncedTo[projectId] = newAnnouncedSet
      }

      return {
        participants: {
          ...state.participants,
          [projectId]: updatedParticipants,
        },
        announcedTo: updatedAnnouncedTo,
      }
    })
  },

  getOnlineParticipants: (projectId: string) => {
    const projectParticipants = get().participants[projectId] || []
    return projectParticipants.filter(p => p.isOnline)
  },

  getParticipants: (projectId: string) => {
    return get().participants[projectId] || []
  },
}))
