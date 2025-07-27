import clsx from "clsx"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/constants/auth-styles"

interface FieldInputProps {
  id: string
  type?: string
  placeholder: string
  value: string
  error?: string
  onChange: (value: string) => void
  disabled?: boolean
}

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
        className={clsx(AUTH_STYLES.field, AUTH_STYLES.focus, error && AUTH_STYLES.errorField)}
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
