import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useUserStore } from "@/feature/user/stores/user-store"

export const ProtectedRoute = () => {
  const { userInfo, isLoading } = useUserStore()
  const location = useLocation()

  // 로딩 중이면 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  // 토큰이 없거나 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  const token = localStorage.getItem("accessToken")
  if (!token || !userInfo) {
    return <Navigate replace state={{ from: location }} to="/" />
  }

  // 인증된 사용자면 자식 컴포넌트 렌더링
  return <Outlet />
}

// 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하는 것을 방지
export function AuthRoute() {
  const { userInfo } = useUserStore()
  const token = localStorage.getItem("accessToken")

  if (token && userInfo) {
    return <Navigate replace to="/projects" />
  }

  return <Outlet />
}
