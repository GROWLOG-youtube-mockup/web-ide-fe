import clsx from "clsx"
import type { ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/constants/auth-styles"

interface AuthFormFieldProps {
  name: string
  label: string
  type?: "text" | "email" | "password"
  placeholder?: string
  description?: string
  action?: ReactNode
  disabled?: boolean
}

export function AuthFormField({
  name,
  label,
  type = "text",
  placeholder,
  description,
  action,
  disabled = false,
}: AuthFormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between">
        <label className={AUTH_STYLES.label} htmlFor={name}>
          {label}
        </label>
        {action && <div>{action}</div>}
      </div>
      {description && <p className={AUTH_STYLES.help}>{description}</p>}
      <div className="flex flex-col">
        <Input
          {...register(name)}
          className={clsx(AUTH_STYLES.field, error && AUTH_STYLES.errorField)}
          disabled={disabled}
          id={name}
          placeholder={placeholder}
          type={type}
        />
        <span className={clsx(AUTH_STYLES.errorMessage, !error && "invisible")}>
          {error || "placeholder"}
        </span>
      </div>
    </div>
  )
}
