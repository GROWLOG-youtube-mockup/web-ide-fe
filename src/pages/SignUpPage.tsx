import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { AuthFormField } from "@/components/common/AuthFormField"
import { AuthHeader } from "@/components/common/AuthHeader"
import { EmailVerificationField } from "@/components/common/EmailVerificationField"
import { ProfileAvatar } from "@/components/common/ProfileAvatar"
import { Button } from "@/components/ui/Button"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"
import { signUpFormSchema } from "@/lib/auth-schemas"
import type { SignUpFormData } from "@/types/auth"

export default function SignUpPage() {
  const form = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      verificationCode: "",
    },
    resolver: zodResolver(signUpFormSchema),
  })

  const onSubmit = (data: SignUpFormData) => {
    console.log("회원가입 처리:", data)
    // TODO: 실제 회원가입 API 호출
  }

  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle="Enter your information to sign up!" title="Sign up" />
        <ProfileAvatar />

        <FormProvider {...form}>
          <form className={AUTH_LAYOUT.section} onSubmit={form.handleSubmit(onSubmit)}>
            <EmailVerificationField codeName="verificationCode" emailName="email" />

            <AuthFormField
              description="Must be at least 8 characters long, including both letters and numbers."
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
            />

            <AuthFormField label="Name" name="name" placeholder="Enter your name" />
          </form>
        </FormProvider>

        <div className={AUTH_LAYOUT.bottom}>
          <Button
            className={AUTH_STYLES.signupBtn}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
          >
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
