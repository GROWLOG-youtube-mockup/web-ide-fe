import { AuthForm } from "@/components/auth/AuthForm"
import { AuthFormField } from "@/components/auth/AuthFormField"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { useAuthForm } from "@/hooks/useAuthForm"
import { loginFormSchema } from "@/lib/auth-schemas"
import type { LoginFormData } from "@/types/auth"

export default function LoginPage() {
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
          <span className="cursor-pointer font-medium text-[9.333px] text-zinc-500 ">
            Forgot your password?
          </span>
        }
        label="Password"
        name="password"
        placeholder="Enter your password"
        type="password"
      />
    </AuthForm>
  )
}
