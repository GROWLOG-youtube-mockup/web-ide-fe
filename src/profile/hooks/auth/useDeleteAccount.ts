import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/backup/stores/user-store"
import { deleteAccount } from "@/shared/api/user/users-api"
import { useToast } from "@/shared/common/ToastContext"

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()
  const { logoutUser } = useUserStore()
  const navigate = useNavigate()

  const handleDeleteAccount = async (password: string) => {
    if (!password.trim()) {
      addToast({ type: "error", title: "Please enter your password." })
      return
    }

    setIsDeleting(true)
    try {
      await deleteAccount(password)
      addToast({ type: "success", title: "Your account has been deleted successfully." })
      logoutUser()
      navigate("/login")
      return true // 성공 시 true 반환
    } catch (error) {
      console.error("Account deletion failed:", error)
      addToast({
        type: "error",
        title: "Failed to delete account. Please check your password.",
      })
      return false // 실패 시 false 반환
    } finally {
      setIsDeleting(false)
    }
  }

  return { isDeleting, handleDeleteAccount }
}
