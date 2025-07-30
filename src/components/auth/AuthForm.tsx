import type { ReactNode } from "react"
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"

type AuthFormProps<T extends FieldValues = FieldValues> = {
  title: string
  subtitle: string
  onSubmit: SubmitHandler<T>
  submitText: string
  children: ReactNode
  form: UseFormReturn<T>
  footer?: ReactNode
  showAvatar?: boolean
  avatarComponent?: ReactNode
}

export function AuthForm<T extends FieldValues = FieldValues>({
  title,
  subtitle,
  onSubmit,
  submitText,
  children,
  form,
  footer,
  showAvatar = false,
  avatarComponent,
}: AuthFormProps<T>) {
  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle={subtitle} title={title} />
        {showAvatar && avatarComponent}

        <Form {...form}>
          <form className={AUTH_LAYOUT.section} onSubmit={form.handleSubmit(onSubmit)}>
            {children}

            <div className={AUTH_LAYOUT.bottom}>
              <Button
                className={AUTH_STYLES.signupBtn}
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {submitText}
              </Button>
              {footer}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
