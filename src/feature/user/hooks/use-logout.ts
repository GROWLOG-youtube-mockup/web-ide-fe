import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/feature/user/stores/user-store"
import { PATHS } from "@/routes"
import { useToast } from "@/widgets/toast-context"

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
