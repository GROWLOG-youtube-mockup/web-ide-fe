import clsx from "clsx"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { DEFAULT_EMAIL_VERIFY, DEV_CONFIG, VALIDATION } from "@/constants/auth"
import { AUTH_STYLES } from "@/constants/auth-styles"
import { emailSchema, verificationCodeSchema } from "@/lib/auth-schemas"
import type { EmailVerificationState } from "@/types/auth"

interface EmailVerifyProps {
  emailName: string
  codeName: string
  emailLabel?: string
  emailPlaceholder?: string
  codePlaceholder?: string
  disabled?: boolean
}

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
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext()
  const [state, setState] = useState<EmailVerificationState>(DEFAULT_EMAIL_VERIFY)

  const emailValue = watch(emailName)
  const codeValue = watch(codeName)
  const emailError = errors[emailName]?.message as string | undefined
  const codeError = errors[codeName]?.message as string | undefined

  // 이메일 코드 전송
  const handleSend = async () => {
    const result = emailSchema.safeParse(emailValue)
    if (!result.success) {
      setError(emailName, { message: result.error.issues[0].message })
      return
    }
    clearErrors(emailName)

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.apiDelay))
      console.log(`이메일 인증 코드 전송: ${emailValue}`)
      setState(prev => ({ ...prev, isLoading: false, isSent: true }))
    } catch (error) {
      console.error("이메일 전송 실패:", error)
      setState(prev => ({ ...prev, isLoading: false }))
      setError(emailName, { message: VALIDATION.messages.verification.sendFail })
    }
  }

  // 코드 확인
  const handleVerify = async () => {
    const result = verificationCodeSchema.safeParse(codeValue)
    if (!result.success) {
      setError(codeName, { message: result.error.issues[0].message })
      return
    }
    clearErrors(codeName)

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.apiDelay))
      console.log(`이메일 인증 코드 확인: ${codeValue}`)
      setState(prev => ({ ...prev, isLoading: false, isVerified: true }))
    } catch (error) {
      console.error("인증 실패:", error)
      setState(prev => ({ ...prev, isLoading: false }))
      setError(codeName, { message: VALIDATION.messages.verification.verifyFail })
    }
  }

  return (
    <div className="mb-2.5 flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <label className={AUTH_STYLES.label} htmlFor={emailName}>
          {emailLabel}
        </label>
      </div>

      <div className="flex flex-col">
        {/* 이메일 입력 */}
        <div className="flex h-[35px] gap-1.5">
          <div className="flex-1">
            <Input
              {...register(emailName)}
              className={clsx(AUTH_STYLES.field, emailError && AUTH_STYLES.errorField)}
              disabled={disabled || state.isVerified}
              id={emailName}
              placeholder={emailPlaceholder}
              type="email"
            />
          </div>
          <Button
            className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnPri)}
            disabled={state.isLoading || state.isSent || disabled}
            onClick={handleSend}
            type="button"
          >
            {state.isLoading ? "Sending..." : state.isSent ? "Sent" : "Send code"}
          </Button>
        </div>

        {/* 인증 코드 입력 */}
        <div className="mt-1.5 flex h-[35px] gap-1.5">
          <div className="flex-1">
            <Input
              {...register(codeName)}
              className={clsx(AUTH_STYLES.field, codeError && AUTH_STYLES.errorField)}
              disabled={!state.isSent || disabled || state.isVerified}
              id={codeName}
              placeholder={codePlaceholder}
            />
          </div>
          <Button
            className={clsx(AUTH_STYLES.btnSm, AUTH_STYLES.btnSec)}
            disabled={state.isLoading || !state.isSent || state.isVerified || disabled}
            onClick={handleVerify}
            type="button"
          >
            {state.isLoading ? "Checking..." : state.isVerified ? "Verified" : "Confirm"}
          </Button>
        </div>

        {/* 에러 메시지 */}
        <span className={clsx(AUTH_STYLES.errorMessage, !(emailError || codeError) && "invisible")}>
          {emailError || codeError || "placeholder"}
        </span>
      </div>
    </div>
  )
}
