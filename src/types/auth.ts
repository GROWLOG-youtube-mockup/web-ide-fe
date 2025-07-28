// 인증 관련 타입 정의
import type { z } from "zod"
import type {
  emailSchema,
  loginFormSchema,
  nameSchema,
  passwordSchema,
  signUpFormSchema,
  verificationCodeSchema,
} from "@/lib/auth-schemas"

// Zod 스키마에서 타입 추출
export type LoginFormData = z.infer<typeof loginFormSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>

// 개별 필드 타입
export type EmailData = z.infer<typeof emailSchema>
export type PasswordData = z.infer<typeof passwordSchema>
export type NameData = z.infer<typeof nameSchema>
export type VerificationCodeData = z.infer<typeof verificationCodeSchema>

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
