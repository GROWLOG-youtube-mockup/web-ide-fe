import type { JsonObject } from "@liveblocks/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { login } from "@/services/api/auth"
import { getMyInfo, uploadProfileImage } from "@/services/api/users"
import type { LoginRequest } from "@/types/api"
import { clearPendingProfileImage, getPendingProfileImage } from "@/utils/pending-profile-image"

export interface UserInfo {
  userId?: number // 사용자 ID
  email: string // 사용자 이메일 (고유 식별자)
  name: string // 화면에 표시될 사용자 이름
  profileImage?: string // 프로필 이미지 URL
  color?: string // 협업 시 커서 색상 (hex), 계정 단위로 색상설정을 저장할수도 있어서 일단 매개변수로 받음
}

interface UserStore {
  userInfo: UserInfo | null // 현재 로그인된 사용자 정보
  labelsVisible: boolean // 커서 보임/숨김
  isLoading: boolean // 로그인 로딩 상태

  /**
   * 로그인 액션
   */
  loginUser: (loginData: LoginRequest) => Promise<boolean>

  /**
   * 로그아웃 액션 (Toast와 리다이렉트 포함)
   */
  logoutUser: (showToast?: boolean) => void

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
   * 서버에서 사용자 정보 가져오기
   */
  fetchUserInfo: () => Promise<void>

  /**
   * 임시 사용자로 초기화 (첫 방문자 또는 게스트 모드용)
   */
  initializeUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      labelsVisible: true, // 기본값
      isLoading: false,

      loginUser: async (loginData: LoginRequest): Promise<boolean> => {
        set({ isLoading: true })
        try {
          const response = await login(loginData)
          if (response.success && response.data) {
            const { userId, name, accessToken } = response.data
            localStorage.setItem("accessToken", accessToken)

            const userInfo: UserInfo = {
              userId,
              email: loginData.email,
              name,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            }
            set({ userInfo, isLoading: false })

            // 로그인 성공 후 상세 정보 가져오기
            await get().fetchUserInfo()

            // 회원가입 시 저장된 프로필 이미지가 있다면 자동 업로드
            try {
              const pendingImage = await getPendingProfileImage()
              if (pendingImage) {
                await uploadProfileImage(pendingImage)
                // 업로드 성공 후 저장된 데이터 삭제
                clearPendingProfileImage()
                // 프로필 정보 다시 가져오기
                await get().fetchUserInfo()
              }
            } catch (error) {
              console.error("프로필 이미지 자동 업로드 실패:", error)
              // 실패해도 로그인은 성공으로 처리
            }

            return true
          }
          set({ isLoading: false })
          return false
        } catch (_error) {
          set({ isLoading: false })
          return false
        }
      },

      logoutUser: () => {
        localStorage.removeItem("accessToken")
        set({ userInfo: null })
      },

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

      setUserInfo: userInfo => {
        // 🔥 색상이 없으면 랜덤 색상 추가
        const userInfoWithColor = {
          ...userInfo,
          color: userInfo.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        }
        set({ userInfo: userInfoWithColor })
      },

      fetchUserInfo: async () => {
        try {
          const userInfo = await getMyInfo()
          const currentUserInfo = get().userInfo
          const formattedUserInfo: UserInfo = {
            userId: userInfo.userId,
            name: userInfo.name,
            email: userInfo.email,
            profileImage: userInfo.profileImage,
            // 기존 색상이 있으면 유지, 없으면 새로 생성
            color:
              currentUserInfo?.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }
          set({ userInfo: formattedUserInfo })
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error)
        }
      },

      toggleCursorLabels: () => {
        const { labelsVisible } = get()
        const newState = !labelsVisible

        set({ labelsVisible: newState })
        document.body.classList.toggle("labels-hidden", !newState)
      },
    }),
    {
      name: "userInfo", // localStorage 저장 키
    }
  )
)
