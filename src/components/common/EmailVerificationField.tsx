import clsx from "clsx"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/Button"
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
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { emailSent, emailVerified, isLoading, handleSendEmailCode, handleVerifyEmailCode } =
    useEmailVerification({ codeName, emailName })

  const emailError = errors[emailName]?.message as string | undefined
  const codeError = errors[codeName]?.message as string | undefined

  return (
    <div className="mb-2.5 flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <label className={AUTH_STYLES.label} htmlFor={emailName}>
          {emailLabel}
        </label>
      </div>

      <div className="flex flex-col">
        {/* email */}
        <div className="flex h-[35px] gap-1.5">
          <div className="flex-1">
            <Input
              {...register(emailName)}
              className={clsx(AUTH_STYLES.field, emailError && AUTH_STYLES.errorField)}
              disabled={disabled || emailVerified}
              id={emailName}
              placeholder={emailPlaceholder}
              type="email"
            />
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

        {/* emailcode */}
        <div className="mt-1.5 flex h-[35px] gap-1.5">
          <div className="flex-1">
            <Input
              {...register(codeName)}
              className={clsx(AUTH_STYLES.field, codeError && AUTH_STYLES.errorField)}
              disabled={!emailSent || disabled || emailVerified}
              id={codeName}
              placeholder={codePlaceholder}
            />
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
        {/* done */}
        {emailVerified && <span className="text-[10px] text-green-600">Verified</span>}
        {/* error */}
        <span className={clsx(AUTH_STYLES.errorMessage, !(emailError || codeError) && "invisible")}>
          {emailError || codeError || "placeholder"}
        </span>
      </div>
    </div>
  )
}
