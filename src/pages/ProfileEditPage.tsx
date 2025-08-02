import { useState } from "react"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { PasswordChangeSection } from "@/components/auth/PasswordChangeSection"
import { ProfileAvatar } from "@/components/auth/ProfileAvatar"
import { AlertDialog } from "@/components/common/AlertDialog"
import { Input } from "@/components/ui/input"
import { useAuthForm } from "@/hooks/auth/useAuthForm"
import { useDeleteAccount } from "@/hooks/auth/useDeleteAccount"
import { useProfileUpdate } from "@/hooks/auth/useProfileUpdate"
import { profileEditFormSchema } from "@/lib/auth-schemas"
import { useUserStore } from "@/stores/user-store"

export default function ProfileEditPage() {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { userInfo } = useUserStore()

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
