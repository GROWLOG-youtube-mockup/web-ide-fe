import { createBrowserRouter } from "react-router-dom"
import { DevNavigationPage } from "@/DevNavigationPage"
import { ErrorPage } from "@/ErrorPage"
import { IdePage } from "@/editor/IdePage"
import LandingPage from "@/LandingPage"
import ProjectListPage from "@/main/ProjectListPage"
import { AuthRoute, ProtectedRoute } from "@/profile/auth/ProtectedRoute"
import LoginPage from "@/profile/LoginPage"
import ProfileEditPage from "@/profile/ProfileEditPage"
import SignUpPage from "@/profile/SignUpPage"

export const router = createBrowserRouter([
  // 개발용 네비게이션 (임시)
  {
    element: <DevNavigationPage />,
    errorElement: <ErrorPage />,
    path: "/dev",
  },
  // 인증이 필요한 페이지들
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProjectListPage />,
        path: "/projects",
      },
      {
        element: <IdePage />,
        path: "projects/:projectId/ide",
      },
      {
        element: <ProfileEditPage />,
        path: "profile/edit",
      },
    ],
  },
  // 인증 페이지들 (로그인된 사용자는 접근 불가)
  {
    element: <AuthRoute />,
    children: [
      {
        element: <LandingPage />,
        path: "/",
      },
      {
        element: <LoginPage />,
        path: "/login",
      },
      {
        element: <SignUpPage />,
        path: "/signup",
      },
    ],
  },
])

export default router
