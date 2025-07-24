import clsx from "clsx"
import { dividerSvg } from "@/assets/icons"
import { FormSection } from "@/components/common/FormSection"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/lib/auth-styles"

export default function LoginPage() {
  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-white">
      {/* Main Content Container */}
      <div className="flex w-[310px] flex-col items-center gap-5">
        {/* Header */}
        <div className="flex w-full flex-col gap-[6.667px]">
          <h1 className={AUTH_STYLES.title}>Sign In</h1>
          <p className={AUTH_STYLES.subtitle}>Enter your username and password to sign in!</p>
        </div>

        {/* Divider */}
        <div className="w-full">
          <img alt="divider" className="h-px w-full" src={dividerSvg} />
        </div>

        {/* Form Fields */}
        <div className="flex w-full flex-col gap-2.5">
          {/* Email Section */}
          <FormSection htmlFor="email" label="Email">
            <Input
              className={clsx(AUTH_STYLES.field, AUTH_STYLES.focus)}
              id="email"
              placeholder="Enter your email"
              type="email"
            />
          </FormSection>

          {/* Password Section */}
          <FormSection
            action={
              <span className="cursor-pointer font-medium text-[9.333px] text-zinc-500">
                Forgot your password?
              </span>
            }
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
        </div>

        {/* Bottom Section */}
        <div className="flex w-full flex-col items-center gap-5 pt-0 pb-5">
          {/* Sign In Button */}
          <Button className={AUTH_STYLES.signupBtn}>Sign in</Button>

          {/* Sign Up Link */}
          <div className={AUTH_STYLES.link}>
            <span className="font-medium">Don't have an account?</span>
            <span className="cursor-pointer font-semibold underline">Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  )
}
