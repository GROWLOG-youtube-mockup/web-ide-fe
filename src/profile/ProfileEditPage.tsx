import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/backup/stores/user-store"
import { AuthForm } from "@/profile/auth/AuthForm"
import { AuthFormField } from "@/profile/auth/AuthFormField"
import { PasswordChangeSection } from "@/profile/auth/PasswordChangeSection"
import { ProfileAvatar } from "@/profile/auth/ProfileAvatar"
import { profileEditFormSchema } from "@/profile/auth-schemas"
import { useAuthForm } from "@/profile/hooks/auth/useAuthForm"
import { useDeleteAccount } from "@/profile/hooks/auth/useDeleteAccount"
import { useProfileUpdate } from "@/profile/hooks/auth/useProfileUpdate"
import { AlertDialog } from "@/shared/common/AlertDialog"
import { Input } from "@/shared/ui/input"

export default function ProfileEditPage() {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { userInfo } = useUserStore()
  const navigate = useNavigate()

  // 초기값 정의 (실제 사용자 정보 사용)
  const initialValues = {
    currentPassword: "",
    email: userInfo?.email || "",
    name: userInfo?.name || "",
    newPassword: "",
  } as const

  const form = useAuthForm(profileEditFormSchema, initialValues)
  const { updateProfile, isSaving } = useProfileUpdate({
    form,
    initialValues,
    profileImageFile: selectedImageFile,
    onSuccess: () => navigate(-1), // 이전 페이지로 이동
  })
  const { isDeleting, handleDeleteAccount } = useDeleteAccount()

  const onConfirmDelete = async () => {
    const success = await handleDeleteAccount(deletePassword)
    if (success) {
      setIsDeleteDialogOpen(false)
      setDeletePassword("")
    }
  }

  const onCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setDeletePassword("")
  }

  return (
    <AuthForm
      avatarComponent={
        <ProfileAvatar onImageSelect={setSelectedImageFile} src={userInfo?.profileImage} />
      }
      form={form}
      onSubmit={updateProfile}
      showAvatar={true}
      submitText={isSaving ? "Updating..." : "Update Profile"}
      subtitle="This is how others will see you on the site."
      title="Profile"
    >
      {/* Email Section */}
      <AuthFormField disabled label="Email" name="email" type="email" />

      {/* Password Section */}
      <PasswordChangeSection
        currentPasswordName="currentPassword"
        form={form}
        newPasswordName="newPassword"
      />

      {/* Name Section */}
      <AuthFormField label="Name" name="name" placeholder="Enter your name" type="text" />

      {/* Delete Account Section */}
      <div className="flex w-full justify-end overflow-hidden">
        <AlertDialog
          cancelText="Cancel"
          confirmDisabled={!deletePassword.trim()}
          confirmText="Delete"
          description="Once deleted, the data cannot be recovered."
          isLoading={isDeleting}
          isOpen={isDeleteDialogOpen}
          onCancel={onCancelDelete}
          onConfirm={onConfirmDelete}
          onOpenChange={setIsDeleteDialogOpen}
          showCloseButton={false}
          title="Delete account" // 내부 필드에 커스텀 스타일 적용
          trigger={
            <span className="mb-1 cursor-pointer font-semibold text-[9px] text-red-500 leading-5">
              Delete your account
            </span>
          }
          variant="destructive"
        >
          <div className="h-[35px] w-full rounded-[5.333px] border border-zinc-200 bg-[#ffffff]">
            <Input
              className="!text-[12px] h-full w-full rounded-[5.333px] border-none bg-transparent px-3 text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-zinc-200"
              onChange={e => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              value={deletePassword}
            />
          </div>
        </AlertDialog>
      </div>
    </AuthForm>
  )
}
