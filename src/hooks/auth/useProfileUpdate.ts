import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useToast } from "@/components/common/ToastContext"
import { updateName, updatePassword } from "@/services/api/users"
import { useUserStore } from "@/stores/user-store"
import type { ProfileEditFormData } from "@/types/auth"

interface UseProfileUpdateProps {
  form: UseFormReturn<ProfileEditFormData>
  initialValues: ProfileEditFormData
}

export function useProfileUpdate({ form, initialValues }: UseProfileUpdateProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { addToast } = useToast()
  const { fetchUserInfo } = useUserStore()

  const updateProfile = async (data: ProfileEditFormData) => {
    setIsSaving(true)

    try {
      const updates: Partial<ProfileEditFormData> = {}

      // 이름이 변경되었을 때만 포함
      if (data.name !== initialValues.name && data.name.trim()) {
        updates.name = data.name
      }

      // 비밀번호 변경이 요청되었을 때만 포함
      if (data.newPassword && data.currentPassword) {
        updates.currentPassword = data.currentPassword
        updates.newPassword = data.newPassword
      }

      if (Object.keys(updates).length === 0) {
        addToast({ type: "info", title: "No changes detected." })
        return
      }

      // API 문서에 따른 실제 API 호출들
      if (updates.name) {
        await updateName(updates.name)
      }

      if (updates.newPassword && updates.currentPassword) {
        await updatePassword(updates.currentPassword, updates.newPassword)
      }

      // 성공 시 사용자 정보 다시 가져오기
      await fetchUserInfo()

      addToast({ type: "success", title: "Profile updated successfully." })

      // 비밀번호 필드 초기화
      if (updates.newPassword) {
        form.reset({
          ...data,
          currentPassword: "",
          newPassword: "",
        })
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status: number
          data: { field?: string; message?: string }
        }
      }

      if (axiosError.response?.status === 400) {
        const { field, message } = axiosError.response.data

        if (field === "currentPassword") {
          form.setError("currentPassword", {
            message: message || "Current password is incorrect.",
            type: "server",
          })
        } else if (field === "newPassword") {
          form.setError("newPassword", {
            message: message || "New password is invalid.",
            type: "server",
          })
        }

        addToast({
          type: "error",
          title: message || "Please check your input.",
        })
      } else {
        addToast({ type: "error", title: "An error occurred while updating." })
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    updateProfile,
    isSaving,
  }
}
