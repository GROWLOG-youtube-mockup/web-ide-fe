import { useState } from "react"
import { DEFAULT_EMAIL_VERIFICATION, DEV_CONFIG, VALIDATION } from "@/constants/auth"
import { validateField } from "@/lib/auth-schemas"
import type { EmailVerificationState } from "@/types/auth"

export const useEmailVerification = (setFieldError: (field: string, error: string) => void) => {
  const [emailVerification, setEmailVerification] = useState<EmailVerificationState>(
    DEFAULT_EMAIL_VERIFICATION
  )

  // 상태 업데이트 헬퍼
  const updateAuth = (updates: Partial<EmailVerificationState>) => {
    setEmailVerification(prev => ({ ...prev, ...updates }))
  }

  // API(수정필요: 실제 API 호출로 변경)
  const simulateApi = (message: string) => {
    console.log(message)
    return new Promise<void>(resolve => setTimeout(resolve, DEV_CONFIG.apiDelay))
  }

  // 이메일 인증 코드 전송
  const sendVerificationCode = async (email: string) => {
    const error = validateField("email", email, true)
    if (error) {
      setFieldError("email", error)
      return false
    }

    updateAuth({ isLoading: true })

    try {
      await simulateApi(`이메일 인증 코드 전송: ${email}`)
      updateAuth({ isLoading: false, isSent: true })
      return true
    } catch (error) {
      console.error("이메일 전송 실패:", error)
      updateAuth({ isLoading: false })
      return false
    }
  }

  // 이메일 인증 코드 확인
  const verifyCode = async (verificationCode: string) => {
    const error = validateField("verificationCode", verificationCode, true)
    if (error) {
      setFieldError("verificationCode", error)
      return false
    }

    updateAuth({ isLoading: true })

    try {
      await simulateApi(`이메일 인증 코드 확인: ${verificationCode}`)
      updateAuth({ isLoading: false, isVerified: true })
      return true
    } catch (error) {
      console.error("인증 실패:", error)
      updateAuth({ isLoading: false })
      setFieldError("verificationCode", VALIDATION.messages.verification.invalid)
      return false
    }
  }

  // 이메일 인증 필요 여부 확인
  const checkEmailVerification = () => {
    if (!emailVerification.isVerified) {
      setFieldError("email", VALIDATION.messages.verification.required)
      return false
    }
    return true
  }

  return {
    checkEmailVerification,
    emailVerification,
    isEmailVerified: () => emailVerification.isVerified,
    sendVerificationCode,
    verifyCode,
  }
}
