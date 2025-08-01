import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { EmailVerify } from "@/components/auth/EmailVerify"
import { ProfileAvatar } from "@/components/auth/ProfileAvatar"
import { useToast } from "@/components/common/ToastContext"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { useAuthForm } from "@/hooks/auth/useAuthForm"
import { signUpFormSchema } from "@/lib/auth-schemas"
import { signUp } from "@/services/api/users"
import type { SignUpFormData } from "@/types/auth"

export default function SignUpPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  const form = useAuthForm(signUpFormSchema, {
    email: "",
    name: "",
    password: "",
    verificationCode: "",
  })

  const onSubmit = async (data: SignUpFormData) => {
    // 이메일 인증 체크
    if (!isEmailVerified) {
      addToast({
        type: "error",
        title: "이메일 인증을 완료해주세요.",
        duration: 3000,
      })
      return
    }

    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        username: data.name,
      })

      if (response.success) {
        addToast({
          type: "success",
          title: "회원가입이 완료되었습니다! 로그인해주세요.",
          duration: 3000,
        })
        navigate("/login")
      } else {
        addToast({
          type: "error",
          title: response.error?.message || "회원가입에 실패했습니다.",
          duration: 3000,
        })
      }
    } catch (_error) {
      addToast({
        type: "error",
        title: "회원가입 중 오류가 발생했습니다.",
        duration: 3000,
      })
    }
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
      <EmailVerify
        codeName="verificationCode"
        emailName="email"
        onVerificationChange={setIsEmailVerified}
      />

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
