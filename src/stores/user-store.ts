import type { JsonObject } from "@liveblocks/client"
import { create } from "zustand"

export interface UserInfo {
  id: string // 사용자 고유 식별자
  name: string // 사용자 표시 이름
  color: string // 협업시 커서/하이라이트 색상
}

interface UserStore {
  userInfo: UserInfo | null // 현재 사용자 정보
  getUserAsJsonObject: () => JsonObject | null // 라이브블록용 JSON 변환
  initializeUser: () => void // 사용자 초기화
}

export const useUserStore = create<UserStore>((set, get) => ({
  getUserAsJsonObject: () => {
    const { userInfo } = get()
    return userInfo ? (userInfo as unknown as JsonObject) : null
  },

  initializeUser: () => {
    const userInfo: UserInfo = {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 랜덤 HEX 색상
      id: Math.random().toString(36).substr(2, 9), // 랜덤 9자리 ID
      name: "유저1", // 기본 사용자명
    }
    set({ userInfo }) // 스토어에 저장
  },
  userInfo: null,
}))
