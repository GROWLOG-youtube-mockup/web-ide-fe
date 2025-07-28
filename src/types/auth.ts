// 인증 관련 타입 정의
import type { z } from "zod"
import type { loginFormSchema, signUpFormSchema } from "@/lib/auth-schemas"

// Zod 스키마에서 타입 추출
export type LoginFormData = z.infer<typeof loginFormSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>

// 폼 에러 상태 타입 (제네릭으로 통합)
export type FormErrors<T = LoginFormData> = Record<keyof T, string>

// 모든 필드를 포함하는 에러 타입
export type AllFormErrors = FormErrors<SignUpFormData>

// 이메일 인증 상태 타입
export interface EmailVerificationState {
  isLoading: boolean
  isSent: boolean
  isVerified: boolean
}

// 이메일 인증 필드 에러 타입
export interface EmailVerificationErrors {
  email?: string
  verificationCode?: string
}

// 공통 필드 입력 Props 타입
export interface FieldInputProps {
  id: string
  type?: string
  placeholder: string
  value: string
  error?: string
  onChange: (value: string) => void
  disabled?: boolean
}

// 이메일 인증 필드 Props 타입
export interface EmailVerificationFieldProps {
  email: string
  verificationCode: string
  errors: EmailVerificationErrors
  emailVerification: EmailVerificationState
  onEmailChange: (value: string) => void
  onCodeChange: (value: string) => void
  onSendCode: () => void
  onVerifyCode: () => void
}
