import { createBrowserRouter } from "react-router-dom"
import { Page as ProfilePage } from "@/app/(user)/profile/page"
import { Page as SigninPage } from "@/app/(user)/signin/page"
import { Page as SignupPage } from "@/app/(user)/signup/page"
import { Page as DevPage } from "@/app/dev/page"
import { Page as EditorPage } from "@/app/editor/page"
import { Error } from "@/app/error"
import { Page } from "@/app/page"
import { Page as ProjectPage } from "@/app/project/[projectId]/page"
import { AuthRoute, ProtectedRoute } from "@/routes/protected-route"

export const router = createBrowserRouter([
  // 개발용 네비게이션 (임시)
  {
    element: <DevPage />,
    errorElement: <Error />,
    path: "/dev",
  },
  // 인증이 필요한 페이지들
  {
    element: <ProtectedRoute />,
    errorElement: <Error />,
    children: [
      {
        element: <ProjectPage />,
        path: "/projects",
      },
      {
        element: <EditorPage />,
        path: "projects/:projectId/ide",
      },
      {
        element: <ProfilePage />,
        path: "/profile",
      },
    ],
  },
  // 인증 페이지들 (로그인된 사용자는 접근 불가)
  {
    element: <AuthRoute />,
    children: [
      {
        element: <Page />,
        path: "/",
      },
      {
        element: <SigninPage />,
        path: "/signin",
      },
      {
        element: <SignupPage />,
        path: "/signup",
      },
    ],
  },
])

export default router
