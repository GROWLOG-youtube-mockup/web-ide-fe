import clsx from "clsx"
import type { ReactNode } from "react"
import { AUTH_STYLES } from "@/shared/constants/auth-styles"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/custom-form"
import { Input } from "@/shared/ui/input"

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
  return (
    <FormField
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <FormLabel className={clsx(AUTH_STYLES.label, "mb-0.5")}>{label}</FormLabel>
            {action && <div>{action}</div>}
          </div>
          {description && (
            <FormDescription className={AUTH_STYLES.help}>{description}</FormDescription>
          )}
          <div className="flex flex-col">
            <FormControl>
              <Input
                {...field}
                className={clsx(AUTH_STYLES.field, fieldState.error && AUTH_STYLES.errorField)}
                disabled={disabled}
                placeholder={placeholder}
                type={type}
              />
            </FormControl>
            <FormMessage
              className={clsx(AUTH_STYLES.errorMessage, !fieldState.error && "invisible")}
            >
              {fieldState.error?.message || "placeholder"}
            </FormMessage>
          </div>
        </FormItem>
      )}
    />
  )
}
