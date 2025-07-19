import { createBrowserRouter } from "react-router-dom"
import { ErrorPage } from "@/pages/ErrorPage"
import { HomePage } from "@/pages/HomePage"

export const router = createBrowserRouter([
  {
    element: <HomePage />,
    errorElement: <ErrorPage />,
    path: "/",
  },
])

export default router
