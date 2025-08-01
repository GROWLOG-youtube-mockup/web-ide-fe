// 인증 관련 타입 정의
import type { z } from "zod"
import type { loginFormSchema, profileEditFormSchema, signUpFormSchema } from "@/lib/auth-schemas"

// Zod 스키마에서 타입 추출
export type LoginFormData = z.infer<typeof loginFormSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>
export type ProfileEditFormData = z.infer<typeof profileEditFormSchema>

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

// 이메일 인증 필드 컴포넌트 Props 타입
export interface EmailVerifyProps {
  emailName: string
  codeName: string
  emailLabel?: string
  emailPlaceholder?: string
  codePlaceholder?: string
  disabled?: boolean
  onVerificationChange?: (isVerified: boolean) => void
}

// 이메일 인증 훅 타입
export interface UseEmailVerificationProps {
  emailName: string
  codeName: string
}

export interface UseEmailVerificationReturn {
  // 상태
  emailSent: boolean
  emailVerified: boolean
  isLoading: boolean
  // 핸들러
  handleSendEmailCode: () => Promise<void>
  handleVerifyEmailCode: () => Promise<void>
}
