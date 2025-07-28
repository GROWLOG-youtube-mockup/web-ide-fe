import { clsx } from "clsx"
import { AlertDialog } from "@/components/common/AlertDialog"
import { AuthHeader } from "@/components/common/AuthHeader"
import { FormSection } from "@/components/common/FormSection"
import { ProfileAvatar } from "@/components/common/ProfileAvatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"

export default function ProfileEditPage() {
  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle="This is how others will see you on the site." title="Profile" />
        <ProfileAvatar />

        <div className={AUTH_LAYOUT.section}>
          {/* Email Section */}
          <FormSection htmlFor="email" label="Email">
            <Input
              className={clsx(AUTH_STYLES.field, "text-zinc-400")}
              disabled
              id="email"
              type="email"
              value="jaeyeopme@gmail.com"
            />
          </FormSection>

          {/* Password Section */}
          <FormSection
            description="Must be at least 8 characters long, including both letters and numbers."
            htmlFor="currentPassword"
            label="Password"
          >
            <div className="flex flex-col gap-1.5">
              <Input
                className={AUTH_STYLES.field}
                id="currentPassword"
                placeholder="Enter your current password"
                type="password"
              />
              <Input
                className={AUTH_STYLES.field}
                placeholder="Enter your new password"
                type="password"
              />
            </div>
          </FormSection>

          {/* Name Section */}
          <FormSection htmlFor="name" label="Name">
            <Input className={AUTH_STYLES.field} id="name" value="jaeyeopme" />
          </FormSection>

          {/* Delete Account Section */}

          <AlertDialog
            cancelText="Cancel"
            confirmText="Delete"
            description="Once deleted, the data cannot be recovered."
            onCancel={() => {
              // TODO: 취소 로직 구현
              console.log("Account deletion cancelled")
            }}
            onConfirm={() => {
              // TODO: 계정 삭제 로직 구현
              console.log("Account deletion confirmed")
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
                className={clsx(AUTH_STYLES.field, "h-full w-full rounded-[5.333px]")}
                placeholder="Enter your password"
                type="password"
              />
            </div>
          </AlertDialog>
        </div>

        {/* Bottom Section */}
        <div className={AUTH_LAYOUT.bottom}>
          {/* Update Profile Button */}
          <Button className={AUTH_STYLES.signupBtn}>Update Profile</Button>
        </div>
      </div>
    </div>
  )
}
