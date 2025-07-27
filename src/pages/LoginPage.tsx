import { AuthHeader } from "@/components/common/AuthHeader"
import { FieldInput } from "@/components/common/FieldInput"
import { FormSection } from "@/components/common/FormSection"
import { Button } from "@/components/ui/Button"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"
import { useLoginForm } from "@/hooks/useLoginForm"

export default function LoginPage() {
  const { formData, errors, handleInputChange, handleSubmit } = useLoginForm()

  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle="Enter your username and password to sign in!" title="Sign In" />

        <form className={AUTH_LAYOUT.section} onSubmit={handleSubmit}>
          <FormSection htmlFor="email" label="Email">
            <FieldInput
              error={errors.email}
              id="email"
              onChange={value => handleInputChange("email", value)}
              placeholder="Enter your email"
              type="email"
              value={formData.email}
            />
          </FormSection>

          <FormSection
            action={
              <span className="cursor-pointer font-medium text-[9.333px] text-zinc-500">
                Forgot your password?
              </span>
            }
            htmlFor="password"
            label="Password"
          >
            <FieldInput
              error={errors.password}
              id="password"
              onChange={value => handleInputChange("password", value)}
              placeholder="Enter your password"
              type="password"
              value={formData.password}
            />
          </FormSection>
        </form>

        <div className={AUTH_LAYOUT.bottom}>
          <Button className={AUTH_STYLES.signupBtn} onClick={handleSubmit} type="button">
            Sign In
          </Button>
          <div className={AUTH_STYLES.link}>
            <span className="font-medium">Don't have an account?</span>
            <span className="cursor-pointer font-semibold underline">Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  )
}
