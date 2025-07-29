import clsx from "clsx"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { useEmailVerification } from "@/hooks/useEmailVerification"
import type { EmailVerifyProps } from "@/types/auth"

export function EmailVerificationField({
  emailName,
  codeName,
  emailLabel = "Email",
  emailPlaceholder = "Enter your email",
  codePlaceholder = "Enter verification code",
  disabled = false,
}: EmailVerifyProps) {
  const { control, formState } = useFormContext()
  const { emailSent, emailVerified, isLoading, handleSendEmailCode, handleVerifyEmailCode } =
    useEmailVerification({ codeName, emailName })

  const emailError = formState.errors[emailName]?.message as string | undefined
  const codeError = formState.errors[codeName]?.message as string | undefined

  return (
    <div className="mb-2.5 flex w-full flex-col gap-1">
      {/* Email Field */}
      <FormField
        control={control}
        name={emailName}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col">
            <div className="flex w-full items-center justify-between">
              <FormLabel className={AUTH_STYLES.label}>{emailLabel}</FormLabel>
            </div>
            <div className="flex h-[35px] gap-1.5">
              <div className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className={clsx(AUTH_STYLES.field, emailError && AUTH_STYLES.errorField)}
                    disabled={disabled || emailVerified}
                    placeholder={emailPlaceholder}
                    type="email"
                  />
                </FormControl>
              </div>
              <Button
                className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnPri)}
                disabled={emailVerified || isLoading || disabled}
                onClick={handleSendEmailCode}
                type="button"
              >
                {emailSent ? "Resent" : "Sent"}
              </Button>
            </div>
          </FormItem>
        )}
      />

      {/* Verification Code Field */}
      <FormField
        control={control}
        name={codeName}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col">
            <div className="mt-1.5 flex h-[35px] gap-1.5">
              <div className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className={clsx(AUTH_STYLES.field, codeError && AUTH_STYLES.errorField)}
                    disabled={!emailSent || disabled || emailVerified}
                    placeholder={codePlaceholder}
                  />
                </FormControl>
              </div>
              <Button
                className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnSec)}
                disabled={isLoading || !emailSent || emailVerified || disabled}
                onClick={handleVerifyEmailCode}
                type="button"
              >
                {emailVerified ? "Verified" : "Confirm"}
              </Button>
            </div>
          </FormItem>
        )}
      />

      {/* Status and Error Messages */}
      <div className="flex flex-col">
        {emailVerified && <span className="text-[10px] text-green-600">Verified</span>}
        <span className={clsx(AUTH_STYLES.errorMessage, !(emailError || codeError) && "invisible")}>
          {emailError || codeError || "placeholder"}
        </span>
      </div>
    </div>
  )
}
