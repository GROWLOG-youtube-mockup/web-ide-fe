import { useEffect } from "react"
import { useUserStore } from "@/stores/user-store"

/**
 * 협업 에디터용 사용자 정보 초기화 훅
 * - 초기 상태에서 userInfo가 null이므로 임시 사용자 정보를 자동 생성
 * - 로그인 없이도 협업 기능 사용 가능하도록 랜덤 ID/색상 할당
 * - Liveblocks awareness에서 사용자 구분을 위해 필수
 * - userstore에서 사용자 정보를 입력-이후 커서에 반영
 */
export const useUserInitialization = () => {
  const { userInfo, initializeUser } = useUserStore()

  useEffect(() => {
    // 사용자 정보가 없으면 초기화 실행
    if (!userInfo) initializeUser()
  }, [userInfo, initializeUser])
}
