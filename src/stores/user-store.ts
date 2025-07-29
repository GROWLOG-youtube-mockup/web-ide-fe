import type { JsonObject } from "@liveblocks/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserInfo {
  email: string // 사용자 이메일 (고유 식별자)
  name: string // 화면에 표시될 사용자 이름
  color?: string // 협업 시 커서 색상 (hex), 계정 단위로 색상설정을 저장할수도 있어서 일단 매개변수로 받음
}

interface UserStore {
  userInfo: UserInfo | null // 현재 로그인된 사용자 정보
  labelsVisible: boolean // 커서 보임/숨김
  /**
   * 커서 라벨 표시/숨김 토글
   */
  toggleCursorLabels: () => void

  /**
   * Liveblocks API 호환 형태로 사용자 정보 반환
   * @returns 사용자 정보 객체 또는 null (미로그인)
   */
  getUserAsJsonObject: () => JsonObject | null

  /**
   * 사용자 정보 업데이트(계정 정보를 받아오는 쪽에서 호출)
   */
  setUserInfo: (userInfo: UserInfo) => void

  /**
   * 임시 사용자로 초기화 (첫 방문자 또는 게스트 모드용)
   */
  initializeUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      getUserAsJsonObject: () => {
        const { userInfo } = get()
        return userInfo ? (userInfo as unknown as JsonObject) : null
      },

      initializeUser: () => {
        const { userInfo } = get()
        // 이미 사용자 정보가 있으면 건너뛰기
        if (userInfo) return

        // 사용자 정보가 없다면 임시 사용자 정보 생성
        const newUserInfo: UserInfo = {
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          email: "guest@example.com", // 게스트 사용자임을 명확히
          name: "게스트 사용자",
        }
        set({ userInfo: newUserInfo })
      },
      labelsVisible: true, // 기본값

      setUserInfo: userInfo => {
        // 🔥 색상이 없으면 랜덤 색상 추가
        const userInfoWithColor = {
          ...userInfo,
          color: userInfo.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        }
        set({ userInfo: userInfoWithColor })
      },

      toggleCursorLabels: () => {
        const { labelsVisible } = get()
        const newState = !labelsVisible

        set({ labelsVisible: newState })
        document.body.classList.toggle("labels-hidden", !newState)
      },
      userInfo: null,
    }),
    {
      name: "userInfo", // localStorage 저장 키
    }
  )
)
