import { AuthHeader } from "@/components/common/AuthHeader"
import { EmailVerificationField } from "@/components/common/EmailVerificationField"
import { FieldInput } from "@/components/common/FieldInput"
import { FormSection } from "@/components/common/FormSection"
import { ProfileAvatar } from "@/components/common/ProfileAvatar"
import { Button } from "@/components/ui/Button"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"
import { useSignUpForm } from "@/hooks/useSignUpForm"

export default function SignUpPage() {
  const {
    formData,
    errors,
    emailVerification,
    handleInputChange,
    handleSendVerificationCode,
    handleVerifyCode,
    handleSubmit,
  } = useSignUpForm()

  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle="Enter your information to sign up!" title="Sign up" />
        <ProfileAvatar />

        <form className={AUTH_LAYOUT.section} onSubmit={handleSubmit}>
          <FormSection htmlFor="email" label="Email">
            <EmailVerificationField
              email={formData.email}
              emailVerification={emailVerification}
              errors={{ email: errors.email, verificationCode: errors.verificationCode }}
              onCodeChange={value => handleInputChange("verificationCode", value)}
              onEmailChange={value => handleInputChange("email", value)}
              onSendCode={handleSendVerificationCode}
              onVerifyCode={handleVerifyCode}
              verificationCode={formData.verificationCode}
            />
          </FormSection>

          <FormSection
            description="Must be at least 8 characters long, including both letters and numbers."
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

          <FormSection htmlFor="name" label="Name">
            <FieldInput
              error={errors.name}
              id="name"
              onChange={value => handleInputChange("name", value)}
              placeholder="Enter your name"
              value={formData.name}
            />
          </FormSection>
        </form>

        <div className={AUTH_LAYOUT.bottom}>
          <Button className={AUTH_STYLES.signupBtn} onClick={handleSubmit} type="button">
            Sign Up
          </Button>
          <div className={AUTH_STYLES.link}>
            <span className="font-medium">Already have an account?</span>
            <span className="cursor-pointer font-semibold underline">Sign In</span>
          </div>
        </div>
      </div>
    </div>
  )
}
