import type { JsonObject } from "@liveblocks/client"
import { create } from "zustand"

export interface UserInfo {
  id: string // 사용자 고유 식별자 (이메일)
  name: string // 사용자 표시 이름
  color: string // 협업 시 커서/하이라이트 색상 (hex 형식)
}

interface UserStore {
  userInfo: UserInfo | null // 현재 사용자 정보

  /**
   * 사용자 정보를 Liveblocks에서 사용 가능한 JSON 형태로 변환합니다
   * @returns JsonObject | null - 변환된 사용자 정보 또는 null (로그인하지 않은 경우)
   */
  getUserAsJsonObject: () => JsonObject | null

  /**
   * localStorage에서 사용자 정보를 로드하여 초기화합니다.
   * 저장된 정보가 없는 경우 개발용 임시 데이터를 사용합니다.
   */
  initializeUser: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  getUserAsJsonObject: () => {
    const { userInfo } = get()
    return userInfo ? (userInfo as unknown as JsonObject) : null
  },

  initializeUser: () => {
    const storedData = localStorage.getItem("userInfo")
    const userData = storedData ? JSON.parse(storedData) : null

    const userInfo: UserInfo = {
      // 기존 색상 유지, 없으면 랜덤 생성
      color: userData?.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      id: userData?.email || "test@example.com", // 개발용 임시 데이터
      name: userData?.name || "테스트 사용자", // 개발용 임시 데이터
    }
    set({ userInfo })
  },

  userInfo: null,
}))
