import { createBrowserRouter } from "react-router-dom"
import { DevNavigationPage } from "@/pages/DevNavigationPage"
import { ErrorPage } from "@/pages/ErrorPage"
import { IdePage } from "@/pages/IdePage"
import LoginPage from "@/pages/LoginPage"
import ProfileEditPage from "@/pages/ProfileEditPage"
import SignUpPage from "@/pages/SignUpPage"

export const router = createBrowserRouter([
  {
    element: <DevNavigationPage />,
    errorElement: <ErrorPage />,
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
  {
    element: <ProfileEditPage />,
    path: "/profile/edit",
  },
  {
    element: <IdePage />,
    path: "/ide",
  },
])

export default router
