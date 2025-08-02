import { createBrowserRouter } from "react-router-dom"
import { AuthRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DevNavigationPage } from "@/pages/DevNavigationPage"
import { ErrorPage } from "@/pages/ErrorPage"
import { IdePage } from "@/pages/IdePage"
import LoginPage from "@/pages/LoginPage"
import ProfileEditPage from "@/pages/ProfileEditPage"
import ProjectListPage from "@/pages/ProjectListPage"
import SignUpPage from "@/pages/SignUpPage"

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
    path: "/",
    children: [
      {
        element: <ProjectListPage />,
        index: true, // "/" 경로
      },
      {
        element: <ProjectListPage />,
        path: "projects",
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
