import { clsx } from "clsx"
import { dividerSvg } from "@/assets/icons"
import { AlertDialog } from "@/components/common/AlertDialog"
import { FormSection } from "@/components/common/FormSection"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/lib/auth-styles"

export default function ProfileEditPage() {
  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-white">
      {/* Main Content Container */}
      <div className="flex w-[310px] flex-col items-center gap-5">
        {/* Header */}
        <div className="flex w-full flex-col gap-[6.667px]">
          <h1 className={AUTH_STYLES.title}>Profile</h1>
          <p className={AUTH_STYLES.subtitle}>This is how others will see you on the site.</p>
        </div>

        {/* Divider */}
        <div className="w-full">
          <img alt="divider" className="h-px w-full" src={dividerSvg} />
        </div>

        {/* Avatar (shadcn/ui) */}
        <div className="flex items-center justify-center">
          <div className="flex h-28 w-[110px] items-center justify-center">
            <Avatar className="h-full w-full">
              <AvatarImage alt="avatar" src="https://github.com/shadcn.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex w-full flex-col gap-2.5">
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
          <FormSection
            action={
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
                  <span className="cursor-pointer font-semibold text-[9px] text-red-500">
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
            }
            htmlFor="name"
            label="Name"
          >
            <Input className={AUTH_STYLES.field} id="name" value="jaeyeopme" />
          </FormSection>
        </div>

        {/* Bottom Section */}
        <div className="flex w-full flex-col items-center gap-5">
          {/* Update Profile Button */}
          <Button className={AUTH_STYLES.signupBtn}>Update Profile</Button>
        </div>
      </div>
    </div>
  )
}
