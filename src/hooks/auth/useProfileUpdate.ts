import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useToast } from "@/components/common/ToastContext"
import type { ProfileEditFormData } from "@/types/auth"

interface UseProfileUpdateProps {
  form: UseFormReturn<ProfileEditFormData>
  initialValues: ProfileEditFormData
}

export function useProfileUpdate({ form, initialValues }: UseProfileUpdateProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { addToast } = useToast()

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

      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 서버 응답 시뮬레이션
      const simulateServerError = Math.random() < 0.3

      if (simulateServerError && updates.currentPassword) {
        form.setError("currentPassword", {
          message: "Current password is incorrect.",
          type: "server",
        })
        addToast({ type: "error", title: "Please check your current password." })
        return
      }

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
        response?: { status: number; data: { field?: string; message?: string } }
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
