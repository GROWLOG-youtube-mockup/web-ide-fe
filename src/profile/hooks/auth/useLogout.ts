import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/backup/stores/user-store"
import { useToast } from "@/shared/common/ToastContext"

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

    navigate("/login")
  }

  return { logout }
}
