import { createBrowserRouter } from "react-router-dom"
import EditorWorkspace from "@/pages/EditorWorkspace"
import { ErrorPage } from "@/pages/ErrorPage"
import { HomePage } from "@/pages/HomePage"

export const router = createBrowserRouter([
  {
    element: <HomePage />,
    errorElement: <ErrorPage />,
    path: "/",
  },
  {
    element: <EditorWorkspace />,
    path: "/projects/:projectId/editor",
  },
])

export default router
