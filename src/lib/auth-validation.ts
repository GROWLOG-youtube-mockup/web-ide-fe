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

// 검증 결과 타입
export interface ValidationResult {
  isValid: boolean
  message: string | null
}

// 실시간 검증 정의
const createValidator =
  (schema: z.ZodString) =>
  (value: string, isSubmit = false): ValidationResult => {
    if (!isSubmit && !value.trim()) {
      return { isValid: true, message: null }
    }

    const result = schema.safeParse(value)
    return {
      isValid: result.success,
      message: result.success ? null : result.error.issues[0].message,
    }
  }

// 검증
export const validateEmail = createValidator(emailSchema)
export const validatePassword = createValidator(passwordSchema)

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
