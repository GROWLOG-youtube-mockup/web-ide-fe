import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/entities/user/model/user-store.ts"
import { useAuthForm } from "@/feature/user/auth/hooks/use-auth-form.ts"
import { AuthForm } from "@/feature/user/auth/ui/auth-form.tsx"
import { AuthFormField } from "@/feature/user/auth/ui/auth-form-field.tsx"
import { loginFormSchema } from "@/feature/user/lib/auth-schemas"
import { ResetPassword } from "@/feature/user/password/ui/reset-password.tsx"
import { PATHS } from "@/routes"
import { useToast } from "@/shared/components/toast-context.tsx"
import { AUTH_STYLES } from "@/shared/constants/auth-styles"
import type { LoginFormData } from "@/shared/types/auth"

export const Page = () => {
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
        duration: 2000,
      })
    }
  }

  const footer = (
    <div className={AUTH_STYLES.link}>
      <span className="font-medium">Don't have an account?</span>
      <button
        className="cursor-pointer border-none bg-transparent p-0 font-semibold underline"
        onClick={() => navigate(PATHS.signup)}
        type="button"
      >
        Sign Up
      </button>
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
