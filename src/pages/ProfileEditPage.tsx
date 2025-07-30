import { useState } from "react"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { PasswordChangeSection } from "@/components/auth/PasswordChangeSection"
import { ProfileAvatar } from "@/components/auth/ProfileAvatar"
import { AlertDialog } from "@/components/common/AlertDialog"
import { useToast } from "@/components/common/ToastContext"
import { Input } from "@/components/ui/input"
import { useAuthForm } from "@/hooks/useAuthForm"
import { useProfileUpdate } from "@/hooks/useProfileUpdate"
import { profileEditFormSchema } from "@/lib/auth-schemas"

export default function ProfileEditPage() {
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()

  // 초기값 정의 (form 기본값과 정확히 일치해야 함)
  const initialValues = {
    currentPassword: "",
    email: "jaeyeopme@gmail.com",
    name: "jaeyeopme",
    newPassword: "",
  } as const

  const form = useAuthForm(profileEditFormSchema, initialValues)
  const { updateProfile, isSaving } = useProfileUpdate({ form, initialValues })

  const onDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      addToast({ type: "error", title: "비밀번호를 입력해주세요." })
      return
    }

    setIsDeleting(true)
    try {
      console.log("Account deletion confirmed with password:", deletePassword)
      // TODO: 계정 삭제 로직 구현
      addToast({ type: "success", title: "계정이 성공적으로 삭제되었습니다." })
      setDeletePassword("") // 입력 필드 초기화
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("계정 삭제 오류:", error)
      addToast({ type: "error", title: "계정 삭제 중 오류가 발생했습니다." })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setDeletePassword("") // 취소 시 입력 초기화
    setIsDeleteDialogOpen(false)
  }

  return (
    <AuthForm
      avatarComponent={<ProfileAvatar />}
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
          onCancel={handleCancelDelete}
          onConfirm={onDeleteAccount}
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
              className="!text-[10.67px] h-full w-full rounded-[5.333px] border-none bg-transparent px-3 text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-1"
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
