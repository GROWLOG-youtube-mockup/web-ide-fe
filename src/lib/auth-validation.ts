import { z } from "zod"

// Zod 스키마 정의
export const emailSchema = z.string().min(1, "Enter your email").email("Not a valid email format")

export const passwordSchema = z
  .string()
  .min(1, "Enter your password")
  .min(8, "Password must be at least 8 char")
  .max(16, "Password can be up to 16 char")
  .regex(/[a-zA-Z]/, "Must contain English char")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special char")

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

// 타입 추출
export type LoginFormData = z.infer<typeof loginFormSchema>

// 폼 에러 상태 타입
export interface FormErrors {
  email: string
  password: string
}

// 스키마 매핑 (더 직접적이고 간결함)
const fieldSchemas = {
  email: emailSchema,
  password: passwordSchema,
} as const

// 필드 검증 (실시간/제출시 공통 사용) - 단일 검증 함수로 통합
export const validateField = (field: keyof FormErrors, value: string, isSubmit = false): string => {
  // 실시간 검증 시 빈 값은 에러로 처리하지 않음
  if (!isSubmit && !value.trim()) {
    return ""
  }

  const schema = fieldSchemas[field]
  const result = schema.safeParse(value)

  return result.success ? "" : result.error.issues[0].message
}

// 전체 폼 검증 (제출 시 사용)
export const validateLoginForm = (email: string, password: string) => {
  const result = loginFormSchema.safeParse({ email, password })

  if (result.success) {
    return {
      email: null,
      isValid: true,
      password: null,
    }
  }

  // 에러 메시지 추출
  const fieldErrors = result.error.flatten().fieldErrors
  return {
    email: fieldErrors.email?.[0] || null,
    isValid: false,
    password: fieldErrors.password?.[0] || null,
  }
}
