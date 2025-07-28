import clsx from "clsx"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/constants/auth-styles"
import type { FieldInputProps } from "@/types/auth"

export function FieldInput({
  id,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  disabled = false,
}: FieldInputProps) {
  return (
    <div className="flex flex-col">
      <Input
        className={clsx(AUTH_STYLES.field, error && AUTH_STYLES.errorField)}
        disabled={disabled}
        id={id}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error && <p className={AUTH_STYLES.errorMessage}>{error}</p>}
    </div>
  )
}
