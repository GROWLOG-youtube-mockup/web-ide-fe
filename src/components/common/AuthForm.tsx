import type { ReactNode } from "react"
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form"
import { AuthHeader } from "@/components/common/AuthHeader"
import { Button } from "@/components/ui/Button"
import { Form } from "@/components/ui/Form"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"

interface AuthFormProps {
  title: string
  subtitle: string
  onSubmit: SubmitHandler<FieldValues>
  submitText: string
  children: ReactNode
  form: UseFormReturn<FieldValues>
  footer?: ReactNode
  showAvatar?: boolean
  avatarComponent?: ReactNode
}

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  submitText,
  children,
  form,
  footer,
  showAvatar = false,
  avatarComponent,
}: AuthFormProps) {
  return (
    <div className={AUTH_LAYOUT.container}>
      <div className={AUTH_LAYOUT.main}>
        <AuthHeader subtitle={subtitle} title={title} />
        {showAvatar && avatarComponent}

        <Form {...form}>
          <form className={AUTH_LAYOUT.section} onSubmit={form.handleSubmit(onSubmit)}>
            {children}
          </form>
        </Form>

        <div className={AUTH_LAYOUT.bottom}>
          <Button
            className={AUTH_STYLES.signupBtn}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
          >
            {submitText}
          </Button>
          {footer}
        </div>
      </div>
    </div>
  )
}
