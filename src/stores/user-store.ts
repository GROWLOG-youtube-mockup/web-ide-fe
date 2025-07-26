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
    // TODO: 실제 로그인된 사용자 정보를 가져와야 함
    // 현재는 임시 데이터로 하드코딩
    const userInfo: UserInfo = {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      id: "userData.email", // 실제로는 로그인한 사용자의 이메일
      name: "userData.name", // 실제로는 로그인한 사용자의 닉네임
    }
    set({ userInfo })
  },
  userInfo: null,
}))
