import clsx from "clsx"
import { dividerSvg } from "@/assets/icons"
import { FormSection } from "@/components/common/FormSection"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/lib/auth-styles"

export default function LoginPage() {
  return (
    <div className={AUTH_LAYOUT.container}>
      {/* Main Content Container */}
      <div className={AUTH_LAYOUT.main}>
        {/* Header */}
        <div className={AUTH_LAYOUT.header}>
          <h1 className={AUTH_STYLES.title}>Sign In</h1>
          <p className={AUTH_STYLES.subtitle}>Enter your username and password to sign in!</p>
        </div>

        {/* Divider */}
        <div className={AUTH_LAYOUT.divider}>
          <img alt="divider" className="h-px w-full" src={dividerSvg} />
        </div>

        {/* Form Fields */}
        <div className={AUTH_LAYOUT.section}>
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
        <div className={AUTH_LAYOUT.bottom}>
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
