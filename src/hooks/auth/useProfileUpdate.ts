import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useToast } from "@/components/common/ToastContext"
import { updateName, updatePassword, uploadProfileImage } from "@/services/api/users"
import { useUserStore } from "@/stores/user-store"
import type { ProfileEditFormData } from "@/types/auth"

interface UseProfileUpdateProps {
  form: UseFormReturn<ProfileEditFormData>
  initialValues: ProfileEditFormData
  profileImageFile?: File | null
  onSuccess?: () => void
}

export function useProfileUpdate({
  form,
  initialValues,
  profileImageFile,
  onSuccess,
}: UseProfileUpdateProps) {
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

      if (Object.keys(updates).length === 0 && !profileImageFile) {
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

      if (profileImageFile) {
        await uploadProfileImage(profileImageFile)
      }

      // 성공 시 사용자 정보 다시 가져오기
      await fetchUserInfo()

      addToast({
        type: "success",
        title: "Profile updated successfully!",
      })

      // 비밀번호 필드는 초기화하고, 다른 필드는 최신 상태로 유지
      form.reset({
        ...data,
        currentPassword: "",
        newPassword: "",
      })

      // 성공 콜백 호출
      onSuccess?.()
    } catch (error) {
      console.error("Profile update failed:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile. Please try again."
      addToast({
        type: "error",
        title: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return { updateProfile, isSaving }
}
