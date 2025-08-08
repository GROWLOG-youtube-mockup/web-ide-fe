import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/entities/user/model/user-store.ts"
import { PATHS } from "@/routes"
import { useToast } from "@/shared/components/toast-context.tsx"

export function useLogout() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { logoutUser } = useUserStore()

  const logout = (showToast = true) => {
    logoutUser()

    if (showToast) {
      addToast({
        type: "success",
        title: "You are logged out.",
        duration: 2000,
      })
    }

    navigate(PATHS.signin, { replace: true })
  }

  return { logout }
}
