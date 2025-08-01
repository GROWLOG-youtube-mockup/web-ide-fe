import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/common/ToastContext"
import { useUserStore } from "@/stores/user-store"

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
