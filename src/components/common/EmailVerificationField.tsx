import clsx from "clsx"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AUTH_STYLES } from "@/constants/auth-styles"
import type { EmailVerificationFieldProps } from "@/types/auth"

export function EmailVerificationField({
  email,
  verificationCode,
  errors,
  emailVerification,
  onEmailChange,
  onCodeChange,
  onSendCode,
  onVerifyCode,
}: EmailVerificationFieldProps) {
  const hasErrors = errors.email || errors.verificationCode

  return (
    <div className={clsx("flex w-full flex-col", !hasErrors && "gap-2")}>
      {/* Email Input Row */}
      <div className="flex h-[35px] gap-1.5">
        <div className="flex-1">
          <Input
            className={clsx(
              AUTH_STYLES.field,
              AUTH_STYLES.focus,
              errors.email && AUTH_STYLES.errorField
            )}
            id="email"
            onChange={e => onEmailChange(e.target.value)}
            placeholder="Enter your email"
            type="email"
            value={email}
          />
        </div>
        <Button
          className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnPri)}
          disabled={emailVerification.isLoading || emailVerification.isSent}
          onClick={onSendCode}
          type="button"
        >
          {emailVerification.isLoading
            ? "Sending..."
            : emailVerification.isSent
              ? "Sent"
              : "Send code"}
        </Button>
      </div>
      {errors.email && <p className={AUTH_STYLES.errorMessage}>{errors.email}</p>}

      {/* Verification Code Input Row */}
      <div className={clsx("flex h-[35px] gap-1.5", errors.verificationCode && "mt-2")}>
        <div className="flex-1">
          <Input
            className={clsx(
              AUTH_STYLES.field,
              AUTH_STYLES.focus,
              errors.verificationCode && AUTH_STYLES.errorField
            )}
            disabled={!emailVerification.isSent}
            onChange={e => onCodeChange(e.target.value)}
            placeholder="Enter your code"
            value={verificationCode}
          />
        </div>
        <Button
          className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnSec)}
          disabled={
            emailVerification.isLoading || !emailVerification.isSent || emailVerification.isVerified
          }
          onClick={onVerifyCode}
          type="button"
        >
          {emailVerification.isLoading
            ? "Checking..."
            : emailVerification.isVerified
              ? "Verified"
              : "Confirm"}
        </Button>
      </div>
      {errors.verificationCode && (
        <p className={AUTH_STYLES.errorMessage}>{errors.verificationCode}</p>
      )}
    </div>
  )
}
