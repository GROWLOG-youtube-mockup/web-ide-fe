import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { AuthFormField } from "@/components/common/AuthFormField"
import { AuthHeader } from "@/components/common/AuthHeader"
import { Button } from "@/components/ui/Button"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"
import { loginFormSchema } from "@/lib/auth-schemas"
import type { LoginFormData } from "@/types/auth"

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    console.log("로그인 처리:", data)
    // TODO: 실제 로그인 API 호출
  }

  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle="Enter your username and password to sign in!" title="Sign In" />

        <FormProvider {...form}>
          <form className={AUTH_LAYOUT.section} onSubmit={form.handleSubmit(onSubmit)}>
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
          </form>
        </FormProvider>

        <div className={AUTH_LAYOUT.bottom}>
          <Button
            className={AUTH_STYLES.signupBtn}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
          >
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
