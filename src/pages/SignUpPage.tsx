import clsx from "clsx"
import { dividerSvg } from "@/assets/icons"
import { FormSection } from "@/components/common/FormSection"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/lib/auth-styles"

export default function SignUpPage() {
  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-white">
      {/* Main Content Container */}
      <div className="flex w-[310px] flex-col items-center gap-5">
        {/* Header */}
        <div className="flex w-full flex-col gap-[6.667px]">
          <h1 className={AUTH_STYLES.title}>Sign up</h1>
          <p className={AUTH_STYLES.subtitle}>Enter your information to sign up!</p>
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

        {/* Form Fields (공통 컴포넌트 적용) */}
        <div className="flex w-full flex-col gap-2.5">
          {/* Email Section */}
          <FormSection htmlFor="email" label="Email">
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex h-[30px] gap-1.5">
                <div className="relative flex-1">
                  <Input
                    className={clsx(AUTH_STYLES.field, AUTH_STYLES.focus)}
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <Button className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnPri)}>Send code</Button>
              </div>
              <div className="flex h-[30px] gap-1.5">
                <div className="relative flex-1">
                  <Input
                    className={clsx(AUTH_STYLES.field, AUTH_STYLES.focus)}
                    placeholder="Enter your code"
                  />
                </div>
                <Button className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnSec)}>Confirm</Button>
              </div>
            </div>
          </FormSection>

          {/* Password Section */}
          <FormSection
            description="Must be at least 8 characters long, including both letters and numbers."
            htmlFor="password"
            label="Password"
          >
            <Input
              className={clsx(AUTH_STYLES.field, AUTH_STYLES.focus)}
              id="password"
              placeholder="Enter your password"
              type="password"
            />
          </FormSection>

          {/* Name Section */}
          <FormSection htmlFor="name" label="Name">
            <Input
              className={clsx(AUTH_STYLES.field, AUTH_STYLES.focus)}
              id="name"
              placeholder="Enter your name"
            />
          </FormSection>
        </div>

        {/* Bottom Section */}
        <div className="flex w-full flex-col items-center gap-5 pt-0 pb-5">
          {/* Sign Up Button */}
          <Button className={AUTH_STYLES.signupBtn}>Sign Up</Button>

          {/* Sign In Link */}
          <div className={AUTH_STYLES.link}>
            <span className="font-medium">Already have an account?</span>
            <span className="cursor-pointer font-semibold underline ">Sign In</span>
          </div>
        </div>
      </div>
    </div>
  )
}
