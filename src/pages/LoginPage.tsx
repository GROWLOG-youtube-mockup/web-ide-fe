import clsx from "clsx"
import { dividerSvg } from "@/assets/icons"
import { FormSection } from "@/components/common/FormSection"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useLoginForm } from "@/hooks/useLoginForm"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/lib/auth-styles"

export default function LoginPage() {
  // 커스텀 훅으로 폼 로직 분리
  const { formData, errors, handleInputChange, handleSubmit } = useLoginForm()

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

        {/* Form */}
        <form className={AUTH_LAYOUT.section} onSubmit={handleSubmit}>
          {/* Email Section */}
          <FormSection htmlFor="email" label="Email">
            <Input
              className={clsx(
                AUTH_STYLES.field,
                AUTH_STYLES.focus,
                errors.email && AUTH_STYLES.errorField
              )}
              id="email"
              onChange={handleInputChange("email")}
              placeholder="Enter your email"
              type="email"
              value={formData.email}
            />
            {errors.email && <p className={AUTH_STYLES.errorMessage}>{errors.email}</p>}
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
              className={clsx(
                AUTH_STYLES.field,
                AUTH_STYLES.focus,
                errors.password && AUTH_STYLES.errorField
              )}
              id="password"
              onChange={handleInputChange("password")}
              placeholder="Enter your password"
              type="password"
              value={formData.password}
            />
            {errors.password && <p className={AUTH_STYLES.errorMessage}>{errors.password}</p>}
          </FormSection>
        </form>

        {/* Bottom Section */}
        <div className={AUTH_LAYOUT.bottom}>
          {/* Sign In Button */}
          <Button className={AUTH_STYLES.signupBtn} onClick={handleSubmit} type="button">
            Sign in
          </Button>

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
