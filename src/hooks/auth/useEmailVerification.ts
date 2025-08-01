import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useToast } from "@/components/common/ToastContext"
import { DEFAULT_EMAIL_VERIFY, VALIDATION } from "@/constants/auth"
import { emailSchema, verificationCodeSchema } from "@/lib/auth-schemas"
import { sendEmailVerification, verifyEmail } from "@/services/api/auth"
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
  const { addToast } = useToast()

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
      const response = await sendEmailVerification({ email: emailValue })

      if (response.success) {
        setState(prev => ({ ...prev, isLoading: false, isSent: true }))
        // 서버로부터 받은 성공 메시지를 toast로 표시
        // response.data는 Record<string, string> 형태이므로 첫 번째 값 사용
        const message = response.data
          ? Object.values(response.data)[0] || "Verification email sent successfully"
          : "Verification email sent successfully"
        addToast({
          type: "success",
          title: message,
          duration: 3000,
        })
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        const errorMessage = response.error?.message || VALIDATION.messages.verification.sendFail
        // 서버 에러는 toast로만 표시
        addToast({
          type: "error",
          title: errorMessage,
          duration: 3000,
        })
      }
    } catch (_error) {
      setState(prev => ({ ...prev, isLoading: false }))
      const errorMessage = VALIDATION.messages.verification.sendFail
      // 네트워크 에러는 toast로만 표시
      addToast({
        type: "error",
        title: errorMessage,
        duration: 3000,
      })
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
      const response = await verifyEmail({
        email: emailValue,
        code: codeValue,
      })

      if (response.success) {
        // API 응답이 Record<string, boolean> 형태이므로 적절한 키 확인 필요
        const isVerified = Object.values(response.data || {}).some(Boolean)

        if (isVerified) {
          setState(prev => ({ ...prev, isLoading: false, isVerified: true }))
          // 인증 성공 메시지를 toast로 표시
          addToast({
            type: "success",
            title: "Email verification completed successfully!",
            duration: 3000,
          })
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
          const errorMessage = "code is not valid"
          setError(codeName, { message: errorMessage })
          // 인증 코드 오류는 하단 에러 메시지만 표시 (toast 제거)
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        const errorMessage = response.error?.message || VALIDATION.messages.verification.verifyFail
        // 서버 에러는 toast로만 표시
        addToast({
          type: "error",
          title: errorMessage,
          duration: 3000,
        })
      }
    } catch (_error) {
      setState(prev => ({ ...prev, isLoading: false }))
      const errorMessage = VALIDATION.messages.verification.verifyFail
      // 네트워크 에러는 toast로만 표시
      addToast({
        type: "error",
        title: errorMessage,
        duration: 3000,
      })
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
