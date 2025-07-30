import { useState } from "react"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { ResetPassword } from "@/components/auth/ResetPassword"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { useAuthForm } from "@/hooks/useAuthForm"
import { loginFormSchema } from "@/lib/auth-schemas"
import type { LoginFormData } from "@/types/auth"

export default function LoginPage() {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const form = useAuthForm(loginFormSchema, {
    email: "",
    password: "",
  })

  const onSubmit = (data: LoginFormData) => {
    console.log("로그인 처리:", data)
    // TODO: 실제 로그인 API 호출
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
        submitText="Sign In"
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
