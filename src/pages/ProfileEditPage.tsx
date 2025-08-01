import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { PasswordChangeSection } from "@/components/auth/PasswordChangeSection"
import { ProfileAvatar } from "@/components/auth/ProfileAvatar"
import { AlertDialog } from "@/components/common/AlertDialog"
import { useToast } from "@/components/common/ToastContext"
import { Input } from "@/components/ui/input"
import { useAuthForm } from "@/hooks/auth/useAuthForm"
import { useProfileUpdate } from "@/hooks/auth/useProfileUpdate"
import { profileEditFormSchema } from "@/lib/auth-schemas"
import { deleteAccount } from "@/services/api/users"
import { useUserStore } from "@/stores/user-store"

export default function ProfileEditPage() {
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()
  const { userInfo, logoutUser } = useUserStore()
  const navigate = useNavigate()

  // 초기값 정의 (실제 사용자 정보 사용)
  const initialValues = {
    currentPassword: "",
    email: userInfo?.email || "",
    name: userInfo?.name || "",
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
      // API 문서에 따른 실제 계정 삭제 API 호출
      await deleteAccount(deletePassword)

      addToast({ type: "success", title: "계정이 성공적으로 삭제되었습니다." })

      // 로그아웃 처리 및 로그인 페이지로 이동
      logoutUser()
      navigate("/login")
    } catch (error) {
      console.error("계정 삭제 오류:", error)
      addToast({
        type: "error",
        title: "계정 삭제 중 오류가 발생했습니다. 비밀번호를 확인해주세요.",
      })
    } finally {
      setIsDeleting(false)
      setDeletePassword("") // 입력 필드 초기화
      setIsDeleteDialogOpen(false)
    }
  }

  const handleCancelDelete = () => {
    setDeletePassword("") // 취소 시 입력 초기화
    setIsDeleteDialogOpen(false)
  }

  return (
    <AuthForm
      avatarComponent={
        <ProfileAvatar
          onImageChange={() => {
            // 프로필 이미지 업로드 성공 후 사용자 정보 다시 가져오기
            // ProfileAvatar 컴포넌트에서 이미 uploadProfileImage API를 호출하므로
            // 여기서는 사용자 정보만 다시 가져오면 됨
          }}
          src={userInfo?.profileImage}
        />
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
