import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { DEFAULT_EMAIL_VERIFY, DEV_CONFIG, VALIDATION } from "@/constants/auth"
import { emailSchema, verificationCodeSchema } from "@/lib/auth-schemas"
import type {
  EmailVerificationState,
  UseEmailVerificationProps,
  UseEmailVerificationReturn,
} from "@/types/auth"

export function useEmailVerification({
  emailName,
  codeName,
}: UseEmailVerificationProps): UseEmailVerificationReturn {
  const { watch, setError, clearErrors } = useFormContext()
  const [state, setState] = useState<EmailVerificationState>(DEFAULT_EMAIL_VERIFY)

  const emailValue = watch(emailName) as string
  const codeValue = watch(codeName) as string

  // 이메일 인증 코드 전송
  const handleSendEmailCode = async (): Promise<void> => {
    // 이미 인증된 상태면 반환
    if (state.isVerified) return

    // Zod 스키마로 이메일 유효성 검증
    const result = emailSchema.safeParse(emailValue)
    if (!result.success) {
      setError(emailName, { message: result.error.issues[0].message })
      return
    }
    clearErrors(emailName)

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.apiDelay))
      setState(prev => ({ ...prev, isLoading: false, isSent: true }))
    } catch (_error) {
      setState(prev => ({ ...prev, isLoading: false }))
      setError(emailName, { message: VALIDATION.messages.verification.sendFail })
    }
  }

  // 이메일 인증 코드 확인
  const handleVerifyEmailCode = async (): Promise<void> => {
    // 이미 인증된 상태면 반환
    if (state.isVerified) return

    // 코드가 전송되지 않았으면 반환
    if (!state.isSent) {
      setError(codeName, { message: "먼저 인증 코드를 전송해주세요." })
      return
    }

    // Zod 스키마로 코드 유효성 검증
    const result = verificationCodeSchema.safeParse(codeValue)
    if (!result.success) {
      setError(codeName, { message: result.error.issues[0].message })
      return
    }
    clearErrors(codeName)

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.apiDelay))
      console.log(`이메일 인증 코드 확인: ${codeValue}`)
      setState(prev => ({ ...prev, isLoading: false, isVerified: true }))
    } catch (error) {
      console.error("인증 실패:", error)
      setState(prev => ({ ...prev, isLoading: false }))
      setError(codeName, { message: VALIDATION.messages.verification.verifyFail })
    }
  }

  return {
    // 상태
    emailSent: state.isSent,
    emailVerified: state.isVerified,
    // 핸들러
    handleSendEmailCode,
    handleVerifyEmailCode,
    isLoading: state.isLoading,
  }
}
