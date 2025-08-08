import clsx from "clsx"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem } from "@/shared/components/custom-form"
import { AUTH_STYLES } from "@/shared/constants/auth-styles"
import { Input } from "@/shared/ui/input"

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
  return (
    <div className="space-y-1.5">
      <div className="font-semibold text-[10.667px] text-zinc-950 leading-4">Password</div>
      <div className="space-y-[3px]">
        <p className="font-normal text-[9.333px] text-zinc-500 leading-[13.333px]">
          Must be at least 8 characters long, including both letters and numbers.
        </p>
        <div className="space-y-1.5">
          <FormField
            control={form.control}
            name={currentPasswordName}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className={clsx(AUTH_STYLES.field, fieldState.error && AUTH_STYLES.errorField)}
                    placeholder="Enter your current password"
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={newPasswordName}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className={clsx(AUTH_STYLES.field, fieldState.error && AUTH_STYLES.errorField)}
                    placeholder="Enter your new password"
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* 에러 메시지 영역 - 항상 공간 차지 */}
        <div className="min-h-[12px] text-[10px] text-red-500">
          {String(
            form.formState.errors[currentPasswordName]?.message ||
              form.formState.errors[newPasswordName]?.message ||
              ""
          )}
        </div>
      </div>
    </div>
  )
}
