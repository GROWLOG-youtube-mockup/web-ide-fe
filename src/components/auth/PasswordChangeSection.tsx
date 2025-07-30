import clsx from "clsx"
import type { FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { AUTH_STYLES } from "@/constants/auth-styles"

interface PasswordChangeSectionProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  currentPasswordName: Path<T>
  newPasswordName: Path<T>
}

export function PasswordChangeSection<T extends FieldValues = FieldValues>({
  form,
  currentPasswordName,
  newPasswordName,
}: PasswordChangeSectionProps<T>) {
  const currentPasswordError = form.formState.errors[currentPasswordName] as FieldError | undefined
  const newPasswordError = form.formState.errors[newPasswordName] as FieldError | undefined

  return (
    <div className="space-y-1.5">
      <div className="font-semibold text-[10.667px] text-zinc-950 leading-4">Password</div>
      <div className="space-y-[3px]">
        <p className="font-normal text-[9.333px] text-zinc-500 leading-[13.333px]">
          Must be at least 8 characters long, including both letters and numbers.
        </p>
        <div className="space-y-1.5">
          <div className="flex flex-col">
            <Input
              {...form.register(currentPasswordName)}
              className={clsx(AUTH_STYLES.field, currentPasswordError && AUTH_STYLES.errorField)}
              placeholder="Enter your current password"
              type="password"
            />
          </div>
          <div className="flex flex-col">
            <Input
              {...form.register(newPasswordName)}
              className={clsx(AUTH_STYLES.field, newPasswordError && AUTH_STYLES.errorField)}
              placeholder="Enter your new password"
              type="password"
            />
          </div>
        </div>
        {/* 에러 메시지 영역 - 항상 공간 차지 */}
        <div className="min-h-[12px] text-[10px] text-red-500">
          {currentPasswordError?.message || newPasswordError?.message || ""}
        </div>
      </div>
    </div>
  )
}
