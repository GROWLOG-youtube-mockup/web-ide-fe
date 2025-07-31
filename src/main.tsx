import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { ToastProvider } from "@/components/common/ToastContext"
import "./index.css"
import router from "@/router"

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>
)
