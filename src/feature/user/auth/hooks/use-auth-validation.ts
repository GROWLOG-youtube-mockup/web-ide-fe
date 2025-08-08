import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/entities/user/model/user-store.ts"
import { PATHS } from "@/routes"

export function useAuthValidation() {
  const navigate = useNavigate()
  const { userInfo, logoutUser } = useUserStore()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    // 토큰이 없거나 사용자 정보가 없으면 로그아웃 처리 후 로그인 페이지로 이동
    if (!token || !userInfo) {
      logoutUser()
      navigate(PATHS.signin)
      return
    }

    // 토큰 만료 검사 (JWT 토큰의 경우)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Math.floor(Date.now() / 1000)

      if (payload.exp && payload.exp < currentTime) {
        logoutUser()
        navigate(PATHS.signin)
      }
    } catch (_error) {
      // 토큰 파싱 실패 시 로그아웃
      logoutUser()
      navigate(PATHS.signin)
    }
  }, [userInfo, navigate, logoutUser])

  return { isAuthenticated: !!userInfo && !!localStorage.getItem("accessToken") }
}
