import { createBrowserRouter } from "react-router-dom"
import { ErrorPage } from "@/pages/ErrorPage"
import { HomePage } from "@/pages/HomePage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
])

export default router
