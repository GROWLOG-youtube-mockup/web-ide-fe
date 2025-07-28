import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { AlertDialog } from "@/components/common/AlertDialog"
import { AuthFormField } from "@/components/common/AuthFormField"
import { AuthHeader } from "@/components/common/AuthHeader"
import { ProfileAvatar } from "@/components/common/ProfileAvatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"
import { profileEditFormSchema } from "@/lib/auth-schemas"
import type { ProfileEditFormData } from "@/types/auth"

export default function ProfileEditPage() {
  const methods = useForm<ProfileEditFormData>({
    defaultValues: {
      currentPassword: "",
      deletePassword: "",
      email: "jaeyeopme@gmail.com",
      name: "jaeyeopme",
      newPassword: "",
    },
    mode: "onChange",
    resolver: zodResolver(profileEditFormSchema),
  })

  const { handleSubmit, register } = methods

  const onSubmit = (data: ProfileEditFormData) => {
    console.log("Profile update data:", data)
    // TODO: 프로필 업데이트 로직 구현
  }

  const onDeleteAccount = (deletePassword: string) => {
    console.log("Account deletion confirmed with password:", deletePassword)
    // TODO: 계정 삭제 로직 구현
  }

  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle="This is how others will see you on the site." title="Profile" />
        <ProfileAvatar />

        <FormProvider {...methods}>
          <form className={AUTH_LAYOUT.section} onSubmit={handleSubmit(onSubmit)}>
            {/* Email Section */}
            <AuthFormField disabled label="Email" name="email" type="email" />

            {/* Current Password Section */}
            <AuthFormField
              label="Current Password"
              name="currentPassword"
              placeholder="Enter your current password"
              type="password"
            />

            {/* New Password Section */}
            <AuthFormField
              description="Must be at least 8 characters long, including both letters and numbers."
              label="New Password"
              name="newPassword"
              placeholder="Enter your new password"
              type="password"
            />

            {/* Name Section */}
            <AuthFormField label="Name" name="name" type="text" />

            {/* Delete Account Section */}
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between">
                <span className={AUTH_STYLES.label}>Account</span>
                <AlertDialog
                  cancelText="Cancel"
                  confirmText="Delete"
                  description="Once deleted, the data cannot be recovered."
                  onCancel={() => {
                    // 다이얼로그 닫기
                  }}
                  onConfirm={() => {
                    const deletePassword = methods.getValues("deletePassword")
                    if (deletePassword) {
                      onDeleteAccount(deletePassword)
                    }
                  }}
                  showCloseButton={false}
                  title="Delete account"
                  trigger={
                    <span className="cursor-pointer text-right font-semibold text-[9px] text-red-500">
                      Delete your account
                    </span>
                  }
                  variant="destructive"
                >
                  <div className="h-[35px] w-full rounded-[5.333px] bg-[#ffffff]">
                    <Input
                      {...register("deletePassword")}
                      className="h-full w-full rounded-[5.333px] border-none bg-transparent px-3 text-black text-sm placeholder:text-gray-400 focus:outline-none"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </div>
                </AlertDialog>
              </div>
            </div>

            {/* Bottom Section */}
            <div className={AUTH_LAYOUT.bottom}>
              {/* Update Profile Button */}
              <Button className={AUTH_STYLES.signupBtn} type="submit">
                Update Profile
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
