import { create } from "zustand"

interface Participant {
  userId: number
  name: string
  profileImageUrl?: string
  isOnline: boolean
}

interface ParticipantsState {
  participants: Record<string, Participant[]> // projectId를 키로 사용
  setParticipants: (projectId: string, participants: Participant[]) => void
  updateParticipantStatus: (projectId: string, userId: number, isOnline: boolean) => void
  getOnlineParticipants: (projectId: string) => Participant[]
  getParticipants: (projectId: string) => Participant[]
}

export const useParticipantsStore = create<ParticipantsState>((set, get) => ({
  participants: {},

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

      return {
        participants: {
          ...state.participants,
          [projectId]: updatedParticipants,
        },
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
