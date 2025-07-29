import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { EmailVerificationField } from "@/components/auth/EmailVerificationField"
import { ProfileAvatar } from "@/components/auth/ProfileAvatar"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { useAuthForm } from "@/hooks/useAuthForm"
import { signUpFormSchema } from "@/lib/auth-schemas"
import type { SignUpFormData } from "@/types/auth"

export default function SignUpPage() {
  const form = useAuthForm(signUpFormSchema, {
    email: "",
    name: "",
    password: "",
    verificationCode: "",
  })

  const onSubmit = (data: SignUpFormData) => {
    console.log("회원가입 처리:", data)
    // TODO: 실제 회원가입 API 호출
  }

  const footer = (
    <div className={AUTH_STYLES.link}>
      <span className="font-medium">Already have an account?</span>
      <span className="cursor-pointer font-semibold underline">Sign In</span>
    </div>
  )

  return (
    <AuthForm<SignUpFormData>
      avatarComponent={<ProfileAvatar />}
      footer={footer}
      form={form}
      onSubmit={onSubmit}
      showAvatar={true}
      submitText="Sign Up"
      subtitle="Enter your information to sign up!"
      title="Sign up"
    >
      <EmailVerificationField codeName="verificationCode" emailName="email" />

      <AuthFormField
        description="Must be at least 8 characters long, including both letters and numbers."
        label="Password"
        name="password"
        placeholder="Enter your password"
        type="password"
      />

      <AuthFormField label="Name" name="name" placeholder="Enter your name" />
    </AuthForm>
  )
}
