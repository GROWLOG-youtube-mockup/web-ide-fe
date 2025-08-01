import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { ResetPassword } from "@/components/auth/ResetPassword"
import { useToast } from "@/components/common/ToastContext"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { useAuthForm } from "@/hooks/auth/useAuthForm"
import { loginFormSchema } from "@/lib/auth-schemas"
import { useUserStore } from "@/stores/user-store"
import type { LoginFormData } from "@/types/auth"

export default function LoginPage() {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { loginUser, isLoading } = useUserStore()

  const form = useAuthForm(loginFormSchema, {
    email: "",
    password: "",
  })

  const onSubmit = async (data: LoginFormData) => {
    const success = await loginUser(data)
    if (success) {
      addToast({
        type: "success",
        title: "Login successful! Welcome",
        duration: 2000,
      })
      navigate("/") // 로그인 성공 시 프로젝트 목록 페이지로 이동
    } else {
      addToast({
        type: "error",
        title: "Login failed, please check your email and password",
        duration: 3000,
      })
    }
  }

  const footer = (
    <div className={AUTH_STYLES.link}>
      <span className="font-medium">Don't have an account?</span>
      <span className="cursor-pointer font-semibold underline">Sign Up</span>
    </div>
  )

  return (
    <>
      <AuthForm<LoginFormData>
        footer={footer}
        form={form}
        onSubmit={onSubmit}
        submitText={isLoading ? "Signing In..." : "Sign In"}
        subtitle="Enter your username and password to sign in!"
        title="Sign In"
      >
        <AuthFormField label="Email" name="email" placeholder="Enter your email" type="email" />

        <AuthFormField
          action={
            <button
              className="cursor-pointer border-none bg-transparent p-0 font-medium text-[9.333px] text-zinc-500"
              onClick={() => setIsForgotPasswordOpen(true)}
              type="button"
            >
              Forgot your password?
            </button>
          }
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </AuthForm>

      <ResetPassword onOpenChange={setIsForgotPasswordOpen} open={isForgotPasswordOpen} />
    </>
  )
}
